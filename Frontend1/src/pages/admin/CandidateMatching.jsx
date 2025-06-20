import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import JobService from '../../services/job.service';
import ApplicationService from '../../services/application.service';
import { formatDate } from '../../utils/formatters';

const CandidateMatching = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Fetch job details and matching candidates on component mount
  useEffect(() => {
    const fetchJobAndCandidates = async () => {
      try {
        setLoading(true);
          // Fetch job details
        const jobData = await JobService.getJobById(id);
        setJob(jobData);
        
        // Fetch matching candidates
        const candidatesData = await JobService.getMatchingCandidates(id);
        setCandidates(candidatesData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
        toast.error('Failed to fetch job and candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobAndCandidates();
  }, [id]);
  
  // Toggle candidate selection for bulk actions
  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };
  
  // Select all candidates
  const selectAllCandidates = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(candidate => candidate.id));
    }
  };
  
  // Handle application status update
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setActionLoading(true);
      await ApplicationService.updateApplicationStatus(applicationId, status);
      
      // Update the local state to reflect the change
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.applicationId === applicationId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
      toast.success(`Candidate ${status === 'shortlisted' ? 'shortlisted' : status} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update candidate status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle bulk action for multiple candidates
  const handleBulkAction = async (action) => {
    if (selectedCandidates.length === 0) {
      toast.info('Please select at least one candidate');
      return;
    }
    
    try {
      setActionLoading(true);
      
      // Map candidates to their application IDs
      const selectedApplicationIds = candidates
        .filter(candidate => selectedCandidates.includes(candidate.id))
        .map(candidate => candidate.applicationId);
      
      // Update status for each application
      const updatePromises = selectedApplicationIds.map(appId => 
        ApplicationService.updateApplicationStatus(appId, action)
      );
      
      await Promise.all(updatePromises);
      
      // Update the local state to reflect the changes
      setCandidates(prev => 
        prev.map(candidate => 
          selectedCandidates.includes(candidate.id) 
            ? { ...candidate, status: action } 
            : candidate
        )
      );
      
      // Clear selection
      setSelectedCandidates([]);
      
      toast.success(`${selectedCandidates.length} candidates ${action === 'shortlisted' ? 'shortlisted' : action} successfully`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to update candidate statuses. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  if (loading) return <Loading center size="lg" />;
  
  if (error || !job) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error || 'Failed to load job details'}</p>
        <Button onClick={() => navigate('/admin/jobs')}>Back to Jobs</Button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidate Matching</h1>
        <Button variant="outline" onClick={() => navigate('/admin/jobs')}>
          Back to Jobs
        </Button>
      </div>
      
      {/* Job Summary */}
      <Card title="Job Summary" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium">{job.title}</h3>
            <p className="text-gray-600">{job.department} • {job.location}</p>
            <p className="text-gray-600">Posted on: {formatDate(job.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Type:</span> {job.type}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Experience:</span> {job.experience}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Deadline:</span> {formatDate(job.applicationDeadline)}
            </p>
          </div>
        </div>
        
        {job.skills && job.skills.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="primary" className="capitalize">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
      
      {/* Candidates List */}
      <Card title={`Matching Candidates (${candidates.length})`} className="mb-6">
        {candidates.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matching candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">Wait for candidates to apply or adjust the job requirements.</p>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedCandidates.length === candidates.length}
                  onChange={selectAllCandidates}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {selectedCandidates.length} of {candidates.length} selected
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedCandidates.length === 0 || actionLoading}
                  onClick={() => handleBulkAction('shortlisted')}
                >
                  Shortlist Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedCandidates.length === 0 || actionLoading}
                  onClick={() => handleBulkAction('rejected')}
                >
                  Reject Selected
                </Button>
              </div>
            </div>
            
            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedCandidates.length === candidates.length}
                          onChange={selectAllCandidates}
                        />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills Match
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedCandidates.includes(candidate.id)}
                            onChange={() => toggleCandidateSelection(candidate.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {candidate.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 w-24 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                candidate.matchScore >= 80 ? 'bg-green-500' : 
                                candidate.matchScore >= 60 ? 'bg-blue-500' : 
                                candidate.matchScore >= 40 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${candidate.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{candidate.matchScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.matchedSkills?.map((skill, index) => (
                            <Badge key={index} variant="success" size="sm" className="capitalize">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.missingSkills?.map((skill, index) => (
                            <Badge key={index} variant="danger" size="sm" className="capitalize">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={
                            candidate.status === 'shortlisted' ? 'primary' : 
                            candidate.status === 'rejected' ? 'danger' : 
                            candidate.status === 'hired' ? 'success' : 
                            'default'
                          }
                        >
                          {candidate.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(candidate.appliedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/admin/resumes/${candidate.resumeId}`, '_blank')}
                          >
                            View Resume
                          </Button>
                          {candidate.status !== 'shortlisted' && (
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={actionLoading}
                              onClick={() => updateApplicationStatus(candidate.applicationId, 'shortlisted')}
                            >
                              Shortlist
                            </Button>
                          )}
                          {candidate.status !== 'rejected' && (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={actionLoading}
                              onClick={() => updateApplicationStatus(candidate.applicationId, 'rejected')}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
      
      {/* AI Insights */}
      <Card title="AI Insights">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Candidate Pool Analysis</h3>
            <p className="text-blue-700">
              Based on the current candidate pool, this job posting is attracting candidates with strong skills in 
              {job.skills?.slice(0, 3).map((skill, i) => (
                <span key={i} className="font-medium"> {skill}{i < Math.min(2, job.skills.length - 1) ? ',' : ''}</span>
              ))}. 
              Consider adjusting the job requirements to attract more candidates with experience in emerging technologies.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Top Candidate Recommendations</h3>
            <p className="text-green-700">
              {candidates.length > 0 
                ? `The top ${Math.min(3, candidates.length)} candidates have an average match score of ${
                    Math.round(
                      candidates
                        .sort((a, b) => b.matchScore - a.matchScore)
                        .slice(0, 3)
                        .reduce((acc, curr) => acc + curr.matchScore, 0) / Math.min(3, candidates.length)
                    )
                  }%. These candidates show strong alignment with the job requirements.`
                : 'No candidates have applied yet. Consider promoting this job posting on social media or job boards.'
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CandidateMatching;
