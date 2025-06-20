import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import JobService from '../../services/job.service';
import ApplicationService from '../../services/application.service';
import { formatDate } from '../../utils/formatters';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appliedJobs: 0,
    shortlisted: 0,
    interviews: 0,
    offers: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch available jobs
        const jobsResponse = await JobService.getAllJobs({ status: 'active' });
        const jobs = jobsResponse.data || [];
        setRecentJobs(jobs.slice(0, 5));
        
        // Fetch user applications
        const applicationsResponse = await ApplicationService.getUserApplications();
        const userApplications = applicationsResponse.data || [];
        setApplications(userApplications);
        
        // Calculate stats
        const appliedJobs = userApplications.length;
        const shortlisted = userApplications.filter(app => app.status === 'shortlisted').length;
        const interviews = userApplications.filter(app => app.status === 'interview_scheduled').length;
        const offers = userApplications.filter(app => app.status === 'offered').length;
        
        setStats({
          appliedJobs,
          shortlisted,
          interviews,
          offers,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Applied Jobs" 
          value={stats.appliedJobs}
          icon="document-text"
          color="blue"
        />
        <StatCard 
          title="Shortlisted" 
          value={stats.shortlisted}
          icon="check-circle"
          color="green"
        />
        <StatCard 
          title="Interviews" 
          value={stats.interviews}
          icon="calendar"
          color="purple"
        />
        <StatCard 
          title="Offers" 
          value={stats.offers}
          icon="badge-check"
          color="yellow"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Applications */}
        <Card title="Your Recent Applications" className="h-full">
          {applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{application.job?.title}</h3>
                      <p className="text-sm text-gray-600">{application.job?.department} • {application.job?.location}</p>
                    </div>
                    <Badge 
                      variant={
                        application.status === 'approved' || application.status === 'shortlisted' ? 'success' : 
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
            <Link to="/applications">
              <Button variant="outline" fullWidth>View All Applications</Button>
            </Link>
          </div>
        </Card>
        
        {/* Featured Jobs */}
        <Card title="Featured Jobs" className="h-full">
          {recentJobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                    </div>
                    <Badge variant="primary">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="default" size="sm" className="capitalize">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="text-xs text-gray-500">+{job.skills.length - 3} more</span>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Posted: {formatDate(job.createdAt)}</p>
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No jobs found</p>
          )}
          
          <div className="mt-4">
            <Link to="/jobs">
              <Button variant="outline" fullWidth>Browse All Jobs</Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Find Jobs" 
          className="text-center"
          bodyClassName="flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="mb-4 text-gray-600">Browse and apply for jobs that match your skills</p>
          <Link to="/jobs">
            <Button variant="primary">Search Jobs</Button>
          </Link>
        </Card>
        
        <Card 
          title="Upload Resume" 
          className="text-center"
          bodyClassName="flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-4 text-gray-600">Upload or update your resume to improve job matches</p>
          <Link to="/profile">
            <Button variant="primary">Upload Resume</Button>
          </Link>
        </Card>
        
        <Card 
          title="Track Applications" 
          className="text-center"
          bodyClassName="flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="mb-4 text-gray-600">Track the status of your job applications</p>
          <Link to="/applications">
            <Button variant="primary">View Applications</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
  };
  
  const iconMap = {
    'document-text': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'check-circle': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'badge-check': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
