import axios from 'axios';
import { APPLICATION_API } from '../config/constants';

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

// Application service methods
const ApplicationService = {
  // Apply for a job
  applyForJob: async (applicationData) => {
    const response = await api.post(APPLICATION_API.APPLY, applicationData);
    return response.data;
  },
  
  // Create application (alias for applyForJob)
  createApplication: async (applicationData) => {
    const response = await api.post(APPLICATION_API.APPLY, applicationData);
    return response.data;
  },
  
  // Get all applications (admin)
  getAllApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(APPLICATION_API.GET_ALL, { params });
    return response.data;
  },
  
  // Get application by ID
  getApplicationById: async (id) => {
    const response = await api.get(APPLICATION_API.GET_BY_ID(id));
    return response.data;
  },
  
  // Update application status
  updateApplicationStatus: async (id, status, comments = '') => {
    const response = await api.patch(APPLICATION_API.UPDATE_STATUS(id), { 
      status,
      comments 
    });
    return response.data;
  },
  
  // Get user applications (current user)
  getUserApplications: async (userId = null) => {
    const endpoint = userId ? 
      APPLICATION_API.USER_APPLICATIONS_BY_ID(userId) : 
      APPLICATION_API.USER_APPLICATIONS;
      
    const response = await api.get(endpoint);
    return response.data;
  },
  
  // Get applications for a specific job
  getJobApplications: async (jobId) => {
    const response = await api.get(APPLICATION_API.JOB_APPLICATIONS(jobId));
    return response.data;
  },
  
  // Withdraw application
  withdrawApplication: async (id) => {
    const response = await api.patch(APPLICATION_API.WITHDRAW(id));
    return response.data;
  },
  
  // Add feedback to application
  addFeedback: async (id, feedback) => {
    const response = await api.post(APPLICATION_API.ADD_FEEDBACK(id), { feedback });
    return response.data;
  }
};

// Export individual functions for direct imports
export const {
  applyForJob,
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getUserApplications,
  getJobApplications,
  withdrawApplication,
  addFeedback
} = ApplicationService;

export default ApplicationService;
