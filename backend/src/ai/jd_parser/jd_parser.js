const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Load Universal Sentence Encoder model
let model;
async function loadModel() {
  if (!model) {
    model = await use.load();
    console.log('Universal Sentence Encoder model loaded for JD parsing');
  }
  return model;
}

// Load model at startup
loadModel().catch(err => console.error('Failed to load USE model for JD parsing:', err));

/**
 * Parse job description text and extract structured information
 * @param {string} jobDescription - Job description text
 * @returns {Object} - Structured job data
 */
async function parseJobDescription(jobDescription) {
  try {
    // In a real implementation, you would use NLP models like BERT/SpaCy here
    // This is a simplified version using regex patterns and rules
    
    // Basic structure for parsed data
    const parsedData = {
      jobTitle: extractJobTitle(jobDescription),
      company: extractCompany(jobDescription),
      location: extractLocation(jobDescription),
      employmentType: extractEmploymentType(jobDescription),
      requiredSkills: extractRequiredSkills(jobDescription),
      requiredExperience: extractRequiredExperience(jobDescription),
      requiredEducation: extractRequiredEducation(jobDescription),
      responsibilities: extractResponsibilities(jobDescription),
      benefits: extractBenefits(jobDescription),
      salary: extractSalaryRange(jobDescription),
      keywordScore: calculateKeywordScore(jobDescription),
    };
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing job description:', error);
    throw error;
  }
}

/**
 * Generate embedding vector for the job description
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} - Vector embedding
 */
async function generateJobEmbedding(jobDescription) {
  try {
    const model = await loadModel();
    const embeddings = await model.embed([jobDescription]);
    const embedding = await embeddings.array();
    return embedding[0]; // Return the first embedding (corresponding to our text)
  } catch (error) {
    console.error('Error generating job embedding:', error);
    throw error;
  }
}

/**
 * Identify missing information in the job description
 * @param {Object} parsedData - Structured job data
 * @returns {Array<string>} - List of missing information
 */
function identifyMissingInfo(parsedData) {
  const missingInfo = [];
  
  // Check essential job information
  if (!parsedData.jobTitle) missingInfo.push('Job title is missing');
  if (!parsedData.company) missingInfo.push('Company name is missing');
  if (!parsedData.location) missingInfo.push('Job location is missing');
  if (!parsedData.employmentType) missingInfo.push('Employment type is missing');
  
  // Check required details
  if (!parsedData.requiredSkills || parsedData.requiredSkills.length === 0) {
    missingInfo.push('Required skills are missing');
  }
  
  if (!parsedData.requiredExperience) {
    missingInfo.push('Required experience is missing');
  }
  
  if (!parsedData.requiredEducation) {
    missingInfo.push('Required education is missing');
  }
  
  if (!parsedData.responsibilities || parsedData.responsibilities.length === 0) {
    missingInfo.push('Job responsibilities are missing');
  }
  
  // Optional but recommended
  if (!parsedData.benefits || parsedData.benefits.length === 0) {
    missingInfo.push('Job benefits are missing (recommended)');
  }
  
  if (!parsedData.salary) {
    missingInfo.push('Salary range is missing (recommended)');
  }
  
  return missingInfo;
}

// Helper functions for text extraction (simplified examples)
function extractJobTitle(text) {
  // Look for job title at the beginning or in a title section
  const titleRegex = /^(.*?)(Job Description|About the Role|Overview|Company)/i;
  const match = text.match(titleRegex);
  return match ? match[1].trim() : '';
}

function extractCompany(text) {
  // Look for company name
  const companyRegex = /at\s([A-Za-z0-9\s]+)|\bat\b\s([A-Za-z0-9\s]+)|([A-Za-z0-9\s]+)\s\bis hiring\b|\bis looking for\b/i;
  const match = text.match(companyRegex);
  return match ? (match[1] || match[2] || match[3]).trim() : '';
}

function extractLocation(text) {
  // Look for location patterns
  const locationRegex = /\bin\b\s([A-Za-z\s,]+)|\blocated in\b\s([A-Za-z\s,]+)|\blocation:\b\s([A-Za-z\s,]+)/i;
  const match = text.match(locationRegex);
  return match ? (match[1] || match[2] || match[3]).trim() : '';
}

function extractEmploymentType(text) {
  // Check for employment type indicators
  const types = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
  let employmentType = '';
  
  types.forEach(type => {
    if (text.toLowerCase().includes(type)) {
      employmentType = type;
      return;
    }
  });
  
  return employmentType;
}

