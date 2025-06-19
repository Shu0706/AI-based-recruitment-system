const express = require('express');
const { check } = require('express-validator');
const jobController = require('../controllers/job.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/jobs
 * @desc Create a new job
 * @access Private (Admin only)
 */
router.post(
  '/',
  [
    authMiddleware,
    adminMiddleware,
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('type', 'Type is required').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    check('description', 'Description is required').not().isEmpty(),
    check('requirements', 'Requirements are required').not().isEmpty(),
    check('responsibilities', 'Responsibilities are required').not().isEmpty(),
    check('experience', 'Experience is required').not().isEmpty(),
    check('education', 'Education is required').not().isEmpty(),
    check('skills', 'Skills must be an array').isArray(),
    check('minSalary', 'Minimum salary must be a number').optional().isNumeric(),
    check('maxSalary', 'Maximum salary must be a number').optional().isNumeric(),
    check('applicationDeadline', 'Application deadline must be a valid date').optional().isISO8601(),
  ],
  jobController.createJob
);

/**
 * @route GET /api/jobs
 * @desc Get all jobs
 * @access Public
 */
router.get('/', jobController.getAllJobs);

/**
 * @route GET /api/jobs/:id
 * @desc Get job by ID
 * @access Public
 */
router.get('/:id', jobController.getJobById);

/**
 * @route PUT /api/jobs/:id
 * @desc Update job
 * @access Private (Admin only)
 */
router.put(
  '/:id',
  [
    authMiddleware,
    adminMiddleware,
    check('title', 'Title is required').optional(),
    check('company', 'Company is required').optional(),
    check('location', 'Location is required').optional(),
    check('type', 'Type must be valid').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    check('description', 'Description is required').optional(),
    check('requirements', 'Requirements are required').optional(),
    check('responsibilities', 'Responsibilities are required').optional(),
    check('experience', 'Experience is required').optional(),
    check('education', 'Education is required').optional(),
    check('skills', 'Skills must be an array').optional().isArray(),
    check('minSalary', 'Minimum salary must be a number').optional().isNumeric(),
    check('maxSalary', 'Maximum salary must be a number').optional().isNumeric(),
    check('applicationDeadline', 'Application deadline must be a valid date').optional().isISO8601(),
    check('isActive', 'isActive must be a boolean').optional().isBoolean(),
  ],
  jobController.updateJob
);

/**
 * @route DELETE /api/jobs/:id
 * @desc Delete job (soft delete)
 * @access Private (Admin only)
 */
router.delete('/:id', [authMiddleware, adminMiddleware], jobController.deleteJob);

/**
 * @route GET /api/jobs/admin
 * @desc Get jobs created by admin
 * @access Private (Admin only)
 */
router.get('/admin/jobs', [authMiddleware, adminMiddleware], jobController.getAdminJobs);

/**
 * @route GET /api/jobs/:id/candidates
 * @desc Find matching candidates for a job
 * @access Private (Admin only)
 */
router.get('/:id/candidates', [authMiddleware, adminMiddleware], jobController.findMatchingCandidates);

module.exports = router;
