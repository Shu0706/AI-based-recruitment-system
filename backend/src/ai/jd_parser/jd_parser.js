// Mock job description parser module
console.log('Using mock JD parser module');

/**
 * Parse job description text and extract structured information
 * @param {string} text - Job description text
 * @returns {Object} - Structured job description data
 */
async function parseJobDescription(text) {
  console.log('[MOCK] Parsing job description text');
  
  // Return mock structured data
  return {
    title: extractTitle(text) || 'Software Engineer',
    company: extractCompany(text) || 'Tech Company Inc.',
    location: extractLocation(text) || 'Remote',
    employmentType: extractEmploymentType(text) || 'Full-time',
    description: text.substring(0, 100) + '...',
    responsibilities: extractResponsibilities(text),
    requiredSkills: extractRequiredSkills(text),
    preferredSkills: extractPreferredSkills(text),
    requiredExperience: extractRequiredExperience(text) || '3+ years',
    requiredEducation: extractRequiredEducation(text) || "Bachelor's degree",
    salary: extractSalary(text) || '$80,000 - $120,000',
    benefits: extractBenefits(text),
    applicationDeadline: extractApplicationDeadline(text),
  };
}

/**
 * Generate embedding vector for the job description
 * @param {string} text - Job description text
 * @returns {Promise<Array<number>>} - Vector embedding
 */
async function generateJobEmbedding(text) {
  console.log('[MOCK] Generating job embedding');
  
  // Return a mock embedding vector (simplified 10-dimensional)
  return Array.from({ length: 10 }, () => Math.random());
}

/**
 * Identify key requirements from job description
 * @param {Object} parsedData - Structured job description data
 * @returns {Array<string>} - List of key requirements
 */
function identifyKeyRequirements(parsedData) {
  console.log('[MOCK] Identifying key requirements');
  
  // Return mock key requirements
  const keyRequirements = [];
  
  if (parsedData.requiredSkills && parsedData.requiredSkills.length > 0) {
    keyRequirements.push(...parsedData.requiredSkills.slice(0, 3).map(skill => `Skill: ${skill}`));
  }
  
  if (parsedData.requiredExperience) {
    keyRequirements.push(`Experience: ${parsedData.requiredExperience}`);
  }
  
  if (parsedData.requiredEducation) {
    keyRequirements.push(`Education: ${parsedData.requiredEducation}`);
  }
  
  return keyRequirements;
}

// Helper functions (simplified mock implementations)
function extractTitle(text) {
  if (text.includes('Engineer')) return 'Software Engineer';
  if (text.includes('Developer')) return 'Software Developer';
  if (text.includes('Manager')) return 'Project Manager';
  if (text.includes('Analyst')) return 'Data Analyst';
  return null;
}

function extractCompany(text) {
  return null; // Mock implementation returns null
}

function extractLocation(text) {
  if (text.includes('Remote')) return 'Remote';
  if (text.includes('New York')) return 'New York, NY';
  if (text.includes('San Francisco')) return 'San Francisco, CA';
  return null;
}

function extractEmploymentType(text) {
  if (text.includes('Part-time')) return 'Part-time';
  if (text.includes('Contract')) return 'Contract';
  if (text.includes('Freelance')) return 'Freelance';
  return 'Full-time';
}

function extractResponsibilities(text) {
  return [
    'Develop and maintain software applications',
    'Collaborate with cross-functional teams',
    'Write clean, scalable code',
    'Debug and fix issues in existing applications',
    'Participate in code reviews'
  ];
}

function extractRequiredSkills(text) {
  return [
    'JavaScript',
    'React',
    'Node.js',
    'TypeScript',
    'MongoDB'
  ];
}

function extractPreferredSkills(text) {
  return [
    'AWS',
    'Docker',
    'GraphQL',
    'CI/CD',
    'Agile methodologies'
  ];
}

function extractRequiredExperience(text) {
  if (text.includes('5+ years')) return '5+ years';
  if (text.includes('3+ years')) return '3+ years';
  if (text.includes('1+ years')) return '1+ year';
  return '2+ years';
}

function extractRequiredEducation(text) {
  if (text.includes("Master's")) return "Master's degree";
  if (text.includes('Bachelor')) return "Bachelor's degree";
  if (text.includes('PhD')) return 'PhD';
  return null;
}

function extractSalary(text) {
  if (text.includes('$150,000')) return '$150,000 - $180,000';
  if (text.includes('$120,000')) return '$120,000 - $150,000';
  if (text.includes('$100,000')) return '$100,000 - $130,000';
  return null;
}

function extractBenefits(text) {
  return [
    'Health insurance',
    'Dental and vision coverage',
    'Flexible work schedule',
    'Remote work options',
    '401(k) matching'
  ];
}

function extractApplicationDeadline(text) {
  return null; // Mock implementation returns null
}

module.exports = {
  parseJobDescription,
  generateJobEmbedding,
  identifyKeyRequirements,
};
