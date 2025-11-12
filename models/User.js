const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  questionnaireData: {
    internetUsage: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high']
    },
    streamingHabits: {
      type: String,
      enum: ['none', 'occasional', 'frequent', 'daily']
    },
    dataConsumption: {
      type: String,
      enum: ['minimal', 'moderate', 'heavy', 'extreme']
    },
    voiceUsage: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    smsUsage: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    vodInterest: {
      type: Boolean,
      default: false
    },
    budget: {
      type: String,
      enum: ['budget', 'mid-range', 'premium']
    }
  },
  recommendations: [{
    category: String,
    score: Number,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

