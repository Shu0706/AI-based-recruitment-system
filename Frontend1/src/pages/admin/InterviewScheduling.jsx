import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import InterviewService from '../../services/interview.service';
import ApplicationService from '../../services/application.service';
import { formatDate, formatDateTime } from '../../utils/formatters';
import useDataFilters from '../../hooks/useDataFilters';

const InterviewScheduling = () => {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: 'remote',
    type: 'technical',
    notes: '',
  });
  
  // Status options for filtering
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'pending', label: 'Pending' },
  ];
  
  // Set up data filtering
  const {
    data: filteredInterviews,
    updateFilter,
    clearFilters,
  } = useDataFilters(interviews, 'scheduledAt', 'desc');
  
  // Fetch interviews and shortlisted candidates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all interviews
        const interviewsResponse = await InterviewService.getAllInterviews();
        setInterviews(interviewsResponse.data || []);
        
        // Fetch shortlisted candidates
        const applicationsResponse = await ApplicationService.getAllApplications({ status: 'shortlisted' });
        setCandidates(applicationsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch interviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle interview scheduling
  const handleScheduleInterview = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }
    
    if (!interviewDetails.date || !interviewDetails.startTime || !interviewDetails.endTime) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setModalLoading(true);
      
      // Format date and time for API
      const scheduledAt = `${interviewDetails.date}T${interviewDetails.startTime}:00`;
      const endAt = `${interviewDetails.date}T${interviewDetails.endTime}:00`;
      
      // Schedule interview
      const response = await InterviewService.scheduleInterview({
        candidateId: selectedCandidate.candidateId,
        applicationId: selectedCandidate.id,
        jobId: selectedCandidate.jobId,
        scheduledAt,
        endAt,
        location: interviewDetails.location,
        type: interviewDetails.type,
        notes: interviewDetails.notes,
      });
      
      // Add new interview to state
      setInterviews(prev => [response.data, ...prev]);
      
      // Close modal and reset form
      setShowScheduleModal(false);
      setSelectedCandidate(null);
      setInterviewDetails({
        date: '',
        startTime: '',
        endTime: '',
        location: 'remote',
        type: 'technical',
        notes: '',
      });
      
      toast.success('Interview scheduled successfully');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Handle interview cancellation
  const handleCancelInterview = async (interviewId) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) {
      return;
    }
    
    try {
      setLoading(true);
      await InterviewService.cancelInterview(interviewId, 'Cancelled by admin');
      
      // Update interview status in state
      setInterviews(prev => 
        prev.map(interview => 
          interview.id === interviewId 
            ? { ...interview, status: 'cancelled' } 
            : interview
        )
      );
      
      toast.success('Interview cancelled successfully');
    } catch (error) {
      console.error('Error cancelling interview:', error);
      toast.error('Failed to cancel interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle interview completion
  const handleCompleteInterview = async (interviewId) => {
    if (!window.confirm('Mark this interview as completed?')) {
      return;
    }
    
    try {
      setLoading(true);
      await InterviewService.updateInterview(interviewId, { status: 'completed' });
      
      // Update interview status in state
      setInterviews(prev => 
        prev.map(interview => 
          interview.id === interviewId 
            ? { ...interview, status: 'completed' } 
            : interview
        )
      );
      
      toast.success('Interview marked as completed');
    } catch (error) {
      console.error('Error updating interview:', error);
      toast.error('Failed to update interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interview Scheduling</h1>
        <Button 
          variant="primary"
          onClick={() => setShowScheduleModal(true)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Schedule Interview
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Interviews"
            placeholder="Search by candidate name or job title..."
            onChange={(e) => updateFilter('candidateName', e.target.value)}
          />
          
          <Select
            label="Status"
            options={statusOptions}
            onChange={(e) => updateFilter('status', e.target.value)}
          />
          
          <div className="flex items-end">
            <Button 
              variant="secondary" 
              className="mb-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Interviews List */}
      {loading ? (
        <Loading center size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Interviews */}
          <Card 
            title="Upcoming Interviews" 
            subtitle={`${filteredInterviews.filter(i => i.status === 'scheduled').length} scheduled interviews`}
          >
            {filteredInterviews.filter(i => i.status === 'scheduled').length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming interviews</h3>
                <p className="mt-1 text-sm text-gray-500">Schedule interviews with shortlisted candidates.</p>
                <div className="mt-6">
                  <Button 
                    variant="primary"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInterviews
                  .filter(interview => interview.status === 'scheduled')
                  .map((interview) => (
                    <InterviewCard 
                      key={interview.id} 
                      interview={interview}
                      onCancel={() => handleCancelInterview(interview.id)}
                      onComplete={() => handleCompleteInterview(interview.id)}
                    />
                  ))}
              </div>
            )}
          </Card>
          
          {/* Past Interviews */}
          <Card 
            title="Past Interviews" 
            subtitle={`${filteredInterviews.filter(i => i.status === 'completed' || i.status === 'cancelled').length} interviews`}
          >
            {filteredInterviews.filter(i => i.status === 'completed' || i.status === 'cancelled').length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No past interviews</h3>
                <p className="mt-1 text-sm text-gray-500">Completed and cancelled interviews will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInterviews
                  .filter(interview => interview.status === 'completed' || interview.status === 'cancelled')
                  .map((interview) => (
                    <InterviewCard 
                      key={interview.id} 
                      interview={interview}
                      isPast={true}
                    />
                  ))}
              </div>
            )}
          </Card>
        </div>
      )}
      
      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Schedule Interview
                  </h3>
                </div>
              </div>
              
              <div className="mt-5">
                {/* Select Candidate */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Candidate <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedCandidate?.id || ''}
                    onChange={(e) => {
                      const candidate = candidates.find(c => c.id === e.target.value);
                      setSelectedCandidate(candidate || null);
                    }}
                  >
                    <option value="">Select a candidate</option>
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.candidate?.name} - {candidate.job?.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Interview Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={interviewDetails.date}
                      onChange={(e) => setInterviewDetails(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={interviewDetails.startTime}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={interviewDetails.endTime}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Interview Type and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={interviewDetails.type}
                      onChange={(e) => setInterviewDetails(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="technical">Technical Interview</option>
                      <option value="hr">HR Interview</option>
                      <option value="culture">Culture Fit</option>
                      <option value="screening">Initial Screening</option>
                      <option value="final">Final Round</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={interviewDetails.location}
                      onChange={(e) => setInterviewDetails(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="remote">Remote (Video Call)</option>
                      <option value="phone">Phone Call</option>
                      <option value="office">Office</option>
                    </select>
                  </div>
                </div>
                
                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows="3"
                    placeholder="Additional notes for the interviewers or candidate..."
                    value={interviewDetails.notes}
                    onChange={(e) => setInterviewDetails(prev => ({ ...prev, notes: e.target.value }))}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={handleScheduleInterview}
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Scheduling...' : 'Schedule Interview'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedCandidate(null);
                    setInterviewDetails({
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: 'remote',
                      type: 'technical',
                      notes: '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Interview Card Component
const InterviewCard = ({ interview, onCancel, onComplete, isPast = false }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="primary">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'technical':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'hr':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'culture':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'screening':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${
            interview.type === 'technical' ? 'bg-blue-100 text-blue-800' : 
            interview.type === 'hr' ? 'bg-green-100 text-green-800' : 
            interview.type === 'culture' ? 'bg-purple-100 text-purple-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {getTypeIcon(interview.type)}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">
              {interview.candidate?.name || 'Candidate'}
            </h3>
            <p className="text-sm text-gray-600">
              {interview.job?.title || 'Job Position'}
            </p>
          </div>
        </div>
        <div className="text-right">
          {getStatusBadge(interview.status)}
        </div>
      </div>
      
      <div className="mt-2 ml-10">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDateTime(interview.scheduledAt)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {interview.location === 'remote' ? 'Remote (Video Call)' : 
             interview.location === 'phone' ? 'Phone Call' : 
             'Office'}
          </span>
        </div>
        
        {interview.notes && (
          <p className="mt-2 text-sm text-gray-600 italic">
            "{interview.notes.length > 80 ? `${interview.notes.substring(0, 80)}...` : interview.notes}"
          </p>
        )}
        
        {!isPast && interview.status === 'scheduled' && (
          <div className="mt-3 flex space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={onComplete}
            >
              Mark Completed
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewScheduling;
