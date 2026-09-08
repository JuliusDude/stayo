const mongoose = require('mongoose');

// Member 2 (Sprint 2): Dynamic Pricing Rules module
const pricingRuleSchema = new mongoose.Schema({
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true
  },
  season: {
    type: String,
    required: true,
    trim: true // e.g. "peak", "off-peak", "weekend"
  },
  multiplier: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Required index - speeds up "fetch pricing rules for a room type" queries
pricingRuleSchema.index({ roomTypeId: 1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