function extractRequiredSkills(text) {
  // Look for skills section
  const skillsSection = extractSection(text, 'skills', 'requirements', 'qualifications');
  
  if (!skillsSection) return [];
  
  // Define common tech skills
  const techSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'TensorFlow', 'PyTorch', 'scikit-learn', 'pandas', 'NumPy',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'REST API', 'GraphQL', 'Microservices', 'Serverless',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence'
  ];
  
  // Check for skills in the skills section
  const skills = [];
  techSkills.forEach(skill => {
    if (skillsSection.includes(skill) || text.includes(skill)) {
      skills.push(skill);
    }
  });
  
  // Check for bullet points in skills section
  const bulletItems = skillsSection.split(/•|\*|\-|–/);
  if (bulletItems.length > 1) {
    bulletItems.slice(1).forEach(item => {
      if (item.trim() && !skills.includes(item.trim())) {
        skills.push(item.trim());
      }
    });
  }
  
  return skills;
}

function extractRequiredExperience(text) {
  // Look for experience requirements
  const expRegex = /(\d+)[\+]?\s+years?\s+of\s+experience|experience\s*:?\s*(\d+)[\+]?\s+years?/i;
  const match = text.match(expRegex);
  return match ? (match[1] || match[2]) + '+ years' : '';
}

function extractRequiredEducation(text) {
  // Look for education requirements
  const eduKeywords = ["Bachelor's", "Master's", "PhD", "B.S.", "M.S.", "MBA", "degree"];
  
  let education = '';
  
  eduKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      const keywordIndex = text.indexOf(keyword);
      const context = text.substr(keywordIndex - 20, 50);
      education = context.trim();
      return;
    }
  });
  
  return education;
}

function extractResponsibilities(text) {
  // Look for responsibilities section
  const respSection = extractSection(text, 'responsibilities', 'duties', 'what you\'ll do', 'role', 'day-to-day');
  
  if (!respSection) return [];
  
  // Extract bullet points
  const bulletItems = respSection.split(/•|\*|\-|–/);
  const responsibilities = [];
  
  if (bulletItems.length > 1) {
    bulletItems.slice(1).forEach(item => {
      if (item.trim()) {
        responsibilities.push(item.trim());
      }
    });
  }
  
  return responsibilities;
}

function extractBenefits(text) {
  // Look for benefits section
  const benefitsSection = extractSection(text, 'benefits', 'perks', 'what we offer', 'we provide', 'compensation');
  
  if (!benefitsSection) return [];
  
  // Extract bullet points
  const bulletItems = benefitsSection.split(/•|\*|\-|–/);
  const benefits = [];
  
  if (bulletItems.length > 1) {
    bulletItems.slice(1).forEach(item => {
      if (item.trim()) {
        benefits.push(item.trim());
      }
    });
  }
  
  return benefits;
}

function extractSalaryRange(text) {
  // Look for salary information
  const salaryRegex = /\$(\d{2,3}),?(\d{3})\s*-\s*\$(\d{2,3}),?(\d{3})|(\d{2,3}),?(\d{3})\s*-\s*(\d{2,3}),?(\d{3})\s*USD/i;
  const match = text.match(salaryRegex);
  return match ? match[0] : '';
}

function calculateKeywordScore(text) {
  // Calculate keyword density for common positive job keywords
  const positiveKeywords = [
    'opportunity', 'growth', 'learn', 'develop', 'innovative', 'cutting-edge',
    'team', 'collaborate', 'flexible', 'remote', 'hybrid', 'benefits',
    'challenging', 'exciting', 'dynamic', 'leader', 'competitive', 'bonus',
    'equity', 'stock', 'options', 'advancement', 'promotion', 'training'
  ];
  
  let score = 0;
  positiveKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length;
    }
  });
  
  return score;
}

function extractSection(text, ...sectionNames) {
  // Helper function to extract a section based on possible section names
  const sectionRegexes = sectionNames.map(name => 
    new RegExp(`(${name}:?\\s*)(.*?)(?=(\\n\\s*\\n|\\n\\s*[A-Z][A-Za-z\\s]+:))`, 'is')
  );
  
  let sectionText = '';
  
  for (const regex of sectionRegexes) {
    const match = text.match(regex);
    if (match && match[2]) {
      sectionText = match[2].trim();
      break;
    }
  }
  
  return sectionText;
}

module.exports = {
  parseJobDescription,
  generateJobEmbedding,
  identifyMissingInfo,
};
