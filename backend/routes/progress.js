const express = require('express');
const router = express.Router();
const { 
  createProgressEntry,
  getLeaderboard,
  getStrategyLeaderboard
} = require('../controllers/progress');
const { protect } = require('../middleware/auth');

// @route   POST /api/progress
// @desc    Create a new progress entry
// @access  Private
router.post('/', protect, createProgressEntry);

// @route   GET /api/progress/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/progress/leaderboard/:strategyId
// @desc    Get leaderboard for a specific strategy
// @access  Public
router.get('/leaderboard/:strategyId', getStrategyLeaderboard);

module.exports = router;
