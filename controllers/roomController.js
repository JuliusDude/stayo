const Room = require('../models/Room');
const RoomType = require('../models/RoomType');

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
exports.createRoom = async (req, res, next) => {
  try {
    const { roomTypeId } = req.body;
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      res.status(404);
      throw new Error('RoomType not found');
    }

    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    const { roomTypeId } = req.query;
    const filter = roomTypeId ? { roomTypeId } : {};
    const rooms = await Room.find(filter).populate({
      path: 'roomTypeId',
      populate: { path: 'hotelId', select: 'name city' }
    });
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('roomTypeId');
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
