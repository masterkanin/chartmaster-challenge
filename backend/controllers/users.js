const User = require('../models/User');
const Progress = require('../models/Progress');
const Badge = require('../models/Badge');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user is requesting their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this user'
      });
    }
    
    // Fields to update
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email,
      profileImage: req.body.profileImage,
      bio: req.body.bio
    };
    
    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );
    
    user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user progress
// @route   GET /api/users/:id/progress
// @access  Private
exports.getUserProgress = async (req, res) => {
  try {
    // Check if user is requesting their own progress or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this user progress'
      });
    }
    
    const progress = await Progress.find({ user: req.params.id })
      .populate({
        path: 'challenge',
        select: 'title mode difficultyLevel',
        populate: {
          path: 'strategy',
          select: 'name'
        }
      })
      .sort({ lastAttemptAt: -1 });
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user badges
// @route   GET /api/users/:id/badges
// @access  Private
exports.getUserBadges = async (req, res) => {
  try {
    // Check if user is requesting their own badges or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this user badges'
      });
    }
    
    // Find all badges earned by the user
    const userBadges = await Badge.find({ 'earnedBy.user': req.params.id })
      .select('name description imageUrl earnedBy');
    
    res.status(200).json({
      success: true,
      count: userBadges.length,
      data: userBadges
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
