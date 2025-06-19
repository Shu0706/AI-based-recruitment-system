const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'doc', 'txt'],
  },
  fileSize: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  parsedData: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      website: String,
    },
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      gpa: String,
    }],
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }],
    skills: [{
      name: String,
      level: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiryDate: Date,
    }],
    languages: [{
      name: String,
      proficiency: String,
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      url: String,
    }],
  },
  vectorEmbedding: {
    type: Object,
    default: null,
  },
  missingInfo: {
    type: [String],
    default: [],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create indexes for faster searching
ResumeSchema.index({ 'parsedData.skills.name': 1 });
ResumeSchema.index({ 'parsedData.education.field': 1 });
ResumeSchema.index({ 'parsedData.experience.company': 1 });

const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;
