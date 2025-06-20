import axios from 'axios';
import { INTERVIEW_API } from '../config/constants';

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

// Interview service methods
const InterviewService = {
  // Get all interviews (admin)
  getAllInterviews: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(INTERVIEW_API.GET_ALL, { params });
    return response.data;
  },
  
  // Get interview by ID
  getInterviewById: async (id) => {
    const response = await api.get(INTERVIEW_API.GET_BY_ID(id));
    return response.data;
  },
  
  // Schedule an interview
  scheduleInterview: async (interviewData) => {
    const response = await api.post(INTERVIEW_API.SCHEDULE, interviewData);
    return response.data;
  },
  
  // Update interview details
  updateInterview: async (id, interviewData) => {
    const response = await api.put(INTERVIEW_API.UPDATE(id), interviewData);
    return response.data;
  },
  
  // Update interview status
  updateInterviewStatus: async (id, statusData) => {
    const response = await api.patch(INTERVIEW_API.UPDATE_STATUS(id), statusData);
    return response.data;
  },
  
  // Cancel an interview
  cancelInterview: async (id, reason) => {
    const response = await api.patch(INTERVIEW_API.CANCEL(id), { reason });
    return response.data;
  },
  
  // Get user interviews
  getUserInterviews: async () => {
    const response = await api.get(INTERVIEW_API.USER_INTERVIEWS);
    return response.data;
  },
  
  // Get interviews for a specific job
  getInterviewsByJob: async (jobId) => {
    const response = await api.get(INTERVIEW_API.JOB_INTERVIEWS(jobId));
    return response.data;
  },
  
  // Get interviews for a specific candidate
  getInterviewsByCandidate: async (candidateId) => {
    const response = await api.get(INTERVIEW_API.CANDIDATE_INTERVIEWS(candidateId));
    return response.data;
  },
  
  // Accept interview invitation
  acceptInterview: async (id) => {
    const response = await api.patch(INTERVIEW_API.ACCEPT(id));
    return response.data;
  },
  
  // Reject interview invitation
  rejectInterview: async (id, reason) => {
    const response = await api.patch(INTERVIEW_API.REJECT(id), { reason });
    return response.data;
  },
  
  // Get available time slots
  getAvailableTimeSlots: async (date, interviewerId) => {
    const params = new URLSearchParams();
    params.append('date', date);
    if (interviewerId) params.append('interviewerId', interviewerId);
    
    const response = await api.get(INTERVIEW_API.AVAILABLE_TIMESLOTS, { params });
    return response.data;
  },
  
  // Request interview reschedule
  requestReschedule: async (id, rescheduleData) => {
    const response = await api.post(INTERVIEW_API.RESCHEDULE(id), rescheduleData);
    return response.data;
  },
  
  // Submit interview feedback
  submitInterviewFeedback: async (id, feedbackData) => {
    const response = await api.post(INTERVIEW_API.SUBMIT_FEEDBACK(id), feedbackData);
    return response.data;
  }
};

// Export individual functions for direct imports
export const {
  getAllInterviews,
  getInterviewById,
  scheduleInterview,
  updateInterview,
  updateInterviewStatus,
  cancelInterview,
  getUserInterviews,
  getInterviewsByJob,
  getInterviewsByCandidate,
  acceptInterview,
  rejectInterview,
  getAvailableTimeSlots,
  requestReschedule,
  submitInterviewFeedback
} = InterviewService;

export default InterviewService;
