import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import JobService from '../../services/job.service';
import { formatDate, formatCurrency } from '../../utils/formatters';
import useDataFilters from '../../hooks/useDataFilters';
import usePagination from '../../hooks/usePagination';

const JobSearch = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  
  // Job type options for filtering
  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
  ];
  
  // Experience level options for filtering
  const experienceOptions = [
    { value: '', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (5+ years)' },
    { value: 'executive', label: 'Executive Level' },
  ];
  
  // Set up data filtering
  const {
    data: filteredJobs,
    filters,
    updateFilter,
    clearFilters,
    toggleSort,
    sortKey,
    sortOrder,
  } = useDataFilters(jobs, 'createdAt', 'desc');
  
  // Set up pagination
  const {
    paginatedItems: paginatedJobs,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredJobs, 10);
  
  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await JobService.getAllJobs({ status: 'active' });
        setJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
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
      <h1 className="text-2xl font-bold mb-6">Find Your Next Opportunity</h1>
      
      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              label="Search Jobs"
              placeholder="Search by title, skills, or keywords..."
              className="flex-grow"
              value={filters.title || ''}
              onChange={(e) => updateFilter('title', e.target.value)}
            />
            
            <Input
              label="Location"
              placeholder="City, state, or remote..."
              className="flex-grow"
              value={filters.location || ''}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              label="Job Type"
              options={jobTypeOptions}
              className="flex-1"
              value={filters.type || ''}
              onChange={(e) => updateFilter('type', e.target.value)}
            />
            
            <Select
              label="Experience Level"
              options={experienceOptions}
              className="flex-1"
              value={filters.experience || ''}
              onChange={(e) => updateFilter('experience', e.target.value)}
            />
            
            <div className="flex items-end mb-4">
              <Button 
                variant="secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            value={sortKey}
            onChange={(e) => toggleSort(e.target.value)}
          >
            <option value="createdAt">Date Posted</option>
            <option value="title">Job Title</option>
            <option value="salary.min">Salary</option>
          </select>
          <button
            className="p-1"
            onClick={() => toggleSort(sortKey)}
          >
            {sortOrder === 'asc' ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Jobs List */}
      {paginatedJobs.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={prevPage}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages)
                  .map((page, index, array) => {
                    // Add ellipsis
                    if (index > 0 && page > array[index - 1] + 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className="px-3 py-2">...</span>
                          <Button
                            variant={page === currentPage ? 'primary' : 'outline'}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                <Button 
                  variant="outline" 
                  disabled={currentPage === totalPages}
                  onClick={nextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-medium text-gray-900">
            <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
              {job.title}
            </Link>
          </h2>
          <p className="text-gray-600">{job.department} • {job.location}</p>
        </div>
        <Badge variant="primary">{job.type}</Badge>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills?.map((skill, index) => (
          <Badge key={index} variant="default" size="sm" className="capitalize">
            {skill}
          </Badge>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Experience</p>
          <p className="font-medium">
            {job.experience === 'entry' ? 'Entry Level (0-2 years)' : 
             job.experience === 'mid' ? 'Mid Level (3-5 years)' : 
             job.experience === 'senior' ? 'Senior Level (5+ years)' : 
             'Executive Level'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Salary</p>
          <p className="font-medium">
            {job.salary?.min && job.salary?.max ? (
              `${formatCurrency(job.salary.min, job.salary.currency)} - ${formatCurrency(job.salary.max, job.salary.currency)} ${job.salary.period === 'yearly' ? '/year' : job.salary.period === 'monthly' ? '/month' : '/hour'}`
            ) : (
              'Not specified'
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Posted</p>
          <p className="font-medium">{formatDate(job.createdAt)}</p>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        {job.description?.length > 200 
          ? `${job.description.substring(0, 200)}...` 
          : job.description}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Apply by:</span> {formatDate(job.applicationDeadline)}
        </p>
        <Link to={`/jobs/${job.id}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </div>
    </Card>
  );
};

export default JobSearch;
