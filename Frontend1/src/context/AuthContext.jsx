import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AUTH_API, API_URL } from '../config/constants';

// Create Auth Context
export const AuthContext = createContext();

// Create a custom axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set authorization header for our API instance
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user data
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          delete api.defaults.headers.common['Authorization'];
          setError('Authentication failed. Please login again.');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
    // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt with credentials:', credentials);
      console.log('API base URL:', API_URL);
      
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      // Save token and user role
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setLoading(false);
      
      return user;    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    }
  };  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Register attempt with data:', userData);
      console.log('API base URL:', API_URL);
      
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response.data);
      
      const { token, user } = response.data;
      
      // Save token and user role
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setLoading(false);
      
      return user;    } catch (err) {
      setLoading(false);
      console.error('Register error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };
  
  // Logout function
  const logout = () => {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };
  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use correct endpoint with user ID
      const response = await api.put(`/users/${user.id}/profile`, profileData);
      setUser(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Profile update failed. Please try again.');
      throw err;
    }
  };
  
  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
