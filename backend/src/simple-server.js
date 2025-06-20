require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running properly!' });
});

// Mock jobs data
const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    description: 'We are looking for a skilled Frontend Developer with experience in React, HTML, CSS, and JavaScript.',
    requirements: 'At least 2 years of experience with React. Proficiency in HTML, CSS, and JavaScript.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'DataSystems',
    location: 'New York',
    description: 'We need a Backend Developer who can build robust APIs using Node.js and Express.',
    requirements: 'Experience with Node.js, Express, and database technologies like MongoDB or PostgreSQL.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'San Francisco',
    description: 'Join our team to work on exciting full stack projects using modern technologies.',
    requirements: 'Experience with both frontend (React) and backend (Node.js) technologies.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

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

// Mock user profile
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'user@example.com',
  role: 'user',
  skills: ['JavaScript', 'React', 'Node.js'],
  experience: [
    {
      title: 'Frontend Developer',
      company: 'Tech Inc.',
      startDate: '2020-01-01',
      endDate: '2022-12-31',
      description: 'Developed web applications using React and other modern web technologies.'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      year: '2019'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock routes for the API
// Get all jobs
app.get('/api/jobs', (req, res) => {
  res.json(mockJobs);
});

// Get job by id
app.get('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const job = mockJobs.find(job => job.id === jobId);
  
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  
  res.json(job);
});

// Mock auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Mock successful login
  res.json({
    token: 'mock-jwt-token',
    user: {
      id: 1,
      name: 'Test User',
      email: email,
      role: 'user'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  // Mock successful registration
  res.status(201).json({
    token: 'mock-jwt-token',
    user: {
      id: 2,
      name: name,
      email: email,
      role: 'user'
    }
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Mock successful authentication
  res.json({
    id: 1,
    name: 'Test User',
    email: 'user@example.com',
    role: 'user'
  });
});

// User profile routes
app.get('/api/users/:id/profile', (req, res) => {
  const userId = parseInt(req.params.id);
  
  // For any user ID, return the mock user
  res.json({
    ...mockUser,
    id: userId
  });
});

app.put('/api/users/:id/profile', (req, res) => {
  const userId = parseInt(req.params.id);
  const profileData = req.body;
  
  // Return updated profile
  res.json({
    ...mockUser,
    ...profileData,
    id: userId
  });
});

// Application routes
app.get('/api/applications/user', (req, res) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Return user's applications
  res.json(mockApplications);
});

app.post('/api/applications', (req, res) => {
  const { jobId, ...applicationData } = req.body;
  
  // Create new application
  const newApplication = {
    id: mockApplications.length + 1,
    userId: 1,
    jobId: jobId,
    status: 'Pending',
    matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
    appliedAt: new Date().toISOString(),
    ...applicationData
  };
  
  // Return the new application
  res.status(201).json(newApplication);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
