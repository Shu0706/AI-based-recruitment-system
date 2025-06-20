import React, { useState } from 'react';
import axios from 'axios';

const TestLogin = () => {
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    password: 'password123'
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('Attempting login with:', formData);
      console.log('API URL:', 'http://localhost:5000/api');
      
      const result = await axios.post('http://localhost:5000/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful:', result.data);
      setResponse(result.data);
      
      // Store token in localStorage
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userRole', result.data.user.role);
      
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const registerData = {
        firstName: 'Test',
        lastName: 'User2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'user'
      };
      
      console.log('Attempting register with:', registerData);
      
      const result = await axios.post('http://localhost:5000/api/auth/register', registerData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Register successful:', result.data);
      setResponse(result.data);
      
      // Store token in localStorage
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userRole', result.data.user.role);
      
    } catch (err) {
      console.error('Register error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Debug Login Test</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <button
            type="button"
            onClick={testRegister}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Test Register'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {response && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Success:</strong>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestLogin;
