const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  housekeepingStatus: {
    type: String,
    enum: ['clean', 'dirty', 'maintenance'],
    default: 'clean'
  }
}, { timestamps: true });

// Required index
roomSchema.index({ roomTypeId: 1 });

module.exports = mongoose.model('Room', roomSchema);
