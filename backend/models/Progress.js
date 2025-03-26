const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a user']
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'Please specify a challenge']
  },
  completed: {
    type: Boolean,
    default: true
  },
  score: {
    type: Number,
    required: [true, 'Please provide a score']
  },
  accuracyPercentage: {
    type: Number,
    required: [true, 'Please provide accuracy percentage']
  },
  timeTaken: {
    type: Number,
    required: [true, 'Please provide time taken in seconds']
  },
  attemptCount: {
    type: Number,
    default: 1
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate progress entries
ProgressSchema.index({ user: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
