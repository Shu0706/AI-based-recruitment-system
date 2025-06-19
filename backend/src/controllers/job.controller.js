const { validationResult } = require('express-validator');
const Job = require('../models/job.model');
const Resume = require('../models/resume.model');
const Application = require('../models/application.model');
const User = require('../models/user.model');
const { 
  parseJobDescription, 
  generateJobEmbedding,
  identifyMissingInfo 
} = require('../ai/jd_parser/jd_parser');
const {
  matchResumeToJob,
  findTopCandidatesForJob
} = require('../ai/matching/matching_engine');

/**
 * Create a new job
 * @route POST /api/jobs
 * @access Private (Admin only)
 */
exports.createJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      responsibilities,
      minSalary,
      maxSalary,
      experience,
      education,
      skills,
      applicationDeadline,
    } = req.body;

    // Parse job description
    const jobText = `${title}\n\n${description}\n\nRequirements:\n${requirements}\n\nResponsibilities:\n${responsibilities}`;
    const parsedData = await parseJobDescription(jobText);
    
    // Generate job embedding
    const embedding = await generateJobEmbedding(jobText);
    
    // Identify missing information
    const missingInfo = identifyMissingInfo(parsedData);

    // Create job in database
    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      requirements,
      responsibilities,
      minSalary,
      maxSalary,
      experience,
      education,
      skills,
      parsedData: {
        ...parsedData,
        embedding,
        missingInfo,
      },
      applicationDeadline: applicationDeadline || null,
      adminId: req.user.id,
    });

    res.status(201).json({
      message: 'Job created successfully',
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        parsedData: {
          ...job.parsedData,
          embedding: undefined,
        },
        missingInfo,
      }
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all jobs
 * @route GET /api/jobs
 * @access Public
 */
exports.getAllJobs = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filters
    const where = { isActive: true };
    
    if (req.query.title) {
      where.title = { [Op.iLike]: `%${req.query.title}%` };
    }
    
    if (req.query.location) {
      where.location = { [Op.iLike]: `%${req.query.location}%` };
    }
    
    if (req.query.type) {
      where.type = req.query.type;
    }
    
    // Query
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      attributes: { 
        exclude: ['parsedData.embedding'] 
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalJobs: count,
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        isActive: true
      },
      attributes: { 
        exclude: ['parsedData.embedding'] 
      },
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update job
 * @route PUT /api/jobs/:id
 * @access Private (Admin only)
 */
exports.updateJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if job exists and belongs to admin
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        adminId: req.user.id
      }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized to update' });
    }

    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      responsibilities,
      minSalary,
      maxSalary,
      experience,
      education,
      skills,
      applicationDeadline,
      isActive,
    } = req.body;

    // Parse job description if content has changed
    let parsedData = job.parsedData;
    let embedding = job.parsedData.embedding;
    let missingInfo = job.parsedData.missingInfo;
    
    if (
      title !== job.title ||
      description !== job.description ||
      requirements !== job.requirements ||
      responsibilities !== job.responsibilities
    ) {
      // Re-parse job description
      const jobText = `${title}\n\n${description}\n\nRequirements:\n${requirements}\n\nResponsibilities:\n${responsibilities}`;
      parsedData = await parseJobDescription(jobText);
      
      // Generate new embedding
      embedding = await generateJobEmbedding(jobText);
      
      // Identify missing information
      missingInfo = identifyMissingInfo(parsedData);
    }

    // Update job
    await job.update({
      title: title || job.title,
      company: company || job.company,
      location: location || job.location,
      type: type || job.type,
      description: description || job.description,
      requirements: requirements || job.requirements,
      responsibilities: responsibilities || job.responsibilities,
      minSalary: minSalary !== undefined ? minSalary : job.minSalary,
      maxSalary: maxSalary !== undefined ? maxSalary : job.maxSalary,
      experience: experience || job.experience,
      education: education || job.education,
      skills: skills || job.skills,
      parsedData: {
        ...parsedData,
        embedding,
        missingInfo,
      },
      applicationDeadline: applicationDeadline || job.applicationDeadline,
      isActive: isActive !== undefined ? isActive : job.isActive,
    });

    res.json({
      message: 'Job updated successfully',
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        isActive: job.isActive,
        parsedData: {
          ...job.parsedData,
          embedding: undefined,
        },
        missingInfo,
      }
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete job (soft delete)
 * @route DELETE /api/jobs/:id
 * @access Private (Admin only)
 */
exports.deleteJob = async (req, res) => {
  try {
    // Check if job exists and belongs to admin
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        adminId: req.user.id
      }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized to delete' });
    }

    // Soft delete
    await job.update({ isActive: false });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get jobs created by admin
 * @route GET /api/jobs/admin
 * @access Private (Admin only)
 */
exports.getAdminJobs = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Query
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: {
        adminId: req.user.id
      },
      attributes: { 
        exclude: ['parsedData.embedding'] 
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalJobs: count,
    });
  } catch (error) {
    console.error('Error getting admin jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Find matching candidates for a job
 * @route GET /api/jobs/:id/candidates
 * @access Private (Admin only)
 */
exports.findMatchingCandidates = async (req, res) => {
  try {
    // Check if job exists and belongs to admin
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        adminId: req.user.id
      }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized to access' });
    }

    // Get all resumes for matching
    const resumes = await Resume.find({ isActive: true });
    
    if (resumes.length === 0) {
      return res.json({
        message: 'No candidates found for matching',
        matches: []
      });
    }
    
    // Prepare candidates data for matching
    const candidates = [];
    
    for (const resume of resumes) {
      candidates.push({
        userId: resume.userId,
        resumeId: resume._id,
        resumeData: resume.parsedData,
        embedding: resume.vectorEmbedding,
      });
    }
    
    // Find top matching candidates
    const matches = await findTopCandidatesForJob(
      {
        id: job.id,
        parsedData: job.parsedData,
        embedding: job.parsedData.embedding,
      },
      candidates,
      10 // Limit to top 10 matches
    );
    
    // Get user details for matched candidates
    const matchesWithDetails = [];
    
    for (const match of matches) {
      const user = await User.findByPk(match.candidateId, {
        attributes: ['id', 'firstName', 'lastName', 'email']
      });
      
      if (user) {
        const resume = await Resume.findById(match.resumeId, {
          select: 'fileName parsedData.personalInfo parsedData.skills parsedData.experience'
        });
        
        matchesWithDetails.push({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          resumeId: match.resumeId,
          matchScore: match.matchScore,
          matchDetails: match.matchDetails,
          resumeHighlights: resume ? {
            skills: resume.parsedData.skills,
            experience: resume.parsedData.experience.map(exp => ({
              company: exp.company,
              position: exp.position,
              duration: exp.duration,
            })),
          } : null,
        });
      }
    }
    
    res.json({
      job: {
        id: job.id,
        title: job.title,
      },
      matches: matchesWithDetails,
    });
  } catch (error) {
    console.error('Error finding matching candidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
