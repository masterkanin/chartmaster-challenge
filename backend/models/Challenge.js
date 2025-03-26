const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  strategy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy',
    required: [true, 'Please specify a strategy']
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Please specify difficulty level']
  },
  mode: {
    type: String,
    enum: ['easy', 'hard'],
    required: [true, 'Please specify challenge mode']
  },
  chartUrl: {
    type: String,
    required: [true, 'Please provide a chart URL or image']
  },
  correctAnswerData: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide correct answer data']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
