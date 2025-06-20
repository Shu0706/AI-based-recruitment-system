import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import JobService from '../../services/job.service';
import ApplicationService from '../../services/application.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await JobService.getJobById(id);
        setJob(jobData);
        
        // Check if user has already applied to this job
        if (user && jobData.applications) {
          const hasApplied = jobData.applications.some(app => 
            app.userId === user.id || app.user?.id === user.id
          );
          setApplied(hasApplied);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id, user]);

  const handleApply = async () => {
    try {
      setApplying(true);
      
      // Check if user has a resume
      if (!user.hasResume) {
        navigate('/resume/upload', { 
          state: { redirectAfterUpload: `/jobs/${id}`, message: 'Please upload your resume to apply for this job.' } 
        });
        return;
      }
      
      // Create application
      await ApplicationService.createApplication({
        jobId: id,
        userId: user.id,
        status: 'applied',
        applyDate: new Date().toISOString()
      });
      
      setApplied(true);
      
      // Navigate to application status page
      navigate('/applications/status', { 
        state: { message: 'Your application was submitted successfully!' } 
      });
    } catch (err) {
      console.error('Error applying to job:', err);
      setError('Failed to submit your application. Please try again later.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={() => navigate('/jobs')}>Back to Job Search</Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl mb-4">Job not found</h2>
        <Button onClick={() => navigate('/jobs')}>Back to Job Search</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/jobs')}
          className="mb-4"
        >
          ← Back to Job Search
        </Button>
        
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="text-gray-600 mb-2">{job.company}</div>
              <div className="text-gray-600 mb-2">{job.location}</div>
              <div className="text-gray-600 mb-4">Posted on {formatDate(job.postDate)}</div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge color="blue">{job.employmentType}</Badge>
                <Badge color="green">${job.salaryMin} - ${job.salaryMax}</Badge>
                {job.remote && <Badge color="purple">Remote</Badge>}
                {job.tags && job.tags.map((tag, index) => (
                  <Badge key={index} color="gray">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              {applied ? (
                <Badge color="green" className="text-lg p-2">Applied</Badge>
              ) : (
                <Button 
                  onClick={handleApply} 
                  disabled={applying || !user}
                  isLoading={applying}
                  className="px-6 py-3"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
              )}
              {!user && (
                <div className="mt-2 text-sm text-red-600">
                  Please <a href="/login" className="underline">login</a> to apply
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div className="whitespace-pre-line">{job.description}</div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2">
              {job.requirements && job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              {job.responsibilities && job.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Benefits</h2>
            <ul className="list-disc pl-5 space-y-2">
              {job.benefits && job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 border-t pt-6">
            {applied ? (
              <div className="text-center">
                <Badge color="green" className="text-lg p-2 mb-3">You have applied to this job</Badge>
                <Button 
                  onClick={() => navigate('/applications/status')}
                  className="w-full md:w-auto"
                >
                  View Application Status
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleApply} 
                disabled={applying || !user}
                isLoading={applying}
                className="w-full md:w-auto"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobDetails;
