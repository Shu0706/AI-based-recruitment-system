const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// General rate limiter for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for authentication endpoints (more lenient for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // Allow more attempts in development
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts from this IP, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter (more lenient for development)
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'development' ? 50 : 3, // Allow more attempts in development
  message: {
    success: false,
    message: 'Too many registration attempts from this IP, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiter to slow down requests after a certain number
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  validate: { delayMs: false } // Disable the warning
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  registrationLimiter,
  speedLimiter
};
