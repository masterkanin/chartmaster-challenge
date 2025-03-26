const mongoose = require('mongoose');

const StrategySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a strategy name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Strategy name cannot be more than 100 characters']
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
  imageUrl: {
    type: String,
    default: 'default-strategy.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Strategy', StrategySchema);
