const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  amenities: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  }
}, { timestamps: true });

// Required index
hotelSchema.index({ name: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
