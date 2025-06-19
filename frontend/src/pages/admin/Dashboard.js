import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { getApplications } from '../../services/application.service';
import { getJobs } from '../../services/job.service';
import { getInterviews } from '../../services/interview.service';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    scheduledInterviews: 0,
    pendingReviews: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch applications
        const applicationsData = await getApplications({ admin: true });
        setRecentApplications(applicationsData.slice(0, 5));
        
        // Fetch active jobs
        const jobsData = await getJobs({ status: 'active' });
        setActiveJobs(jobsData.slice(0, 5));
        
        // Fetch upcoming interviews
        const interviewsData = await getInterviews({ admin: true });
        setUpcomingInterviews(interviewsData.slice(0, 5));
        
        // Set stats
        const pendingReviews = applicationsData.filter(app => 
          app.status.toLowerCase() === 'pending' || 
          app.status.toLowerCase() === 'under review'
        ).length;
        
        setStats({
          totalJobs: jobsData.length,
          totalApplications: applicationsData.length,
          scheduledInterviews: interviewsData.length,
          pendingReviews
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <BriefcaseIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Active Jobs</h3>
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <UserGroupIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Applications</h3>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <CalendarIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Interviews</h3>
            <p className="text-2xl font-bold">{stats.scheduledInterviews}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Pending Review</h3>
            <p className="text-2xl font-bold">{stats.pendingReviews}</p>
          </div>
        </div>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Active Jobs</h2>
            <Link to="/admin/jobs" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-semibold">{job.title}</h3>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">Applications: {job.applicationCount || 0}</span>
                    <span className="text-sm text-gray-500">Posted: {formatDate(job.createdAt)}</span>
                  </div>
                  <div className="mt-2">
                    <Link to={`/admin/jobs/${job.id}/candidates`} className="btn-primary text-sm py-1">
                      View Candidates
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No active jobs.</p>
              <Link to="/admin/jobs/create" className="btn-primary inline-block mt-2">
                Create Job
              </Link>
            </div>
          )}
        </div>
        
        {/* Recent Applications */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <ChartBarIcon className="h-5 w-5 text-gray-500" />
          </div>
          
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{app.user.name}</h3>
                    <span className={getStatusBadge(app.status)}>{app.status}</span>
                  </div>
                  <p className="text-gray-600">{app.job.title}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">Match Score: {app.matchScore || 'N/A'}</span>
                    <span className="text-sm text-gray-500">{formatDate(app.appliedDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No applications yet.</p>
            </div>
          )}
        </div>
        
        {/* Upcoming Interviews */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Interviews</h2>
            <Link to="/admin/interviews" className="text-blue-600 hover:text-blue-800">
              Schedule
            </Link>
          </div>
          
          {upcomingInterviews.length > 0 ? (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{interview.candidate.name}</h3>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">{formatDate(interview.date)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{interview.job.title}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{interview.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No upcoming interviews.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recruitment Performance</h2>
          <div className="flex space-x-2">
            <select className="form-input text-sm py-1 px-2">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700">Application Rate</h3>
              <span className="text-green-600 text-sm">+12%</span>
            </div>
            <p className="text-2xl font-bold">68%</p>
            <p className="text-sm text-gray-500 mt-1">Applications per job</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700">Time to Hire</h3>
              <span className="text-green-600 text-sm">-3 days</span>
            </div>
            <p className="text-2xl font-bold">18 days</p>
            <p className="text-sm text-gray-500 mt-1">Average time</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700">Interview Rate</h3>
              <span className="text-red-600 text-sm">-5%</span>
            </div>
            <p className="text-2xl font-bold">42%</p>
            <p className="text-sm text-gray-500 mt-1">Candidates interviewed</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700">Offer Acceptance</h3>
              <span className="text-green-600 text-sm">+8%</span>
            </div>
            <p className="text-2xl font-bold">76%</p>
            <p className="text-sm text-gray-500 mt-1">Acceptance rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
