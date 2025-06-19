// Import models
const User = require('./user.model');
const Job = require('./job.model');
const Application = require('./application.model');
const Interview = require('./interview.model');
const TimeSlot = require('./timeslot.model');

// Define associations
// User associations
User.hasMany(Job, { foreignKey: 'adminId', as: 'createdJobs' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
User.hasMany(Interview, { foreignKey: 'interviewerId', as: 'conductedInterviews' });
User.hasMany(TimeSlot, { foreignKey: 'adminId', as: 'timeSlots' });

// Job associations
Job.belongsTo(User, { foreignKey: 'adminId', as: 'creator' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

// Application associations
Application.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Application.hasMany(Interview, { foreignKey: 'applicationId', as: 'interviews' });

// Interview associations
Interview.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });
Interview.belongsTo(User, { foreignKey: 'interviewerId', as: 'interviewer' });
Interview.hasOne(TimeSlot, { foreignKey: 'interviewId', as: 'timeSlot' });

// TimeSlot associations
TimeSlot.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
TimeSlot.belongsTo(Interview, { foreignKey: 'interviewId', as: 'interview' });

module.exports = {
  User,
  Job,
  Application,
  Interview,
  TimeSlot,
};
