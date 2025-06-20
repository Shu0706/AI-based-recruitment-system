import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
export const AuthContext = createContext();

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
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user data
          const response = await axios.get('/api/auth/me');
          setUser(response.data);
        } catch (err) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          delete axios.defaults.headers.common['Authorization'];
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
      
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      // Save token and user role
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setLoading(false);
      
      return user;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Save token and user role
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setLoading(false);
      
      return user;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };
  
  // Logout function
  const logout = () => {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Remove default authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put('/api/users/profile', profileData);
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
