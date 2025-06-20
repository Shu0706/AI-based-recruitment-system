import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import JobService from '../../services/job.service';
import ApplicationService from '../../services/application.service';
import { formatDate } from '../../utils/formatters';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const jobsResponse = await JobService.getAdminJobs();
        const jobs = jobsResponse.data || [];
        
        // Fetch applications
        const applicationsResponse = await ApplicationService.getAllApplications();
        const applications = applicationsResponse.data || [];
        
        // Calculate stats
        const activeJobs = jobs.filter(job => job.status === 'active').length;
        const pendingApplications = applications.filter(app => app.status === 'pending').length;
        const scheduledInterviews = applications.filter(app => app.status === 'interview_scheduled').length;
        
        setStats({
          activeJobs,
          totalApplications: applications.length,
          pendingApplications,
          scheduledInterviews,
        });
        
        // Get recent jobs and applications
        const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentJobs(sortedJobs.slice(0, 5));
        
        const sortedApplications = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentApplications(sortedApplications.slice(0, 5));
        
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <Loading center size="lg" />;

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Active Jobs" 
          value={stats.activeJobs}
          icon="briefcase"
          color="blue"
        />
        <StatsCard 
          title="Total Applications" 
          value={stats.totalApplications}
          icon="document-text"
          color="green"
        />
        <StatsCard 
          title="Pending Applications" 
          value={stats.pendingApplications}
          icon="clock"
          color="yellow"
        />
        <StatsCard 
          title="Scheduled Interviews" 
          value={stats.scheduledInterviews}
          icon="calendar"
          color="purple"
        />
      </div>
      
      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Recent Job Postings" className="h-full">
          {recentJobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                    <Badge variant={job.status === 'active' ? 'success' : 'default'}>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Posted: {formatDate(job.createdAt)}</p>
                  <p className="text-sm text-gray-500">Applications: {job.applicationCount || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No jobs found</p>
          )}
          
          <div className="mt-4">
            <Link to="/admin/jobs">
              <Button variant="outline" fullWidth>View All Jobs</Button>
            </Link>
          </div>
        </Card>
        
        {/* Recent Applications */}
        <Card title="Recent Applications" className="h-full">
          {recentApplications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentApplications.map((application) => (
                <div key={application.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {application.candidate?.name || 'Candidate'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application.job?.title || 'Job Title'}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        application.status === 'approved' ? 'success' : 
                        application.status === 'pending' ? 'warning' : 
                        application.status === 'rejected' ? 'danger' : 'default'
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Applied: {formatDate(application.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No applications found</p>
          )}
          
          <div className="mt-4">
            <Link to="/admin/applications">
              <Button variant="outline" fullWidth>View All Applications</Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Post a New Job" 
          className="text-center"
          bodyClassName="flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mb-4 text-gray-600">Create a new job posting to attract candidates</p>
          <Link to="/admin/jobs/create">
            <Button variant="primary">Create Job</Button>
          </Link>
        </Card>
        
        <Card 
          title="Candidate Matching" 
          className="text-center"
          bodyClassName="flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mb-4 text-gray-600">Find the best candidates for your job openings</p>
          <Link to="/admin/jobs">
            <Button variant="primary">Match Candidates</Button>
          </Link>
        </Card>
        
        <Card 
          title="Schedule Interviews" 
          className="text-center"
          bodyClassName="flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mb-4 text-gray-600">Schedule and manage candidate interviews</p>
          <Link to="/admin/interviews">
            <Button variant="primary">Manage Interviews</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
  };
  
  const iconMap = {
    briefcase: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'document-text': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${colorClasses[color]}`}>
          {iconMap[icon]}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;
