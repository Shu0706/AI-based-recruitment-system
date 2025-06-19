import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getApplications } from '../../services/application.service';
import { getJobs } from '../../services/job.service';
import { getInterviews } from '../../services/interview.service';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    jobMatches: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch applications
        const applicationsData = await getApplications();
        setRecentApplications(applicationsData.slice(0, 3));
        
        // Fetch recommended jobs
        const jobsData = await getJobs({ recommended: true });
        setRecommendedJobs(jobsData.slice(0, 3));
        
        // Fetch upcoming interviews
        const interviewsData = await getInterviews();
        setUpcomingInterviews(interviewsData.slice(0, 3));
        
        // Set stats
        setStats({
          applications: applicationsData.length,
          interviews: interviewsData.length,
          jobMatches: jobsData.length,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge color based on application status
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge badge-warning';
      case 'under review':
        return 'badge badge-info';
      case 'interview scheduled':
        return 'badge badge-success';
      case 'rejected':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Applications</h3>
            <p className="text-2xl font-bold">{stats.applications}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CalendarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Interviews</h3>
            <p className="text-2xl font-bold">{stats.interviews}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <BriefcaseIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Job Matches</h3>
            <p className="text-2xl font-bold">{stats.jobMatches}</p>
          </div>
        </div>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <Link to="/applications" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{app.job.title}</h3>
                    <span className={getStatusBadge(app.status)}>{app.status}</span>
                  </div>
                  <p className="text-gray-600">{app.job.company}</p>
                  <p className="text-sm text-gray-500">Applied on {formatDate(app.appliedDate)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No applications yet.</p>
              <Link to="/jobs" className="btn-primary inline-block mt-2">
                Find Jobs
              </Link>
            </div>
          )}
        </div>
        
        {/* Recommended Jobs */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recommended Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {recommendedJobs.length > 0 ? (
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">{job.location}</span>
                    <span className="text-sm font-medium text-green-600">${job.salary}</span>
                  </div>
                  <div className="mt-2">
                    <Link to={`/jobs/${job.id}`} className="btn-primary text-sm py-1">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No recommended jobs available.</p>
              <Link to="/resume" className="btn-primary inline-block mt-2">
                Update Resume
              </Link>
            </div>
          )}
        </div>
        
        {/* Upcoming Interviews */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Interviews</h2>
            <Link to="/interviews" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {upcomingInterviews.length > 0 ? (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{interview.job.title}</h3>
                      <p className="text-gray-600">{interview.job.company}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      <span>{formatDate(interview.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{interview.time} • {interview.durationType}</span>
                  </div>
                  <div className="mt-2">
                    <Link to={`/interviews/${interview.id}`} className="btn-primary text-sm py-1">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No upcoming interviews scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
