const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  interviewId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Interviews',
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

module.exports = TimeSlot;
