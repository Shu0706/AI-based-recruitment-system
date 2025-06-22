const mongoose = require('mongoose');
const User = require('./src/models/user.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-recruitment')
  .then(() => {
    console.log('Connected to MongoDB');
    return checkUsers();
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

async function checkUsers() {
  try {
    console.log('\n=== Database Verification ===');
    
    const users = await User.find({}).select('firstName lastName email role isActive createdAt');
    console.log(`\nTotal users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\nRegistered Users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Registered: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    } else {
      console.log('\nNo users found in database.');
    }
    
    // Test password hashing
    const testUser = users[0];
    if (testUser) {
      const userWithPassword = await User.findById(testUser._id).select('+password');
      console.log('Password Security Check:');
      console.log(`✅ Password is hashed: ${userWithPassword.password !== 'SecurePass123!'}`);
      console.log(`✅ Password length: ${userWithPassword.password.length} characters`);
      console.log(`✅ Contains bcrypt hash: ${userWithPassword.password.startsWith('$2')}`);
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}
