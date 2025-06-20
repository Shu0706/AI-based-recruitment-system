import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthStatus = () => {
  const { user, loading, login, logout, register } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testLogin = async () => {
    try {
      const result = await login({ 
        email: 'user@example.com', 
        password: 'password123' 
      });
      addResult('Login Test', `✅ Success: User ${result.firstName} ${result.lastName} logged in`);
    } catch (error) {
      addResult('Login Test', `❌ Error: ${error.message}`);
    }
  };

  const testRegister = async () => {
    try {
      const result = await register({ 
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com', 
        password: 'password123',
        role: 'user'
      });
      addResult('Register Test', `✅ Success: User ${result.firstName} ${result.lastName} registered`);
    } catch (error) {
      addResult('Register Test', `❌ Error: ${error.message}`);
    }
  };

  const testLogout = () => {
    logout();
    addResult('Logout Test', '✅ Success: User logged out');
  };

  const goToDashboard = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Status</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Current Status:</h2>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div>
            <p><strong>Logged in as:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>

      <div className="space-x-2 mb-6">
        <button 
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Login
        </button>
        <button 
          onClick={testRegister}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Register
        </button>
        <button 
          onClick={testLogout}
          disabled={loading || !user}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Logout
        </button>
        <button 
          onClick={goToDashboard}
          disabled={!user}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Go to Dashboard
        </button>
        <button 
          onClick={() => setTestResults([])}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Test Results:</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-600">No tests run yet. Click a button to start testing.</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium">{result.test}</div>
                <div className="text-sm text-gray-600">{result.timestamp}</div>
                <div className="mt-1">{result.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStatus;
