import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';

// Create context
export const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get current user
        const res = await axios.get(`${API_URL}/auth/me`);
        
        setUser(res.data);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Save token
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Save token
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear token and state regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const setupAxiosInterceptors = () => {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          // If error is not 401 or request already retried, reject
          if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
          }
          
          // Mark request as retried
          originalRequest._retry = true;
          
          try {
            // Get refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
              logout();
              return Promise.reject(error);
            }
            
            // Request new access token
            const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            
            // Update tokens
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            
            // Update auth header
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
            
            // Retry original request
            return axios(originalRequest);
          } catch (refreshError) {
            // Logout if refresh fails
            logout();
            return Promise.reject(refreshError);
          }
        }
      );
    };
    
    setupAxiosInterceptors();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        register,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
