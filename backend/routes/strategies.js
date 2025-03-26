const express = require('express');
const router = express.Router();
const { 
  getStrategies,
  getStrategy,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  getStrategyWithChallenges
} = require('../controllers/strategies');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/strategies
// @desc    Get all strategies
// @access  Public
router.get('/', getStrategies);

// @route   GET /api/strategies/:id
// @desc    Get strategy by ID
// @access  Public
router.get('/:id', getStrategy);

// @route   POST /api/strategies
// @desc    Create a new strategy
// @access  Private/Admin
router.post('/', protect, authorize('admin'), createStrategy);

// @route   PUT /api/strategies/:id
// @desc    Update strategy
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateStrategy);

// @route   DELETE /api/strategies/:id
// @desc    Delete strategy
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteStrategy);

// @route   GET /api/strategies/:id/challenges
// @desc    Get strategy with all its challenges
// @access  Public
router.get('/:id/challenges', getStrategyWithChallenges);

module.exports = router;
