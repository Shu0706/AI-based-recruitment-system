const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
  resumeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('applied', 'screening', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'),
    defaultValue: 'applied',
  },
  matchScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  matchDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = Application;
