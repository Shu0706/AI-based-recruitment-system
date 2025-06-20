import { useState, useEffect } from 'react';

// Custom hook for sorting and filtering data
const useDataFilters = (initialData = [], defaultSortKey = 'createdAt', defaultSortOrder = 'desc') => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Apply filters and sorting when data, filters, or sort parameters change
  useEffect(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter(item => {
          const itemValue = item[key];
          
          // Handle different filter types
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          } else if (Array.isArray(value)) {
            return value.includes(itemValue);
          } else if (typeof value === 'object' && value !== null) {
            // Range filter (min/max)
            if (value.min !== undefined && value.max !== undefined) {
              return itemValue >= value.min && itemValue <= value.max;
            } else if (value.min !== undefined) {
              return itemValue >= value.min;
            } else if (value.max !== undefined) {
              return itemValue <= value.max;
            }
          }
          
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortKey) {
      result.sort((a, b) => {
        let aValue = a[sortKey];
        let bValue = b[sortKey];
        
        // Handle dates
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc' 
            ? aValue.getTime() - bValue.getTime() 
            : bValue.getTime() - aValue.getTime();
        }
        
        // Handle strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        // Handle numbers
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    setFilteredData(result);
  }, [data, filters, sortKey, sortOrder]);

  // Helper function to update a single filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Helper function to toggle sort direction
  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return {
    data: filteredData,
    filters,
    sortKey,
    sortOrder,
    updateFilter,
    clearFilters,
    toggleSort,
    setData,
  };
};

export default useDataFilters;
