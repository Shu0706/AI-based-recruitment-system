const express = require('express');
const resumeController = require('../controllers/resume.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/resumes/upload
 * @desc Upload and process resume
 * @access Private
 */
router.post('/upload', authMiddleware, resumeController.uploadResume);

/**
 * @route GET /api/resumes
 * @desc Get all resumes for current user
 * @access Private
 */
router.get('/', authMiddleware, resumeController.getUserResumes);

/**
 * @route GET /api/resumes/:id
 * @desc Get resume by ID
 * @access Private
 */
router.get('/:id', authMiddleware, resumeController.getResumeById);

/**
 * @route PATCH /api/resumes/:id
 * @desc Update resume status (soft delete)
 * @access Private
 */
router.patch('/:id', authMiddleware, resumeController.updateResumeStatus);

/**
 * @route GET /api/resumes/:id/file
 * @desc Get resume file
 * @access Private
 */
router.get('/:id/file', authMiddleware, resumeController.getResumeFile);

module.exports = router;
