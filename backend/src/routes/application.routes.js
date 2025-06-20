const express = require('express');
const router = express.Router();

// Mock applications data
const mockApplications = [
  {
    id: 1,
    userId: 1,
    jobId: 1,
    status: 'Pending',
    matchScore: 85,
    appliedAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    jobId: 2,
    status: 'Under Review',
    matchScore: 92,
    appliedAt: new Date().toISOString()
  }
];

// Get user applications
router.get('/user', (req, res) => {
  // Return user's applications
  res.json(mockApplications);
});

// Create application
router.post('/', (req, res) => {
  const { jobId, ...applicationData } = req.body;
  
  // Create new application
  const newApplication = {
    id: mockApplications.length + 1,
    userId: req.user.id || 1,
    jobId: jobId,
    status: 'Pending',
    matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
    appliedAt: new Date().toISOString(),
    ...applicationData
  };
  
  // Return the new application
  res.status(201).json(newApplication);
});

module.exports = router;
