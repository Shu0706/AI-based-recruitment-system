const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Load Universal Sentence Encoder model
let model;
async function loadModel() {
  if (!model) {
    model = await use.load();
    console.log('Universal Sentence Encoder model loaded');
  }
  return model;
}

// Load model at startup
loadModel().catch(err => console.error('Failed to load USE model:', err));

/**
 * Parse resume document based on file type
 * @param {string} filePath - Path to the resume file
 * @param {string} fileType - Type of the file (pdf, docx, doc, txt)
 * @returns {Promise<string>} - Extracted text from the resume
 */
async function extractTextFromResume(filePath, fileType) {
  try {
    let text = '';
    
    switch (fileType.toLowerCase()) {
      case 'pdf':
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
        break;
        
      case 'docx':
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
        break;
        
      case 'doc':
        // For .doc files, you might need a different library or convert to docx first
        throw new Error('DOC format not supported directly. Convert to DOCX first.');
        
      case 'txt':
        text = fs.readFileSync(filePath, 'utf8');
        break;
        
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    throw error;
  }
}

/**
 * Parse resume text and extract structured information
 * @param {string} text - Extracted text from resume
 * @returns {Object} - Structured resume data
 */
async function parseResumeText(text) {
  try {
    // In a real implementation, you would use NLP models like BERT/SpaCy here
    // This is a simplified version using regex patterns
    
    // Basic structure for parsed data
    const parsedData = {
      personalInfo: {
        name: extractName(text),
        email: extractEmail(text),
        phone: extractPhone(text),
        address: extractAddress(text),
        linkedin: extractLinkedin(text),
        website: extractWebsite(text),
      },
      education: extractEducation(text),
      experience: extractExperience(text),
      skills: extractSkills(text),
      certifications: extractCertifications(text),
      languages: extractLanguages(text),
      projects: extractProjects(text),
    };
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing resume text:', error);
    throw error;
  }
}

/**
 * Generate embedding vector for the resume
 * @param {string} text - Resume text
 * @returns {Promise<Object>} - Vector embedding
 */
async function generateResumeEmbedding(text) {
  try {
    const model = await loadModel();
    const embeddings = await model.embed([text]);
    const embedding = await embeddings.array();
    return embedding[0]; // Return the first embedding (corresponding to our text)
  } catch (error) {
    console.error('Error generating resume embedding:', error);
    throw error;
  }
}

/**
 * Identify missing information in the resume
 * @param {Object} parsedData - Structured resume data
 * @returns {Array<string>} - List of missing information
 */
function identifyMissingInfo(parsedData) {
  const missingInfo = [];
  
  // Check personal information
  if (!parsedData.personalInfo.name) missingInfo.push('Name is missing');
  if (!parsedData.personalInfo.email) missingInfo.push('Email is missing');
  if (!parsedData.personalInfo.phone) missingInfo.push('Phone number is missing');
  
  // Check education
  if (!parsedData.education || parsedData.education.length === 0) {
    missingInfo.push('Education information is missing');
  } else {
    parsedData.education.forEach((edu, index) => {
      if (!edu.institution) missingInfo.push(`Institution name is missing in education #${index + 1}`);
      if (!edu.degree) missingInfo.push(`Degree is missing in education #${index + 1}`);
    });
  }
  
  // Check experience
  if (!parsedData.experience || parsedData.experience.length === 0) {
    missingInfo.push('Work experience information is missing');
  } else {
    parsedData.experience.forEach((exp, index) => {
      if (!exp.company) missingInfo.push(`Company name is missing in experience #${index + 1}`);
      if (!exp.position) missingInfo.push(`Position is missing in experience #${index + 1}`);
      if (!exp.description) missingInfo.push(`Description is missing in experience #${index + 1}`);
    });
  }
  
  // Check skills
  if (!parsedData.skills || parsedData.skills.length === 0) {
    missingInfo.push('Skills information is missing');
  }
  
  return missingInfo;
}

// Helper functions for text extraction (simplified examples)
function extractName(text) {
  // In a real implementation, use more sophisticated NER techniques
  const nameRegex = /^([A-Z][a-z]+ [A-Z][a-z]+)/m;
  const match = text.match(nameRegex);
  return match ? match[1] : '';
}

function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const phoneRegex = /\b(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
}

function extractAddress(text) {
  // Simplified - in real implementation use address parsing library
  return '';
}

function extractLinkedin(text) {
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/g;
  const match = text.match(linkedinRegex);
  return match ? 'https://www.' + match[0] : '';
}

function extractWebsite(text) {
  const websiteRegex = /https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+/g;
  const matches = text.match(websiteRegex);
  if (matches) {
    // Filter out LinkedIn URLs
    const websites = matches.filter(url => !url.includes('linkedin.com'));
    return websites.length > 0 ? websites[0] : '';
  }
  return '';
}

function extractEducation(text) {
  // Simplified - in real implementation use NER and relation extraction
  const education = [];
  
  // Look for common education keywords
  const eduKeywords = ['Bachelor', 'Master', 'PhD', 'BS', 'MS', 'B.A.', 'M.A.', 'B.S.', 'M.S.', 'MBA'];
  const eduSections = text.split(/Education|EDUCATION|Academic Background/);
  
  if (eduSections.length > 1) {
    const eduText = eduSections[1].split(/Experience|EXPERIENCE|Work|Employment/)[0];
    
    // Very simplified parsing - in real implementation use more sophisticated techniques
    const degrees = eduKeywords.filter(keyword => eduText.includes(keyword));
    
    if (degrees.length > 0) {
      education.push({
        institution: 'Extracted Institution', // Placeholder
        degree: degrees[0],
        field: 'Extracted Field', // Placeholder
        startDate: null,
        endDate: null,
        gpa: '',
      });
    }
  }
  
  return education;
}

function extractExperience(text) {
  // Simplified - in real implementation use NER and relation extraction
  const experience = [];
  
  // Look for common experience section indicators
  const expSections = text.split(/Experience|EXPERIENCE|Work History|WORK HISTORY|Employment/);
  
  if (expSections.length > 1) {
    const expText = expSections[1].split(/Education|EDUCATION|Skills|SKILLS|Projects|PROJECTS/)[0];
    
    // Very simplified parsing - in real implementation use more sophisticated techniques
    if (expText.length > 0) {
      experience.push({
        company: 'Extracted Company', // Placeholder
        position: 'Extracted Position', // Placeholder
        location: '',
        startDate: null,
        endDate: null,
        description: expText.trim().substring(0, 200) + '...',
      });
    }
  }
  
  return experience;
}

function extractSkills(text) {
  // Simplified - in real implementation use skill extraction models
  const skills = [];
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'React', 'Angular', 'Node.js',
    'AWS', 'Azure', 'Machine Learning', 'Data Analysis', 'Project Management',
    'Leadership', 'Communication', 'Problem Solving', 'Team Work'
  ];
  
  // Check for skills section
  const skillSections = text.split(/Skills|SKILLS|Technical Skills|TECHNICAL SKILLS|Competencies/);
  
  if (skillSections.length > 1) {
    const skillText = skillSections[1].split(/Experience|EXPERIENCE|Education|EDUCATION|Projects|PROJECTS/)[0];
    
    // Check for common skills in the skills section
    commonSkills.forEach(skill => {
      if (skillText.includes(skill) || text.includes(skill)) {
        skills.push({
          name: skill,
          level: '',
        });
      }
    });
  } else {
    // If no skills section, check entire text for common skills
    commonSkills.forEach(skill => {
      if (text.includes(skill)) {
        skills.push({
          name: skill,
          level: '',
        });
      }
    });
  }
  
  return skills;
}

function extractCertifications(text) {
  return [];
}

function extractLanguages(text) {
  return [];
}

function extractProjects(text) {
  return [];
}

module.exports = {
  extractTextFromResume,
  parseResumeText,
  generateResumeEmbedding,
  identifyMissingInfo,
};
