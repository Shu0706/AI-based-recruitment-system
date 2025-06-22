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
const { apiLimiter, speedLimiter } = require('./middleware/rateLimiter.middleware');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Trust proxy (important for rate limiting when behind a proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  }
}));

// Rate limiting middleware
app.use('/api/', apiLimiter);
app.use('/api/', speedLimiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running properly!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple route for testing
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running properly!',
    timestamp: new Date().toISOString()
  });
});

// Test POST endpoint
app.post('/api/test-post', (req, res) => {
  console.log('Test POST received:', req.body);
  res.json({ 
    success: true,
    message: 'POST received successfully', 
    data: req.body,
    timestamp: new Date().toISOString()
  });
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
