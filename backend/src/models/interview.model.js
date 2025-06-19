const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Applications',
      key: 'id',
    },
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
    defaultValue: 60,
  },
  type: {
    type: DataTypes.ENUM('phone', 'video', 'in-person', 'technical', 'hr'),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interviewerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'),
    defaultValue: 'scheduled',
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  calendarEventId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Interview;
