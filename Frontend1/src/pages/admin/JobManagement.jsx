import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import JobService from '../../services/job.service';
import { formatDate, getStatusColor } from '../../utils/formatters';
import useDataFilters from '../../hooks/useDataFilters';
import usePagination from '../../hooks/usePagination';

const JobManagement = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Status options for filtering
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'closed', label: 'Closed' },
    { value: 'expired', label: 'Expired' },
  ];
  
  // Set up data filtering
  const {
    data: filteredJobs,
    updateFilter,
    clearFilters,
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
        const response = await JobService.getAdminJobs();
        setJobs(response.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    
    try {
      setLoading(true);
      await JobService.deleteJob(selectedJob.id);
      
      // Remove the deleted job from the state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== selectedJob.id));
      
      // Close the modal and reset selected job
      setShowDeleteModal(false);
      setSelectedJob(null);
      
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <Link to="/admin/jobs/create">
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Job
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Jobs"
            placeholder="Search by title or location..."
            onChange={(e) => updateFilter('title', e.target.value)}
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
      
      {/* Jobs List */}
      {loading ? (
        <Loading center size="lg" />
      ) : (
        <>
          {paginatedJobs.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
                <div className="mt-6">
                  <Link to="/admin/jobs/create">
                    <Button variant="primary">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Job
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.applicationCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/admin/jobs/${job.id}/candidates`}>
                            <Button variant="outline" size="sm">
                              View Candidates
                            </Button>
                          </Link>
                          <Link to={`/admin/jobs/edit/${job.id}`}>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
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
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Job
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the job "{selectedJob?.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  onClick={handleDeleteJob}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedJob(null);
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

export default JobManagement;
