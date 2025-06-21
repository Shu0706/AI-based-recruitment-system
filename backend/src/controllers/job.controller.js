const { validationResult } = require('express-validator');
// const Job = require('../models/job.model'); // Temporarily disabled - will convert to MongoDB later
// const Resume = require('../models/resume.model'); // Temporarily disabled
// const Application = require('../models/application.model'); // Temporarily disabled
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
      where.location = { [Op.iLike]: `%${req.query.location}%` };    }
    
    if (req.query.type) {
      where.type = req.query.type;
    }
    
    // Mock implementation
    const mockJobs = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations Inc.',
        location: 'New York, NY',
        description: 'We are looking for a Senior Frontend Developer to join our team...',
        requirements: 'At least 5 years of experience with React, JavaScript, and CSS.',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        createdAt: new Date('2025-06-10'),
        updatedAt: new Date('2025-06-10'),
      },
      {
        id: 2,
        title: 'Backend Engineer',
        company: 'DataSoft Solutions',
        location: 'Remote',
        description: 'Join our backend team to build scalable APIs and services...',
        requirements: 'Experience with Node.js, Express, and MongoDB required.',
        type: 'Full-time',
        salary: '$110,000 - $140,000',
        createdAt: new Date('2025-06-12'),
        updatedAt: new Date('2025-06-12'),
      },
      {
        id: 3,
        title: 'DevOps Engineer',
        company: 'Cloud Systems Inc.',
        location: 'San Francisco, CA',
        description: 'Help us build and maintain our cloud infrastructure...',
        requirements: 'AWS, Docker, Kubernetes, and CI/CD experience required.',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        createdAt: new Date('2025-06-15'),
        updatedAt: new Date('2025-06-15'),
      },
    ];
    
    // Simulate pagination
    const totalJobs = mockJobs.length;
    const filteredJobs = mockJobs.slice(offset, offset + limit);
    
    res.json({
      jobs: filteredJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      totalJobs: totalJobs,
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
    // Mock jobs data
    const mockJobs = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations Inc.',
        location: 'New York, NY',
        description: 'We are looking for a Senior Frontend Developer to join our team...',
        requirements: 'At least 5 years of experience with React, JavaScript, and CSS.',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        isActive: true,
        createdAt: new Date('2025-06-10'),
        updatedAt: new Date('2025-06-10'),
        parsedData: {
          title: 'Senior Frontend Developer',
          company: 'Tech Innovations Inc.',
          location: 'New York, NY',
          employmentType: 'Full-time',
          description: 'We are looking for a Senior Frontend Developer to join our team...',
          responsibilities: [
            'Build responsive web applications',
            'Optimize application performance',
            'Work with UX designers',
            'Implement new features'
          ],
          requiredSkills: [
            'React',
            'JavaScript',
            'CSS',
            'HTML',
            'TypeScript'
          ],
          preferredSkills: [
            'Redux',
            'Next.js',
            'GraphQL',
            'Webpack'
          ],
          requiredExperience: '5+ years',
          requiredEducation: "Bachelor's degree in Computer Science or related field",
          salary: '$120,000 - $150,000',
          benefits: [
            'Health insurance',
            'Flexible work hours',
            '401(k) matching',
            'Remote work options'
          ],
        }
      },
      {
        id: 2,
        title: 'Backend Engineer',
        company: 'DataSoft Solutions',
        location: 'Remote',
        description: 'Join our backend team to build scalable APIs and services...',
        requirements: 'Experience with Node.js, Express, and MongoDB required.',
        type: 'Full-time',
        salary: '$110,000 - $140,000',
        isActive: true,
        createdAt: new Date('2025-06-12'),
        updatedAt: new Date('2025-06-12'),
        parsedData: {
          title: 'Backend Engineer',
          company: 'DataSoft Solutions',
          location: 'Remote',
          employmentType: 'Full-time',
          description: 'Join our backend team to build scalable APIs and services...',
          responsibilities: [
            'Design and develop APIs',
            'Optimize database queries',
            'Implement security best practices',
            'Write unit and integration tests'
          ],
          requiredSkills: [
            'Node.js',
            'Express',
            'MongoDB',
            'RESTful APIs',
            'JavaScript'
          ],
          preferredSkills: [
            'TypeScript',
            'Docker',
            'Microservices',
            'AWS'
          ],
          requiredExperience: '3+ years',
          requiredEducation: "Bachelor's degree",
          salary: '$110,000 - $140,000',
          benefits: [
            'Health insurance',
            'Flexible work hours',
            'Professional development',
            'Remote work'
          ],
        }
      },
      {
        id: 3,
        title: 'DevOps Engineer',
        company: 'Cloud Systems Inc.',
        location: 'San Francisco, CA',
        description: 'Help us build and maintain our cloud infrastructure...',
        requirements: 'AWS, Docker, Kubernetes, and CI/CD experience required.',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        isActive: true,
        createdAt: new Date('2025-06-15'),
        updatedAt: new Date('2025-06-15'),
        parsedData: {
          title: 'DevOps Engineer',
          company: 'Cloud Systems Inc.',
          location: 'San Francisco, CA',
          employmentType: 'Full-time',
          description: 'Help us build and maintain our cloud infrastructure...',
          responsibilities: [
            'Build and maintain CI/CD pipelines',
            'Manage cloud infrastructure',
            'Automate deployment processes',
            'Monitor system performance'
          ],
          requiredSkills: [
            'AWS',
            'Docker',
            'Kubernetes',
            'CI/CD',
            'Terraform'
          ],
          preferredSkills: [
            'Python',
            'Bash',
            'Monitoring tools',
            'Security best practices'
          ],
          requiredExperience: '4+ years',
          requiredEducation: "Bachelor's degree in Computer Science or related field",
          salary: '$130,000 - $160,000',
          benefits: [
            'Health insurance',
            'Stock options',
            'Flexible work hours',
            'Gym membership'
          ],
        }
      }
    ];
    
    const jobId = parseInt(req.params.id);
    const job = mockJobs.find(job => job.id === jobId && job.isActive);
    
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
