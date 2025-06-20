import axios from 'axios';
import { JOB_API } from '../config/constants';

// Create axios instance with common headers
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Job service methods
const JobService = {
  // Get all jobs
  getAllJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(JOB_API.GET_ALL, { params });
    return response.data;
  },
  
  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(JOB_API.GET_BY_ID(id));
    return response.data;
  },
  
  // Create new job
  createJob: async (jobData) => {
    const response = await api.post(JOB_API.CREATE, jobData);
    return response.data;
  },
  
  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(JOB_API.UPDATE(id), jobData);
    return response.data;
  },
  
  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(JOB_API.DELETE(id));
    return response.data;
  },
  
  // Get admin jobs
  getAdminJobs: async () => {
    const response = await api.get(JOB_API.ADMIN_JOBS);
    return response.data;
  },
  
  // Get matching candidates for a job
  getMatchingCandidates: async (jobId) => {
    const response = await api.get(JOB_API.MATCHING_CANDIDATES(jobId));
    return response.data;
  }
};

export default JobService;
