const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { authLimiter, registrationLimiter, passwordResetLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  registrationLimiter, // Apply registration rate limiting
  [
    check('firstName')
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('First name can only contain letters and spaces')
      .trim(),
    
    check('lastName')
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Last name can only contain letters and spaces')
      .trim(),
    
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail()
      .custom(async (email) => {
        // Additional email validation can be added here
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please enter a valid email address');
        }
        return true;
      }),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
    
    check('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either "user" or "admin"'),
    
    check('phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please enter a valid phone number'),
    
    check('location')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Location cannot be more than 100 characters')
      .trim()
  ],
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  authLimiter, // Apply auth rate limiting
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    check('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post(
  '/refresh',
  [
    check('refreshToken', 'Refresh token is required').not().isEmpty(),
  ],
  authController.refresh
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
