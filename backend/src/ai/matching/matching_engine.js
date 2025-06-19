const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Load Universal Sentence Encoder model
let model;
async function loadModel() {
  if (!model) {
    model = await use.load();
    console.log('Universal Sentence Encoder model loaded for matching');
  }
  return model;
}

// Load model at startup
loadModel().catch(err => console.error('Failed to load USE model for matching:', err));

/**
 * Calculate cosine similarity between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} - Similarity score between 0 and 1
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = tf.tensor1d(vecA).dot(tf.tensor1d(vecB)).arraySync();
  const normA = tf.norm(tf.tensor1d(vecA)).arraySync();
  const normB = tf.norm(tf.tensor1d(vecB)).arraySync();
  return dotProduct / (normA * normB);
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
  try {
    // Calculate overall semantic similarity using embeddings
    const semanticSimilarity = cosineSimilarity(resumeEmbedding, jobEmbedding);
    
    // Calculate skill match
    const skillMatch = calculateSkillMatch(resumeData.skills, jobData.requiredSkills);
    
    // Calculate experience match
    const experienceMatch = calculateExperienceMatch(resumeData.experience, jobData.requiredExperience);
    
    // Calculate education match
    const educationMatch = calculateEducationMatch(resumeData.education, jobData.requiredEducation);
    
    // Calculate weights for each component
    const weights = {
      semanticSimilarity: 0.4,
      skillMatch: 0.3,
      experienceMatch: 0.2,
      educationMatch: 0.1,
    };
    
    // Calculate weighted average score
    const overallScore = (
      semanticSimilarity * weights.semanticSimilarity +
      skillMatch.score * weights.skillMatch +
      experienceMatch.score * weights.experienceMatch +
      educationMatch.score * weights.educationMatch
    );
    
    // Format score as percentage
    const formattedScore = Math.round(overallScore * 100);
    
    // Prepare detailed matching information
    const matchDetails = {
      overallScore: formattedScore,
      semanticSimilarity: Math.round(semanticSimilarity * 100),
      skillMatch: {
        score: Math.round(skillMatch.score * 100),
        matchedSkills: skillMatch.matchedSkills,
        missingSkills: skillMatch.missingSkills,
      },
      experienceMatch: {
        score: Math.round(experienceMatch.score * 100),
        details: experienceMatch.details,
      },
      educationMatch: {
        score: Math.round(educationMatch.score * 100),
        details: educationMatch.details,
      },
    };
    
    return matchDetails;
  } catch (error) {
    console.error('Error matching resume to job:', error);
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
  try {
    const model = await loadModel();
    const embeddings = await model.embed(texts);
    return await embeddings.array();
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Find top matching candidates for a job
 * @param {Object} jobData - Job data with embedding
 * @param {Array<Object>} candidates - Array of candidate data with embeddings
 * @param {number} limit - Maximum number of candidates to return
 * @returns {Array<Object>} - Top matching candidates with scores
 */
async function findTopCandidatesForJob(jobData, candidates, limit = 10) {
  try {
    const matchResults = [];
    
    for (const candidate of candidates) {
      const matchResult = matchResumeToJob(
        candidate.resumeData,
        jobData.parsedData,
        candidate.embedding,
        jobData.embedding
      );
      
      matchResults.push({
        candidateId: candidate.userId,
        matchScore: matchResult.overallScore,
        matchDetails: matchResult,
      });
    }
    
    // Sort by match score (descending)
    matchResults.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top matches
    return matchResults.slice(0, limit);
  } catch (error) {
    console.error('Error finding top candidates:', error);
    throw error;
  }
}

/**
 * Find top matching jobs for a candidate
 * @param {Object} candidateData - Candidate data with embedding
 * @param {Array<Object>} jobs - Array of job data with embeddings
 * @param {number} limit - Maximum number of jobs to return
 * @returns {Array<Object>} - Top matching jobs with scores
 */
async function findTopJobsForCandidate(candidateData, jobs, limit = 10) {
  try {
    const matchResults = [];
    
    for (const job of jobs) {
      const matchResult = matchResumeToJob(
        candidateData.resumeData,
        job.parsedData,
        candidateData.embedding,
        job.embedding
      );
      
      matchResults.push({
        jobId: job.id,
        matchScore: matchResult.overallScore,
        matchDetails: matchResult,
      });
    }
    
    // Sort by match score (descending)
    matchResults.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top matches
    return matchResults.slice(0, limit);
  } catch (error) {
    console.error('Error finding top jobs:', error);
    throw error;
  }
}

module.exports = {
  matchResumeToJob,
  generateEmbeddings,
  findTopCandidatesForJob,
  findTopJobsForCandidate,
};
