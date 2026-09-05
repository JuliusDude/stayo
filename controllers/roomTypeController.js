const RoomType = require('../models/RoomType');
const Hotel = require('../models/Hotel');

// @desc    Create a room type
// @route   POST /api/room-types
// @access  Private/Admin
exports.createRoomType = async (req, res, next) => {
  try {
    const { hotelId } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const roomType = await RoomType.create(req.body);
    res.status(201).json({ success: true, data: roomType });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all room types
// @route   GET /api/room-types
// @access  Public
exports.getRoomTypes = async (req, res, next) => {
  try {
    const { hotelId } = req.query;
    const filter = hotelId ? { hotelId } : {};
    const roomTypes = await RoomType.find(filter).populate('hotelId', 'name city');
    res.json({ success: true, data: roomTypes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room type
// @route   GET /api/room-types/:id
// @access  Public
exports.getRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id).populate('hotelId', 'name city');
    if (!roomType) {
      res.status(404);
      throw new Error('RoomType not found');
    }
    res.json({ success: true, data: roomType });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room type
// @route   PUT /api/room-types/:id
// @access  Private/Admin
exports.updateRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!roomType) {
      res.status(404);
      throw new Error('RoomType not found');
    }
    res.json({ success: true, data: roomType });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room type
// @route   DELETE /api/room-types/:id
// @access  Private/Admin
exports.deleteRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if (!roomType) {
      res.status(404);
      throw new Error('RoomType not found');
    }
    res.json({ success: true, message: 'RoomType deleted successfully' });
  } catch (error) {
    next(error);
  }
};
