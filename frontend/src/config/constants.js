// API base URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Authentication endpoints
export const AUTH_API = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  REFRESH: `${API_URL}/auth/refresh`,
  CURRENT_USER: `${API_URL}/auth/me`,
};

// User endpoints
export const USER_API = {
  UPDATE_PROFILE: `${API_URL}/users/profile`,
  CHANGE_PASSWORD: `${API_URL}/users/password`,
};

// Job endpoints
export const JOB_API = {
  GET_ALL: `${API_URL}/jobs`,
  GET_BY_ID: (id) => `${API_URL}/jobs/${id}`,
  CREATE: `${API_URL}/jobs`,
  UPDATE: (id) => `${API_URL}/jobs/${id}`,
  DELETE: (id) => `${API_URL}/jobs/${id}`,
  ADMIN_JOBS: `${API_URL}/jobs/admin`,
  MATCHING_CANDIDATES: (id) => `${API_URL}/jobs/${id}/candidates`,
};

// Resume endpoints
export const RESUME_API = {
  UPLOAD: `${API_URL}/resumes/upload`,
  GET_ALL: `${API_URL}/resumes`,
  GET_BY_ID: (id) => `${API_URL}/resumes/${id}`,
  UPDATE_STATUS: (id) => `${API_URL}/resumes/${id}`,
  DOWNLOAD: (id) => `${API_URL}/resumes/${id}/file`,
};

// Application endpoints
export const APPLICATION_API = {
  APPLY: `${API_URL}/applications`,
  GET_ALL: `${API_URL}/applications`,
  GET_BY_ID: (id) => `${API_URL}/applications/${id}`,
  UPDATE_STATUS: (id) => `${API_URL}/applications/${id}/status`,
  USER_APPLICATIONS: `${API_URL}/applications/user`,
};

// Interview endpoints
export const INTERVIEW_API = {
  GET_ALL: `${API_URL}/interviews`,
  GET_BY_ID: (id) => `${API_URL}/interviews/${id}`,
  SCHEDULE: `${API_URL}/interviews`,
  UPDATE: (id) => `${API_URL}/interviews/${id}`,
  CANCEL: (id) => `${API_URL}/interviews/${id}/cancel`,
  CONFIRM: (id) => `${API_URL}/interviews/${id}/confirm`,
  USER_INTERVIEWS: `${API_URL}/interviews/user`,
  ADMIN_INTERVIEWS: `${API_URL}/interviews/admin`,
};

// TimeSlot endpoints
export const TIMESLOT_API = {
  GET_ALL: `${API_URL}/timeslots`,
  CREATE: `${API_URL}/timeslots`,
  UPDATE: (id) => `${API_URL}/timeslots/${id}`,
  DELETE: (id) => `${API_URL}/timeslots/${id}`,
  AVAILABLE: `${API_URL}/timeslots/available`,
};
