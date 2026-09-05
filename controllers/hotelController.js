const Hotel = require('../models/Hotel');

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.json({ success: true, data: hotels });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }
    res.json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }
    res.json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    next(error);
  }
};
