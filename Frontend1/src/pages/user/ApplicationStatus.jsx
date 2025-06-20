import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserApplications } from '../../services/application.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

const ApplicationStatus = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (!user) {
          navigate('/login');
          return;
        }
        
        const applicationsData = await getUserApplications(user.id);
        setApplications(applicationsData);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate, message]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'blue';
      case 'reviewed':
        return 'purple';
      case 'shortlisted':
        return 'indigo';
      case 'interview_scheduled':
        return 'orange';
      case 'interviewed':
        return 'yellow';
      case 'offer_extended':
        return 'green';
      case 'hired':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'Applied';
      case 'reviewed':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'interviewed':
        return 'Interviewed';
      case 'offer_extended':
        return 'Offer Extended';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage(null)}>
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      {applications.length === 0 ? (
        <Card className="p-6 text-center">
          <h2 className="text-xl mb-4">You haven't applied to any jobs yet</h2>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold mb-2">{application.job?.title || "Job Title"}</h2>
                    <div className="text-gray-600 mb-2">{application.job?.company || "Company"}</div>
                    <div className="text-gray-600 mb-2">{application.job?.location || "Location"}</div>
                    <div className="text-gray-600">Applied on {formatDate(application.applyDate)}</div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end">
                    <Badge 
                      color={getStatusColor(application.status)} 
                      className="mb-4 text-sm px-3 py-1"
                    >
                      {getStatusLabel(application.status)}
                    </Badge>
                    
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/jobs/${application.jobId}`)}
                        size="sm"
                      >
                        View Job
                      </Button>
                      
                      {application.status === 'interview_scheduled' && (
                        <Button 
                          onClick={() => navigate(`/interviews/${application.interviewId}`)}
                          size="sm"
                        >
                          View Interview Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {application.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h3 className="font-semibold mb-1">Feedback:</h3>
                    <p>{application.feedback}</p>
                  </div>
                )}
                
                {application.status === 'shortlisted' && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800">
                      Congratulations! Your application has been shortlisted. 
                      We'll contact you soon about the next steps.
                    </p>
                  </div>
                )}
                
                {application.status === 'rejected' && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/jobs')}
                      size="sm"
                    >
                      Browse More Jobs
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationStatus;
