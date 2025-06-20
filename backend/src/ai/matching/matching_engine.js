// Mock matching engine that doesn't require TensorFlow
console.log('Using mock matching engine module');

// No model to load in mock version
let model = null;
async function loadModel() {
  console.log('Mock matching model loaded');
  return null;
}

/**
 * Mock cosine similarity between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} - Similarity score between 0 and 1
 */
function cosineSimilarity(vecA, vecB) {
  console.log('[MOCK] Calculating cosine similarity');
  // Return a random value between 0.65 and 0.95 for demo purposes
  return 0.65 + Math.random() * 0.3;
}

/**
 * Match resume to job description
 * @param {Object} resumeData - Parsed resume data
 * @param {Object} jobData - Parsed job description data
 * @param {Array<number>} resumeEmbedding - Resume vector embedding
 * @param {Array<number>} jobEmbedding - Job description vector embedding
 * @returns {Object} - Matching results
 */
function matchResumeToJob(resumeData, jobData, resumeEmbedding, jobEmbedding) {
  console.log('[MOCK] Matching resume to job');
  
  try {
    // Generate mock similarity scores
    const semanticSimilarity = 0.65 + Math.random() * 0.3;
    const skillMatchScore = 0.7 + Math.random() * 0.3;
    const experienceMatchScore = 0.6 + Math.random() * 0.4;
    const educationMatchScore = 0.75 + Math.random() * 0.25;
    
    // Generate mock matched and missing skills
    const mockMatchedSkills = ['JavaScript', 'React', 'Node.js'];
    const mockMissingSkills = ['GraphQL', 'AWS Lambda'];
    
    // Calculate weighted average score
    const weights = {
      semanticSimilarity: 0.4,
      skillMatch: 0.3,
      experienceMatch: 0.2,
      educationMatch: 0.1,
    };
    
    // Calculate weighted average score
    const overallScore = (
      semanticSimilarity * weights.semanticSimilarity +
      skillMatchScore * weights.skillMatch +
      experienceMatchScore * weights.experienceMatch +
      educationMatchScore * weights.educationMatch
    );
    
    // Format score as percentage
    const formattedScore = Math.round(overallScore * 100);
    
    // Prepare detailed matching information
    return {
      overallScore: formattedScore,
      semanticSimilarity: Math.round(semanticSimilarity * 100),
      skillMatch: {
        score: Math.round(skillMatchScore * 100),
        matchedSkills: mockMatchedSkills,
        missingSkills: mockMissingSkills,
      },
      experienceMatch: {
        score: Math.round(experienceMatchScore * 100),
        details: 'Candidate has 4 years of experience, meeting the requirement of 3+ years',
      },
      educationMatch: {
        score: Math.round(educationMatchScore * 100),
        details: 'Candidate meets or exceeds the education requirements',
      },
    };
  } catch (error) {
    console.error('[MOCK] Error matching resume to job:', error);
    throw error;
  }
}

/**
 * Calculate skill match between resume skills and job required skills
 * @param {Array<Object>} resumeSkills - Skills from resume
 * @param {Array<string>} jobSkills - Required skills from job
 * @returns {Object} - Skill match score and details
 */
