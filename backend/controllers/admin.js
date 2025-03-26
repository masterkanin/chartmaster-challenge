const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for chart uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = './public/uploads/charts';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `chart-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB max file size
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('chart');

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
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

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const challengeCount = await Challenge.countDocuments();
    const progressCount = await Progress.countDocuments();
    
    // Get mode distribution
    const modeDistribution = await Challenge.aggregate([
      {
        $group: {
          _id: '$mode',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get difficulty distribution
    const difficultyDistribution = await Challenge.aggregate([
      {
        $group: {
          _id: '$difficultyLevel',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get strategy distribution
    const strategyDistribution = await Challenge.aggregate([
      {
        $group: {
          _id: '$strategy',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent progress entries
    const recentProgress = await Progress.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: 'user',
        select: 'username'
      })
      .populate({
        path: 'challenge',
        select: 'title mode'
      });
    
    // Get average scores
    const averageScores = await Progress.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          averageAccuracy: { $avg: '$accuracyPercentage' },
          averageTimeTaken: { $avg: '$timeTaken' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          challenges: challengeCount,
          progressEntries: progressCount
        },
        distributions: {
          mode: modeDistribution,
          difficulty: difficultyDistribution,
          strategy: strategyDistribution
        },
        averages: averageScores.length > 0 ? averageScores[0] : {
          averageScore: 0,
          averageAccuracy: 0,
          averageTimeTaken: 0
        },
        recentProgress
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Upload chart image
// @route   POST /api/admin/charts/upload
// @access  Private/Admin
exports.uploadChart = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/charts/${req.file.filename}`
      }
    });
  });
};
