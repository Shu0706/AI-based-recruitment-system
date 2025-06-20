const express = require('express');
const router = express.Router();

// Simple users route for testing
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// Mock user profile route
router.get('/:id/profile', (req, res) => {
  const userId = req.params.id;
  
  // Return mock user data
  res.json({
    id: userId,
    firstName: 'Test',
    lastName: 'User',
    email: 'user@example.com',
    role: 'user',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: [
      {
        title: 'Frontend Developer',
        company: 'Tech Inc.',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        description: 'Developed web applications using React.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'Tech University',
        graduationYear: '2019'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// Mock update user profile route
router.put('/:id/profile', (req, res) => {
  const userId = req.params.id;
  const profileData = req.body;
  
  // Return updated profile
  res.json({
    id: userId,
    ...profileData,
    updatedAt: new Date().toISOString()
  });
});

module.exports = router;
