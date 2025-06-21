const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./src/models/user.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-recruitment');
    console.log('MongoDB Connected for viewing data');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// View all users
const viewUsers = async () => {
  try {
    const users = await User.find().select('-password');
    
    console.log(`\n📊 Total users in database: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('👥 Users:');
      console.log('=' .repeat(80));
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Last Login: ${user.lastLogin || 'Never'}`);
        console.log('-'.repeat(50));
      });
    } else {
      console.log('No users found in database.');
    }
    
  } catch (error) {
    console.error('Error viewing users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run viewer
const runViewer = async () => {
  await connectDB();
  await viewUsers();
};

runViewer();