function calculateSkillMatch(resumeSkills, jobSkills) {
  if (!resumeSkills || !jobSkills || resumeSkills.length === 0 || jobSkills.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: jobSkills || [] };
  }
  
  // Extract skill names from resume
  const resumeSkillNames = resumeSkills.map(skill => skill.name.toLowerCase());
  
  // Convert job skills to lowercase
  const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
  
  // Find matched skills
  const matchedSkills = [];
  const missingSkills = [];
  
  jobSkillsLower.forEach((jobSkill) => {
    // Check for exact matches
    if (resumeSkillNames.includes(jobSkill)) {
      matchedSkills.push(jobSkill);
    } 
    // Check for partial matches (e.g., "JavaScript" would match "JavaScript React")
    else if (resumeSkillNames.some(resumeSkill => resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill))) {
      matchedSkills.push(jobSkill);
    } 
    else {
      missingSkills.push(jobSkill);
    }
  });
  
  // Calculate score based on the percentage of matched skills
  const score = jobSkillsLower.length > 0 ? matchedSkills.length / jobSkillsLower.length : 0;
  
  return {
    score,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Calculate experience match between resume experience and job required experience
 * @param {Array<Object>} resumeExperience - Experience entries from resume
 * @param {string} jobExperience - Required experience from job
 * @returns {Object} - Experience match score and details
 */
function calculateExperienceMatch(resumeExperience, jobExperience) {
  if (!resumeExperience || resumeExperience.length === 0 || !jobExperience) {
    return { score: 0, details: 'No experience data to compare' };
  }
  
  // Extract years from job required experience (e.g., "3+ years" -> 3)
  const requiredYearsMatch = jobExperience.match(/(\d+)\+?\s*years?/i);
  const requiredYears = requiredYearsMatch ? parseInt(requiredYearsMatch[1]) : 0;
  
  if (requiredYears === 0) {
    return { score: 0.5, details: 'Could not determine required years of experience' };
  }
  
  // Calculate total years of experience from resume
  let totalYears = 0;
  resumeExperience.forEach(exp => {
    if (exp.startDate && exp.endDate) {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
      
      if (!isNaN(startDate) && !isNaN(endDate)) {
        const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
        totalYears += years;
      }
    }
  });
  
  // Round to nearest 0.5
  totalYears = Math.round(totalYears * 2) / 2;
  
  // Calculate experience match score
  let score = 0;
  let details = '';
  
  if (totalYears >= requiredYears) {
    score = 1.0;
    details = `Candidate has ${totalYears} years of experience, meeting the requirement of ${requiredYears}+ years`;
  } else if (totalYears >= requiredYears * 0.8) {
    score = 0.8;
    details = `Candidate has ${totalYears} years of experience, slightly below the requirement of ${requiredYears}+ years`;
  } else if (totalYears >= requiredYears * 0.6) {
    score = 0.6;
    details = `Candidate has ${totalYears} years of experience, below the requirement of ${requiredYears}+ years`;
  } else if (totalYears >= requiredYears * 0.4) {
    score = 0.4;
    details = `Candidate has ${totalYears} years of experience, significantly below the requirement of ${requiredYears}+ years`;
  } else {
    score = 0.2;
    details = `Candidate has only ${totalYears} years of experience, far below the requirement of ${requiredYears}+ years`;
  }
  
  return {
    score,
    details,
  };
}

/**
 * Calculate education match between resume education and job required education
 * @param {Array<Object>} resumeEducation - Education entries from resume
 * @param {string} jobEducation - Required education from job
 * @returns {Object} - Education match score and details
 */
function calculateEducationMatch(resumeEducation, jobEducation) {
  if (!resumeEducation || resumeEducation.length === 0 || !jobEducation) {
    return { score: 0, details: 'No education data to compare' };
  }
  
  // Define education levels and their relative values
  const educationLevels = {
    'high school': 1,
    'associate': 2,
    'bachelor': 3,
    "bachelor's": 3,
    'bs': 3,
    'ba': 3,
    'master': 4,
    "master's": 4,
    'ms': 4,
    'ma': 4,
    'mba': 4,
    'phd': 5,
    'doctorate': 5,
  };
  
  // Determine required education level from job
  let requiredLevel = 0;
  Object.keys(educationLevels).forEach(level => {
    if (jobEducation.toLowerCase().includes(level)) {
      requiredLevel = educationLevels[level];
    }
  });
  
  if (requiredLevel === 0) {
    return { score: 0.5, details: 'Could not determine required education level' };
  }
  
  // Find highest education level from resume
  let highestLevel = 0;
  resumeEducation.forEach(edu => {
    let eduLevel = 0;
    Object.keys(educationLevels).forEach(level => {
      if (edu.degree && edu.degree.toLowerCase().includes(level)) {
        eduLevel = educationLevels[level];
      }
    });
    highestLevel = Math.max(highestLevel, eduLevel);
  });
  
  // Calculate education match score
  let score = 0;
  let details = '';
  
  if (highestLevel >= requiredLevel) {
    score = 1.0;
    details = 'Candidate meets or exceeds the education requirements';
  } else if (highestLevel === requiredLevel - 1) {
    score = 0.7;
    details = 'Candidate is slightly below the education requirements';
  } else {
    score = 0.3;
    details = 'Candidate does not meet the education requirements';
  }
  
  return {
    score,
    details,
  };
}

/**
 * Generate embeddings for multiple documents
 * @param {Array<string>} texts - Array of texts to embed
 * @returns {Promise<Array<Array<number>>>} - Array of embeddings
 */
async function generateEmbeddings(texts) {
  console.log('[MOCK] Generating embeddings for', texts.length, 'texts');
  
  // Return mock embeddings (10-dimensional vectors)
  return texts.map(() => Array.from({ length: 10 }, () => Math.random()));
}

/**
 * Find top matching candidates for a job
 * @param {Object} jobData - Job data with embedding
 * @param {Array<Object>} candidates - Array of candidate data with embeddings
 * @param {number} limit - Maximum number of candidates to return
 * @returns {Array<Object>} - Top matching candidates with scores
 */
async function findTopCandidatesForJob(jobData, candidates, limit = 10) {
  console.log('[MOCK] Finding top candidates for job');
  
  // Generate mock match results
  const mockResults = candidates.map(candidate => {
    const score = Math.floor(60 + Math.random() * 40); // Score between 60-99
    return {
      candidateId: candidate.userId || 'mock-candidate-id',
      matchScore: score,
      matchDetails: {
        overallScore: score,
        semanticSimilarity: Math.floor(50 + Math.random() * 50),
        skillMatch: {
          score: Math.floor(60 + Math.random() * 40),
          matchedSkills: ['JavaScript', 'React', 'Node.js'],
          missingSkills: ['GraphQL', 'AWS Lambda'],
        },
        experienceMatch: {
          score: Math.floor(70 + Math.random() * 30),
          details: 'Candidate has sufficient experience',
        },
        educationMatch: {
          score: Math.floor(80 + Math.random() * 20),
          details: 'Candidate meets education requirements',
        },
      },
    };
  });
  
  // Sort by match score (descending)
  mockResults.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return top matches
  return mockResults.slice(0, limit);
}

/**
 * Find top matching jobs for a candidate
 * @param {Object} candidateData - Candidate data with embedding
 * @param {Array<Object>} jobs - Array of job data with embeddings
 * @param {number} limit - Maximum number of jobs to return
 * @returns {Array<Object>} - Top matching jobs with scores
 */
async function findTopJobsForCandidate(candidateData, jobs, limit = 10) {
  console.log('[MOCK] Finding top jobs for candidate');
  
  // Generate mock match results
  const mockResults = jobs.map(job => {
    const score = Math.floor(60 + Math.random() * 40); // Score between 60-99
    return {
      jobId: job.id || 'mock-job-id',
      matchScore: score,
      matchDetails: {
        overallScore: score,
        semanticSimilarity: Math.floor(50 + Math.random() * 50),
        skillMatch: {
          score: Math.floor(60 + Math.random() * 40),
          matchedSkills: ['JavaScript', 'React', 'Node.js'],
          missingSkills: ['GraphQL', 'AWS Lambda'],
        },
        experienceMatch: {
          score: Math.floor(70 + Math.random() * 30),
          details: 'Candidate has sufficient experience',
        },
        educationMatch: {
          score: Math.floor(80 + Math.random() * 20),
          details: 'Candidate meets education requirements',
        },
      },
    };
  });
  
  // Sort by match score (descending)
  mockResults.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return top matches
  return mockResults.slice(0, limit);
}

module.exports = {
  matchResumeToJob,
  generateEmbeddings,
  findTopCandidatesForJob,
  findTopJobsForCandidate,
};
