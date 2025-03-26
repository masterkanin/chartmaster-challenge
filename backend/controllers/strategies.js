const Strategy = require('../models/Strategy');
const Challenge = require('../models/Challenge');

// @desc    Get all strategies
// @route   GET /api/strategies
// @access  Public
exports.getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find();
    
    res.status(200).json({
      success: true,
      count: strategies.length,
      data: strategies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single strategy
// @route   GET /api/strategies/:id
// @access  Public
exports.getStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);
    
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: strategy
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new strategy
// @route   POST /api/strategies
// @access  Private/Admin
exports.createStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.create(req.body);
    
    res.status(201).json({
      success: true,
      data: strategy
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

// @desc    Update strategy
// @route   PUT /api/strategies/:id
// @access  Private/Admin
exports.updateStrategy = async (req, res) => {
  try {
    let strategy = await Strategy.findById(req.params.id);
    
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }
    
    strategy = await Strategy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: strategy
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

// @desc    Delete strategy
// @route   DELETE /api/strategies/:id
// @access  Private/Admin
exports.deleteStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);
    
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }
    
    // Check if there are challenges associated with this strategy
    const challengeCount = await Challenge.countDocuments({ strategy: req.params.id });
    
    if (challengeCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete strategy with ${challengeCount} associated challenges`
      });
    }
    
    await strategy.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get strategy with all its challenges
// @route   GET /api/strategies/:id/challenges
// @access  Public
exports.getStrategyWithChallenges = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);
    
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }
    
    const challenges = await Challenge.find({ strategy: req.params.id })
      .sort({ difficultyLevel: 1 });
    
    res.status(200).json({
      success: true,
      data: {
        strategy,
        challenges
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
