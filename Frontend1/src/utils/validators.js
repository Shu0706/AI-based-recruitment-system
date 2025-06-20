// Basic validation helpers

// Check if a value is empty (null, undefined, empty string, or empty array/object)
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Email validation using regex
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation (at least 8 chars, one uppercase, one lowercase, one number)
export const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

// Phone number validation (basic format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Date validation (check if date is valid and not in the past)
export const isValidFutureDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  
  return date instanceof Date && !isNaN(date) && date > now;
};

// Compare two dates and check if the first one is before the second one
export const isDateBefore = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1 < d2;
};

// Check if a file is a valid resume type (pdf, doc, docx)
export const isValidResumeFile = (file) => {
  if (!file) return false;
  
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return validTypes.includes(file.type);
};

// Check if a file is under the max size (in MB)
export const isFileSizeValid = (file, maxSizeMB = 5) => {
  if (!file) return false;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
