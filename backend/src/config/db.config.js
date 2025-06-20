// Mock database connection for development
const connectDB = async () => {
  try {
    console.log('Mock database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Export a mock sequelize object
const sequelize = {
  define: () => ({}),
  sync: () => Promise.resolve(),
  authenticate: () => Promise.resolve(),
  models: {}
};

module.exports = {
  connectDB,
  sequelize
};
