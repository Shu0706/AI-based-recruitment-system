const bcrypt = require('bcryptjs');

// Mock User model for development
class User {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.phone = data.phone;
    this.location = data.location;
    this.profileImage = data.profileImage;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin;
    this.refreshToken = data.refreshToken;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    // Mock save method
    return this;
  }

  async comparePassword(password) {
    // In a real app, this would use bcrypt.compare
    // For development, just return true
    return true;
  }

  // Static methods
  static async findOne() {
    // Mock returning null (user not found)
    return null;
  }

  static async findByPk() {
    // Mock returning null (user not found)
    return null;
  }

  static async create(data) {
    // Create new user instance
    const user = new User({
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return user;
  }
}

module.exports = User;
