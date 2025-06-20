import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getInterviewById, updateInterviewStatus } from '../../services/interview.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import { formatDate, formatTime } from '../../utils/formatters';

const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const interviewData = await getInterviewById(id);
        setInterview(interviewData);
      } catch (err) {
        console.error('Error fetching interview details:', err);
        setError('Failed to load interview details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      
      await updateInterviewStatus(id, { status });
      
      setInterview({
        ...interview,
        status
      });
      
      setMessage(`Interview ${status.toLowerCase()} successfully!`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating interview status:', err);
      setError(`Failed to ${status.toLowerCase()} interview. Please try again later.`);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'blue';
      case 'CONFIRMED':
        return 'green';
      case 'RESCHEDULED':
        return 'purple';
      case 'CANCELED':
        return 'red';
      case 'COMPLETED':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Scheduled';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'RESCHEDULED':
        return 'Rescheduled';
      case 'CANCELED':
        return 'Canceled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl mb-4">Interview not found</h2>
        <Button onClick={() => navigate('/applications/status')}>View Applications</Button>
      </div>
    );
  }

  const isUpcoming = new Date(interview.date) > new Date();
  const isPastOrToday = new Date(interview.date) <= new Date();
  const canConfirm = interview.status === 'SCHEDULED';
  const canCancel = ['SCHEDULED', 'CONFIRMED'].includes(interview.status) && isUpcoming;
  const canComplete = interview.status !== 'COMPLETED' && interview.status !== 'CANCELED' && isPastOrToday;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/applications/status')}
          className="mb-4"
        >
          ← Back to Applications
        </Button>
        
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Interview Details</h1>
              <Badge 
                color={getStatusColor(interview.status)} 
                className="text-sm px-3 py-1"
              >
                {getStatusLabel(interview.status)}
              </Badge>
            </div>
          </div>
          
          {message && (
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Interview Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-600 text-sm">Position</div>
                  <div>{interview.job?.title || "Position"}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Company</div>
                  <div>{interview.job?.company || "Company"}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Date</div>
                  <div>{formatDate(interview.date)}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Time</div>
                  <div>{formatTime(interview.startTime)} - {formatTime(interview.endTime)}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Type</div>
                  <div>{interview.type || "Not specified"}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Location/Details</h2>
              <div className="space-y-3">
                {interview.location && (
                  <div>
                    <div className="text-gray-600 text-sm">Location</div>
                    <div>{interview.location}</div>
                  </div>
                )}
                
                {interview.meetingLink && (
                  <div>
                    <div className="text-gray-600 text-sm">Meeting Link</div>
                    <a 
                      href={interview.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {interview.meetingLink}
                    </a>
                  </div>
                )}
                
                {interview.interviewers && interview.interviewers.length > 0 && (
                  <div>
                    <div className="text-gray-600 text-sm">Interviewers</div>
                    <div>
                      {interview.interviewers.map((interviewer, index) => (
                        <div key={index}>
                          {interviewer.name} - {interviewer.title || "Interviewer"}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {interview.instructions && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Instructions</h2>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{interview.instructions}</p>
              </div>
            </div>
          )}
          
          <div className="border-t pt-6">
            <div className="flex flex-wrap gap-3">
              {canConfirm && (
                <Button 
                  onClick={() => handleStatusUpdate('CONFIRMED')}
                  disabled={updating}
                  loading={updating && interview.status === 'SCHEDULED'}
                >
                  Confirm Interview
                </Button>
              )}
              
              {canCancel && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusUpdate('CANCELED')}
                  disabled={updating}
                  loading={updating && interview.status !== 'CANCELED'}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Cancel Interview
                </Button>
              )}
              
              {canComplete && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={updating}
                  loading={updating && interview.status !== 'COMPLETED'}
                >
                  Mark as Completed
                </Button>
              )}
              
              {interview.status === 'SCHEDULED' && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/interview/reschedule/${id}`)}
                >
                  Request Reschedule
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Preparation Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Research the company and the role thoroughly</li>
          <li>Review common interview questions for your position</li>
          <li>Prepare examples from your past experience that demonstrate your skills</li>
          <li>Test your equipment in advance if it's a virtual interview</li>
          <li>Arrive (or log in) 10-15 minutes early</li>
          <li>Bring a copy of your resume and any other relevant documents</li>
          <li>Prepare thoughtful questions to ask the interviewer</li>
        </ul>
      </Card>
    </div>
  );
};

export default InterviewDetails;
