const express = require('express');
const router = express.Router();
const { 
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge
} = require('../controllers/challenges');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', getChallenges);

// @route   GET /api/challenges/:id
// @desc    Get challenge by ID
// @access  Public
router.get('/:id', getChallenge);

// @route   POST /api/challenges
// @desc    Create a new challenge
// @access  Private/Admin
router.post('/', protect, authorize('admin'), createChallenge);

// @route   PUT /api/challenges/:id
// @desc    Update challenge
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateChallenge);

// @route   DELETE /api/challenges/:id
// @desc    Delete challenge
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteChallenge);

module.exports = router;
