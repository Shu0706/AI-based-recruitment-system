import { useState, useEffect } from 'react';

// Custom hook for managing API requests with loading, error, and data states
const useApi = (apiFunction, immediate = false, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to execute the API call
  const execute = async (...params) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...params);
      setData(result);
      
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // If immediate is true, execute the API call on hook mount
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    execute,
    setData, // Expose setData to allow manual updates
  };
};

export default useApi;
