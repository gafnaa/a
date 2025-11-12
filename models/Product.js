const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['data', 'voice', 'sms', 'vod', 'bundle']
  },
  price: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  dataAllowance: {
    type: String,
    default: 'N/A'
  },
  validity: {
    type: String,
    default: '30 days'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);

