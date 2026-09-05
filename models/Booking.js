const mongoose = require('mongoose');

// Minimal Booking schema to support availability search logic for Member 1
const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Reserved', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'],
    default: 'Reserved'
  }
}, { timestamps: true });

// Index for efficient availability checks
bookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
