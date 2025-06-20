import axios from 'axios';
import { API_URL } from '../config/constants';

const API = axios.create({
  baseURL: API_URL
});

// Add authorization header to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register a new user
export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user data' };
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await API.post(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Email verification failed' };
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset request failed' };
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await API.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await API.put(`/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user profile' };
  }
};

// Change password
export const changePassword = async (userId, passwordData) => {
  try {
    const response = await API.put(`/users/${userId}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

// Check if token is valid
export const checkTokenValidity = async () => {
  try {
    const response = await API.get('/auth/token/validate');
    return response.data.valid;
  } catch (error) {
    return false;
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
  checkTokenValidity
};
