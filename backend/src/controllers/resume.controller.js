const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
// const Resume = require('../models/resume.model'); // Temporarily disabled
const { 
  extractTextFromResume, 
  parseResumeText, 
  generateResumeEmbedding,
  identifyMissingInfo 
} = require('../ai/resume_parser/resume_parser');

// Set up storage for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/resumes');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `${req.user.id}-${uniqueSuffix}${fileExt}`);
  }
});

// File filter to only accept certain file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.docx', '.doc', '.txt'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Please upload PDF, DOCX, DOC, or TXT files.'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  }
});

/**
 * Upload and process resume
 * @route POST /api/resumes/upload
 * @access Private
 */
exports.uploadResume = [
  // Middleware to handle file upload
  upload.single('resume'),
  
  // Controller function
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { originalname, filename, path: filePath, size } = req.file;
      const fileType = path.extname(originalname).substring(1).toLowerCase();
      
      // Extract text from resume
      const extractedText = await extractTextFromResume(filePath, fileType);
      
      // Parse resume text
      const parsedData = await parseResumeText(extractedText);
      
      // Generate resume embedding
      const embedding = await generateResumeEmbedding(extractedText);
      
      // Identify missing information
      const missingInfo = identifyMissingInfo(parsedData);
      
      // Create resume record in database
      const resume = await Resume.create({
        userId: req.user.id,
        fileName: originalname,
        filePath: filename,
        fileType,
        fileSize: size,
        parsedData,
        vectorEmbedding: embedding,
        missingInfo,
      });
      
      res.status(201).json({
        message: 'Resume uploaded and processed successfully',
        resume: {
          id: resume._id,
          fileName: resume.fileName,
          parsedData: resume.parsedData,
          missingInfo: resume.missingInfo,
        }
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

/**
 * Get all resumes for current user
 * @route GET /api/resumes
 * @access Private
 */
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ 
      userId: req.user.id,
      isActive: true 
    })
    .select('-vectorEmbedding')
    .sort({ createdAt: -1 });
    
    res.json(resumes);
  } catch (error) {
    console.error('Error getting resumes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get resume by ID
 * @route GET /api/resumes/:id
 * @access Private
 */
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    }).select('-vectorEmbedding');
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Error getting resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update resume status (soft delete)
 * @route PATCH /api/resumes/:id
 * @access Private
 */
exports.updateResumeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }
    
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive },
      { new: true }
    ).select('-vectorEmbedding');
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json({
      message: isActive ? 'Resume activated' : 'Resume deactivated',
      resume
    });
  } catch (error) {
    console.error('Error updating resume status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get resume file
 * @route GET /api/resumes/:id/file
 * @access Private
 */
exports.getResumeFile = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    const filePath = path.join(__dirname, '../../uploads/resumes', resume.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }
    
    res.download(filePath, resume.fileName);
  } catch (error) {
    console.error('Error getting resume file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
