const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a badge name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Badge name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide a badge image']
  },
  requirementType: {
    type: String,
    enum: ['challenge_completion', 'score_threshold', 'accuracy_threshold', 'time_threshold', 'strategy_mastery'],
    required: [true, 'Please specify requirement type']
  },
  requirementValue: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide requirement value']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', BadgeSchema);
