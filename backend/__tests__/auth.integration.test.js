const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Authentication API Integration Tests', () => {
  let testUser;
  let authToken;

  // Setup before tests
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chartmaster_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user
    testUser = new User({
      username: 'integrationtester',
      email: 'integration@test.com',
      password: 'password123'
    });

    await testUser.save();

    // Generate token for authenticated routes
    authToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'chartmastersecret',
      { expiresIn: '1h' }
    );
  });

  // Cleanup after tests
  afterAll(async () => {
    // Remove test user
    await User.findByIdAndDelete(testUser._id);
    
    // Disconnect from database
    await mongoose.connection.close();
  });

  // Test registration
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@user.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');

      // Clean up the created user
      const createdUser = await User.findOne({ email: 'new@user.com' });
      await User.findByIdAndDelete(createdUser._id);
    });

    it('should not register a user with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicateuser',
          email: 'integration@test.com', // Same as testUser
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });
  });

  // Test login
  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  // Test get current user
  describe('GET /api/auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('username', 'integrationtester');
      expect(res.body.data).toHaveProperty('email', 'integration@test.com');
    });

    it('should not access protected route without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Not authorized to access this route');
    });

    it('should not access protected route with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Not authorized to access this route');
    });
  });
});
