// API base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authentication endpoints
export const AUTH_API = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  REFRESH: `${API_URL}/auth/refresh`,
  CURRENT_USER: `${API_URL}/auth/me`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token) => `${API_URL}/auth/reset-password/${token}`,
  VERIFY_EMAIL: (token) => `${API_URL}/auth/verify-email/${token}`,
};

// User endpoints
export const USER_API = {
  GET_PROFILE: (id) => `${API_URL}/users/${id}/profile`,
  UPDATE_PROFILE: (id) => `${API_URL}/users/${id}/profile`,
  CHANGE_PASSWORD: (id) => `${API_URL}/users/${id}/password`,
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
  SEARCH: `${API_URL}/jobs/search`,
  RECOMMENDED: `${API_URL}/jobs/recommended`,
};

// Resume endpoints
export const RESUME_API = {
  UPLOAD: `${API_URL}/resumes/upload`,
  GET_ALL: `${API_URL}/resumes`,
  GET_BY_ID: (id) => `${API_URL}/resumes/${id}`,
  UPDATE_STATUS: (id) => `${API_URL}/resumes/${id}`,
  DOWNLOAD: (id) => `${API_URL}/resumes/${id}/file`,
  ANALYSIS: (id) => `${API_URL}/resumes/${id}/analysis`,
  MATCH_JOBS: (id) => `${API_URL}/resumes/${id}/match-jobs`,
  PARSE: (id) => `${API_URL}/resumes/${id}/parse`,
};

// Application endpoints
export const APPLICATION_API = {
  APPLY: `${API_URL}/applications`,
  GET_ALL: `${API_URL}/applications`,
  GET_BY_ID: (id) => `${API_URL}/applications/${id}`,
  UPDATE_STATUS: (id) => `${API_URL}/applications/${id}/status`,
  USER_APPLICATIONS: `${API_URL}/applications/user`,
  USER_APPLICATIONS_BY_ID: (userId) => `${API_URL}/applications/user/${userId}`,
  JOB_APPLICATIONS: (jobId) => `${API_URL}/applications/job/${jobId}`,
  WITHDRAW: (id) => `${API_URL}/applications/${id}/withdraw`,
  ADD_FEEDBACK: (id) => `${API_URL}/applications/${id}/feedback`,
};

// Interview endpoints
export const INTERVIEW_API = {
  GET_ALL: `${API_URL}/interviews`,
  GET_BY_ID: (id) => `${API_URL}/interviews/${id}`,
  SCHEDULE: `${API_URL}/interviews`,
  UPDATE: (id) => `${API_URL}/interviews/${id}`,
  UPDATE_STATUS: (id) => `${API_URL}/interviews/${id}/status`,
  CANCEL: (id) => `${API_URL}/interviews/${id}/cancel`,
  USER_INTERVIEWS: `${API_URL}/interviews/user`,
  JOB_INTERVIEWS: (jobId) => `${API_URL}/interviews/job/${jobId}`,
  CANDIDATE_INTERVIEWS: (candidateId) => `${API_URL}/interviews/candidate/${candidateId}`,
  AVAILABLE_TIMESLOTS: `${API_URL}/interviews/timeslots`,
  ACCEPT: (id) => `${API_URL}/interviews/${id}/accept`,
  REJECT: (id) => `${API_URL}/interviews/${id}/reject`,
  RESCHEDULE: (id) => `${API_URL}/interviews/${id}/reschedule`,
  SUBMIT_FEEDBACK: (id) => `${API_URL}/interviews/${id}/feedback`,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  OPTIONS: [10, 20, 50, 100],
};

// Job constants
export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry-level', label: 'Entry Level' },
  { value: 'mid-level', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'executive', label: 'Executive' },
];

export const JOB_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

// Application constants
export const APPLICATION_STATUS = [
  { value: 'applied', label: 'Applied', color: 'blue' },
  { value: 'reviewed', label: 'Reviewed', color: 'indigo' },
  { value: 'screening', label: 'Screening', color: 'yellow' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'purple' },
  { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'orange' },
  { value: 'interviewed', label: 'Interviewed', color: 'teal' },
  { value: 'offer_extended', label: 'Offer Extended', color: 'cyan' },
  { value: 'hired', label: 'Hired', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'gray' },
];

// Interview constants
export const INTERVIEW_TYPES = [
  { value: 'phone', label: 'Phone Screening' },
  { value: 'video', label: 'Video Interview' },
  { value: 'onsite', label: 'On-site Interview' },
  { value: 'technical', label: 'Technical Interview' },
  { value: 'behavioral', label: 'Behavioral Interview' },
  { value: 'assessment', label: 'Skills Assessment' },
];

export const INTERVIEW_STATUS = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'blue' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'green' },
  { value: 'RESCHEDULED', label: 'Rescheduled', color: 'purple' },
  { value: 'CANCELED', label: 'Canceled', color: 'red' },
  { value: 'COMPLETED', label: 'Completed', color: 'teal' },
];
