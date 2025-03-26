const express = require('express');
const router = express.Router();
const { 
  getAdminUsers,
  getAdminStats,
  uploadChart
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), getAdminUsers);

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getAdminStats);

// @route   POST /api/admin/charts/upload
// @desc    Upload chart image
// @access  Private/Admin
router.post('/charts/upload', protect, authorize('admin'), uploadChart);

module.exports = router;
