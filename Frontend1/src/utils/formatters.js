// Format date to a more readable format (e.g., "Jan 1, 2023")
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format time (e.g., "12:00 PM")
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // If it's a date string with time component
  if (timeString.includes('T') || timeString.includes('-')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  // If it's just a time string (e.g., "14:30")
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } catch (error) {
    return timeString;
  }
};

// Format date with time (e.g., "Jan 1, 2023, 12:00 PM")
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Calculate time ago (e.g., "2 days ago")
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a month
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Less than a year
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  // More than a year
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get file extension
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

// Format file size (e.g., "1.5 MB")
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// Format currency (e.g., "$1,000")
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (!amount && amount !== 0) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'yellow',
    active: 'green',
    closed: 'gray',
    draft: 'blue',
    approved: 'green',
    rejected: 'red',
    shortlisted: 'blue',
    interviewed: 'purple',
    offered: 'indigo',
    hired: 'green',
    withdrawn: 'gray',
    expired: 'gray',
  };
  
  return statusColors[status?.toLowerCase()] || 'gray';
};

// Parse URL query parameters
export const parseQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// Build URL query string from object
export const buildQueryString = (params = {}) => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, value);
    }
  });
  
  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : '';
};
