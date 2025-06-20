import axios from 'axios';
import { RESUME_API } from '../config/constants';

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

// Resume service methods
const ResumeService = {
  // Upload a resume
  uploadResume: async (formData) => {
    // For file uploads, we need to set the content type to multipart/form-data
    const response = await api.post(RESUME_API.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Get all resumes
  getAllResumes: async () => {
    const response = await api.get(RESUME_API.GET_ALL);
    return response.data;
  },
  
  // Get resume by ID
  getResumeById: async (id) => {
    const response = await api.get(RESUME_API.GET_BY_ID(id));
    return response.data;
  },
  
  // Update resume status
  updateResumeStatus: async (id, status) => {
    const response = await api.patch(RESUME_API.UPDATE_STATUS(id), { status });
    return response.data;
  },
  
  // Download resume file
  downloadResume: async (id) => {
    const response = await api.get(RESUME_API.DOWNLOAD(id), {
      responseType: 'blob',
    });
    return response.data;
  },
  
  // Get AI analysis of resume
  getResumeAnalysis: async (id) => {
    const response = await api.get(RESUME_API.ANALYSIS(id));
    return response.data;
  },
  
  // Match resume with jobs
  matchResumeWithJobs: async (id, params = {}) => {
    const response = await api.get(RESUME_API.MATCH_JOBS(id), { params });
    return response.data;
  },
  
  // Parse resume text
  parseResumeText: async (id) => {
    const response = await api.get(RESUME_API.PARSE(id));
    return response.data;
  }
};

// Export individual functions for direct imports
export const {
  uploadResume,
  getAllResumes,
  getResumeById,
  updateResumeStatus,
  downloadResume,
  getResumeAnalysis,
  matchResumeWithJobs,
  parseResumeText
} = ResumeService;

export default ResumeService;
