const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc    Create new progress entry
// @route   POST /api/progress
// @access  Private
exports.createProgressEntry = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check if challenge exists
    const challenge = await Challenge.findById(req.body.challenge);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    // Check if user has already completed this challenge
    const existingProgress = await Progress.findOne({
      user: req.user.id,
      challenge: req.body.challenge
    });
    
    if (existingProgress) {
      // Update existing progress if score is better
      if (req.body.score > existingProgress.score) {
        existingProgress.score = req.body.score;
        existingProgress.accuracyPercentage = req.body.accuracyPercentage;
        existingProgress.timeTaken = req.body.timeTaken;
        existingProgress.attemptCount = existingProgress.attemptCount + 1;
        existingProgress.lastAttemptAt = Date.now();
        
        await existingProgress.save();
        
        return res.status(200).json({
          success: true,
          data: existingProgress
        });
      } else {
        // Just update attempt count and time
        existingProgress.attemptCount = existingProgress.attemptCount + 1;
        existingProgress.lastAttemptAt = Date.now();
        
        await existingProgress.save();
        
        return res.status(200).json({
          success: true,
          data: existingProgress,
          message: 'Progress updated but score not improved'
        });
      }
    }
    
    // Create new progress entry
    const progress = await Progress.create(req.body);
    
    // Update user XP
    const user = await User.findById(req.user.id);
    user.xpPoints += Math.floor(req.body.score / 10);
    
    // Calculate level based on XP
    user.level = Math.floor(user.xpPoints / 100) + 1;
    
    await user.save();
    
    res.status(201).json({
      success: true,
      data: progress,
      user: {
        xpPoints: user.xpPoints,
        level: user.level
      }
    });
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get global leaderboard
// @route   GET /api/progress/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    // Aggregate to get total score and average accuracy for each user
    const leaderboard = await Progress.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          averageAccuracy: { $avg: '$accuracyPercentage' },
          challengesCompleted: { $sum: 1 }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: 50
      }
    ]);
    
    // Populate user details
    const populatedLeaderboard = await User.populate(leaderboard, {
      path: '_id',
      select: 'username profileImage level xpPoints'
    });
    
    // Format the response
    const formattedLeaderboard = populatedLeaderboard.map(entry => ({
      user: entry._id,
      username: entry._id.username,
      profileImage: entry._id.profileImage,
      level: entry._id.level,
      xpPoints: entry._id.xpPoints,
      score: entry.totalScore,
      accuracy: Math.round(entry.averageAccuracy * 10) / 10,
      challengesCompleted: entry.challengesCompleted
    }));
    
    res.status(200).json({
      success: true,
      count: formattedLeaderboard.length,
      data: formattedLeaderboard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get leaderboard for a specific strategy
// @route   GET /api/progress/leaderboard/:strategyId
// @access  Public
exports.getStrategyLeaderboard = async (req, res) => {
  try {
    // Get all challenges for the strategy
    const challenges = await Challenge.find({ strategy: req.params.strategyId });
    
    if (challenges.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No challenges found for this strategy'
      });
    }
    
    const challengeIds = challenges.map(challenge => challenge._id);
    
    // Aggregate to get total score and average accuracy for each user for this strategy
    const leaderboard = await Progress.aggregate([
      {
        $match: {
          challenge: { $in: challengeIds }
        }
      },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          averageAccuracy: { $avg: '$accuracyPercentage' },
          challengesCompleted: { $sum: 1 }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: 50
      }
    ]);
    
    // Populate user details
    const populatedLeaderboard = await User.populate(leaderboard, {
      path: '_id',
      select: 'username profileImage level xpPoints'
    });
    
    // Format the response
    const formattedLeaderboard = populatedLeaderboard.map(entry => ({
      user: entry._id,
      username: entry._id.username,
      profileImage: entry._id.profileImage,
      level: entry._id.level,
      xpPoints: entry._id.xpPoints,
      score: entry.totalScore,
      accuracy: Math.round(entry.averageAccuracy * 10) / 10,
      challengesCompleted: entry.challengesCompleted
    }));
    
    res.status(200).json({
      success: true,
      count: formattedLeaderboard.length,
      data: formattedLeaderboard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
