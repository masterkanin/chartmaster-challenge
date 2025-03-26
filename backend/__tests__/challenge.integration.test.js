const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Progress = require('../models/Progress');
const jwt = require('jsonwebtoken');

describe('Challenge and Progress API Integration Tests', () => {
  let testUser;
  let testAdmin;
  let testChallenge;
  let userToken;
  let adminToken;

  // Setup before tests
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chartmaster_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user
    testUser = new User({
      username: 'challengetester',
      email: 'challenge@test.com',
      password: 'password123',
      role: 'user'
    });

    await testUser.save();

    // Create an admin user
    testAdmin = new User({
      username: 'adminuser',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    await testAdmin.save();

    // Create a test challenge
    testChallenge = new Challenge({
      title: 'Test Challenge',
      description: 'Integration test challenge',
      mode: 'easy',
      difficultyLevel: 'beginner',
      strategy: 'order_block',
      chartData: {
        symbol: 'BTCUSD',
        timeframe: '1h',
        chartUrl: 'https://example.com/chart.png'
      },
      questions: [
        {
          question: 'What pattern is visible in this chart?',
          options: ['Order Block', 'Fair Value Gap', 'Liquidity Sweep', 'None of the above'],
          correctAnswer: 0
        }
      ],
      correctPatterns: [
        {
          type: 'rectangle',
          coordinates: { x1: 10, y1: 20, x2: 30, y2: 40 },
          label: 'Order Block'
        }
      ]
    });

    await testChallenge.save();

    // Generate tokens
    userToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'chartmastersecret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: testAdmin._id },
      process.env.JWT_SECRET || 'chartmastersecret',
      { expiresIn: '1h' }
    );
  });

  // Cleanup after tests
  afterAll(async () => {
    // Remove test data
    await User.findByIdAndDelete(testUser._id);
    await User.findByIdAndDelete(testAdmin._id);
    await Challenge.findByIdAndDelete(testChallenge._id);
    await Progress.deleteMany({ user: testUser._id });
    
    // Disconnect from database
    await mongoose.connection.close();
  });

  // Test challenge retrieval
  describe('GET /api/challenges', () => {
    it('should get all challenges', async () => {
      const res = await request(app)
        .get('/api/challenges')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get challenges by strategy', async () => {
      const res = await request(app)
        .get('/api/challenges?strategy=order_block')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      // All returned challenges should be of the order_block strategy
      res.body.data.forEach(challenge => {
        expect(challenge.strategy).toEqual('order_block');
      });
    });

    it('should get a single challenge by ID', async () => {
      const res = await request(app)
        .get(`/api/challenges/${testChallenge._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('_id', testChallenge._id.toString());
      expect(res.body.data).toHaveProperty('title', 'Test Challenge');
    });
  });

  // Test challenge submission
  describe('POST /api/challenges/:id/submit', () => {
    it('should submit a challenge solution and create progress record', async () => {
      const submission = {
        mode: 'easy',
        answers: [0], // Correct answer for the test question
        timeTaken: 45
      };

      const res = await request(app)
        .post(`/api/challenges/${testChallenge._id}/submit`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(submission);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('score');
      expect(res.body.data).toHaveProperty('accuracyPercentage');
      expect(res.body.data).toHaveProperty('xpGained');
      
      // Verify that a progress record was created
      const progress = await Progress.findOne({ 
        user: testUser._id,
        challenge: testChallenge._id
      });
      
      expect(progress).not.toBeNull();
      expect(progress.score).toBeGreaterThan(0);
    });
  });

  // Test admin challenge management
  describe('Admin Challenge Management', () => {
    it('should allow admin to create a new challenge', async () => {
      const newChallenge = {
        title: 'Admin Created Challenge',
        description: 'Created during integration testing',
        mode: 'hard',
        difficultyLevel: 'advanced',
        strategy: 'fair_value_gap',
        chartData: {
          symbol: 'EURUSD',
          timeframe: '4h',
          chartUrl: 'https://example.com/eurusd.png'
        },
        correctPatterns: [
          {
            type: 'rectangle',
            coordinates: { x1: 15, y1: 25, x2: 35, y2: 45 },
            label: 'FVG'
          }
        ]
      };

      const res = await request(app)
        .post('/api/admin/challenges')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newChallenge);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Admin Created Challenge');
      
      // Clean up the created challenge
      await Challenge.findByIdAndDelete(res.body.data._id);
    });

    it('should not allow regular user to create a challenge', async () => {
      const newChallenge = {
        title: 'User Created Challenge',
        description: 'Should not be allowed',
        mode: 'easy',
        difficultyLevel: 'beginner',
        strategy: 'order_block'
      };

      const res = await request(app)
        .post('/api/admin/challenges')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newChallenge);

      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  // Test user progress
  describe('GET /api/progress', () => {
    it('should get user progress', async () => {
      const res = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get progress for a specific strategy', async () => {
      const res = await request(app)
        .get('/api/progress?strategy=order_block')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      // All returned progress should be for order_block challenges
      res.body.data.forEach(progress => {
        expect(progress.challenge.strategy).toEqual('order_block');
      });
    });
  });
});
