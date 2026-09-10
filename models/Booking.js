const mongoose = require('mongoose');

// Extended by Member 2 (Sprint 2): added guestId, hotelId, roomTypeId, totalAmount,
// actual check-in/out timestamps, and cancellation info. roomId/checkInDate/checkOutDate/status
// are unchanged so Member 1's availability search keeps working.
const bookingSchema = new mongoose.Schema({
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true
  },
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
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  taxes: {
    type: Number
  },
  addOns: {
    type: Number
  },
  actualCheckInAt: {
    type: Date
  },
  actualCheckOutAt: {
    type: Date
  },
  cancellation: {
    cancelledAt: Date,
    reason: String,
    refundAmount: Number
  }
}, { timestamps: true });

// Index for efficient availability checks (Member 1)
bookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });
// Index for guest booking history (Member 3) and ownership checks (Member 2)
bookingSchema.index({ guestId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
