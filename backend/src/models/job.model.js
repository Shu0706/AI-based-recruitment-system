const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  minSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  education: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  parsedData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

module.exports = Job;
