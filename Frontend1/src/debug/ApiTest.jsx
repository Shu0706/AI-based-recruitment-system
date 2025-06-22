import React, { useState } from 'react';
import { API_URL } from '../config/constants';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test basic connection
      const healthResponse = await fetch(`${API_URL}/health`);
      const healthData = await healthResponse.json();
      
      if (healthResponse.ok) {
        setTestResult(prev => prev + '\n✅ Health check successful: ' + JSON.stringify(healthData, null, 2));
      } else {
        setTestResult(prev => prev + '\n❌ Health check failed: ' + healthResponse.status);
      }
    } catch (error) {
      setTestResult(prev => prev + '\n❌ Connection error: ' + error.message);
    }
    
    setIsLoading(false);
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setTestResult(prev => prev + '\n\nTesting registration...');
    
    const testUser = {
      firstName: 'Test',
      lastName: 'Frontend',
      email: `test${Date.now()}@example.com`,
      password: 'Test123!@#'
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(testUser)
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult(prev => prev + '\n✅ Registration successful: ' + JSON.stringify(data.user, null, 2));
      } else {
        setTestResult(prev => prev + '\n❌ Registration failed: ' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setTestResult(prev => prev + '\n❌ Registration error: ' + error.message);
    }
    
    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    setTestResult(prev => prev + '\n\nTesting login...');
    
    const credentials = {
      email: 'test@example.com',
      password: 'Test123!@#'
    };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult(prev => prev + '\n✅ Login successful: ' + JSON.stringify(data.user, null, 2));
      } else {
        setTestResult(prev => prev + '\n❌ Login failed: ' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setTestResult(prev => prev + '\n❌ Login error: ' + error.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <p className="mb-4">API URL: {API_URL}</p>
      
      <div className="space-x-4 mb-6">
        <button 
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Connection
        </button>
        <button 
          onClick={testRegistration}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Registration
        </button>
        <button 
          onClick={testLogin}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Login
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">Test Results:</h3>
        <pre className="whitespace-pre-wrap text-sm">{testResult || 'No tests run yet.'}</pre>
      </div>
    </div>
  );
};

export default ApiTest;
