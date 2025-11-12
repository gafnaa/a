const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Submit questionnaire
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const questionnaireData = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.questionnaireData = questionnaireData;
    user.updatedAt = new Date();
    await user.save();

    // Generate recommendations based on questionnaire
    const recommendations = generateRecommendations(questionnaireData);
    user.recommendations = recommendations;
    await user.save();

    res.json({
      success: true,
      message: 'Questionnaire submitted successfully',
      recommendations
    });
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    res.status(500).json({ error: 'Server error during questionnaire submission' });
  }
});

// Get questionnaire data
router.get('/data', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      questionnaireData: user.questionnaireData,
      recommendations: user.recommendations
    });
  } catch (error) {
    console.error('Get questionnaire error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Simple recommendation logic based on questionnaire
function generateRecommendations(data) {
  const recommendations = [];
  let score = 0;

  // Data category scoring
  if (data.dataConsumption === 'extreme' || data.dataConsumption === 'heavy') {
    score = 0.9;
  } else if (data.dataConsumption === 'moderate') {
    score = 0.7;
  } else {
    score = 0.5;
  }
  recommendations.push({ category: 'data', score });

  // Voice category scoring
  if (data.voiceUsage === 'high') {
    score = 0.8;
  } else if (data.voiceUsage === 'medium') {
    score = 0.6;
  } else {
    score = 0.4;
  }
  recommendations.push({ category: 'voice', score });

  // SMS category scoring
  if (data.smsUsage === 'high') {
    score = 0.7;
  } else if (data.smsUsage === 'medium') {
    score = 0.5;
  } else {
    score = 0.3;
  }
  recommendations.push({ category: 'sms', score });

  // VOD category scoring
  if (data.vodInterest) {
    score = data.streamingHabits === 'daily' ? 0.9 : 
            data.streamingHabits === 'frequent' ? 0.8 : 0.6;
  } else {
    score = 0.2;
  }
  recommendations.push({ category: 'vod', score });

  // Bundle category scoring (combination of multiple needs)
  const bundleScore = (recommendations[0].score + recommendations[1].score + 
                      recommendations[2].score) / 3;
  recommendations.push({ category: 'bundle', score: bundleScore });

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}

module.exports = router;

