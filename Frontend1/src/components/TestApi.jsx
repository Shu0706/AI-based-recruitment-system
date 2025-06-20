import React, { useState } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      addResult('Basic GET Test', `✅ Success: ${data.message}`);
    } catch (error) {
      addResult('Basic GET Test', `❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testPostRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/test-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
      });
      const data = await response.json();
      addResult('Basic POST Test', `✅ Success: ${data.message}`);
    } catch (error) {
      addResult('Basic POST Test', `❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testLoginRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'user@example.com', 
          password: 'password123' 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      addResult('Login Test', `✅ Success: ${data.message}`);
    } catch (error) {
      addResult('Login Test', `❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testAxiosLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user@example.com',
        password: 'password123'
      });
      addResult('Axios Login Test', `✅ Success: ${response.data.message}`);
    } catch (error) {
      addResult('Axios Login Test', `❌ Error: ${error.response?.data?.message || error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="space-x-4 mb-6">
        <button 
          onClick={testBasicConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Basic Connection
        </button>
        <button 
          onClick={testPostRequest}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test POST Request
        </button>
        <button 
          onClick={testLoginRequest}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Login (Fetch)
        </button>
        <button 
          onClick={testAxiosLogin}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Test Login (Axios)
        </button>
        <button 
          onClick={() => setResults([])}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Test Results:</h2>
        {results.length === 0 ? (
          <p className="text-gray-600">No tests run yet. Click a button to start testing.</p>
        ) : (
          <div className="space-y-2">
            {results.map((result, index) => (
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

export default TestApi;
