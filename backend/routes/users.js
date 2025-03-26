const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  updateUser, 
  getUserProgress, 
  getUserBadges 
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, updateUser);

// @route   GET /api/users/:id/progress
// @desc    Get user progress
// @access  Private
router.get('/:id/progress', protect, getUserProgress);

// @route   GET /api/users/:id/badges
// @desc    Get user badges
// @access  Private
router.get('/:id/badges', protect, getUserBadges);

module.exports = router;
