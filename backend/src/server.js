require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes'); // Now available
// const adminRoutes = require('./routes/admin.routes'); // Not available yet
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes'); // Now available
const resumeRoutes = require('./routes/resume.routes');
// const interviewRoutes = require('./routes/interview.routes'); // Not available yet

// Import database connection
const { connectDB } = require('./config/db.config');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Simple route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running properly!' });
});

// Test POST endpoint
app.post('/api/test-post', (req, res) => {
  console.log('Test POST received:', req.body);
  res.json({ message: 'POST received successfully', data: req.body });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes); // Now available
// app.use('/api/admin', authMiddleware, adminRoutes); // Not available yet
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', authMiddleware, applicationRoutes); // Now available
app.use('/api/resumes', authMiddleware, resumeRoutes);
// app.use('/api/interviews', authMiddleware, interviewRoutes); // Not available yet

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
