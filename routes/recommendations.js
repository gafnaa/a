const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
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

// Get user recommendations
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.recommendations || user.recommendations.length === 0) {
      return res.json({ success: true, recommendations: [], products: [] });
    }

    // Get top 3 recommended categories
    const topCategories = user.recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.category);

    // Get products for recommended categories
    const products = await Product.find({
      category: { $in: topCategories }
    }).limit(12);

    res.json({
      success: true,
      recommendations: user.recommendations,
      topCategories,
      products
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get related products for a product category
router.get('/related/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).limit(6);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

