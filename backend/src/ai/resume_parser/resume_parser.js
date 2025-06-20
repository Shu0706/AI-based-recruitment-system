const fs = require('fs');
const path = require('path');

// Mock resume parser module that doesn't require TensorFlow or other complex dependencies
console.log('Using mock resume parser module');

// No model to load in mock version
let model = null;
async function loadModel() {
  console.log('Mock model loaded');
  return null;
}

/**
 * Parse resume document based on file type
 * @param {string} filePath - Path to the resume file
 * @param {string} fileType - Type of the file (pdf, docx, doc, txt)
 * @returns {Promise<string>} - Extracted text from the resume
 */
async function extractTextFromResume(filePath, fileType) {
  try {
    console.log(`[MOCK] Extracting text from ${fileType} resume at ${filePath}`);
    
    // For development, just return a mock text if the file exists
    if (fs.existsSync(filePath)) {
      return `This is a mock resume text extracted from a ${fileType} file at ${filePath}.
      
John Doe
Software Engineer
john.doe@example.com
(123) 456-7890
linkedin.com/in/johndoe
      
EDUCATION
Bachelor of Science in Computer Science
University of Technology
2016-2020
      
EXPERIENCE
Senior Software Engineer
Tech Solutions Inc.
2020-Present
- Developed and maintained web applications
- Led a team of 5 developers
- Implemented CI/CD pipelines
      
Junior Software Developer
Dev Startup
2018-2020
- Assisted in frontend development
- Fixed bugs in the application
      
SKILLS
JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git`;
    } else {
      throw new Error(`File does not exist: ${filePath}`);
    }
  } catch (error) {
    console.error('[MOCK] Error extracting text from resume:', error);
    throw error;
  }
}

/**
 * Parse resume text and extract structured information
 * @param {string} text - Extracted text from resume
 * @returns {Object} - Structured resume data
 */
async function parseResumeText(text) {
  console.log('[MOCK] Parsing resume text');
  
  // Return mock structured data
  return {
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      address: '123 Main St, Anytown, USA',
      linkedin: 'https://www.linkedin.com/in/johndoe',
      website: 'https://johndoe.dev',
    },
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
        gpa: '3.8',
      }
    ],
    experience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020',
        endDate: 'Present',
        description: 'Developed and maintained web applications. Led a team of 5 developers. Implemented CI/CD pipelines.',
      },
      {
        company: 'Dev Startup',
        position: 'Junior Software Developer',
        location: 'Austin, TX',
        startDate: '2018',
        endDate: '2020',
        description: 'Assisted in frontend development. Fixed bugs in the application.',
      }
    ],
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'SQL', level: 'Advanced' },
      { name: 'AWS', level: 'Intermediate' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'Git', level: 'Advanced' }
    ],
    certifications: [
      {
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2021'
      }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Spanish', proficiency: 'Intermediate' }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform using MERN stack',
        technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
        url: 'https://github.com/johndoe/ecommerce'
      }
    ],
  };
}

/**
 * Generate embedding vector for the resume
 * @param {string} text - Resume text
 * @returns {Promise<Object>} - Vector embedding
 */
async function generateResumeEmbedding(text) {
  console.log('[MOCK] Generating resume embedding');
  
  // Return a mock embedding vector (simplified 10-dimensional)
  return Array.from({ length: 10 }, () => Math.random());
}

/**
 * Identify missing information in the resume
 * @param {Object} parsedData - Structured resume data
 * @returns {Array<string>} - List of missing information
 */
function identifyMissingInfo(parsedData) {
  console.log('[MOCK] Identifying missing information');
  
  // Return a few mock missing items for testing
  return [
    'Work experience could be more detailed',
    'Consider adding more specific achievements',
    'GitHub profile link is missing'
  ];
}

module.exports = {
  extractTextFromResume,
  parseResumeText,
  generateResumeEmbedding,
  identifyMissingInfo,
};
