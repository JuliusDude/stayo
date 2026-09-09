const Room = require('../models/Room');

// @desc    Get rooms with housekeeping status
// @route   GET /api/housekeeping/rooms
// @access  Private/Staff/Admin
exports.getHousekeepingRooms = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.housekeepingStatus = status;
    }

    const rooms = await Room.find(filter)
      .populate({
        path: 'roomTypeId',
        populate: {
          path: 'hotelId',
          select: 'name city'
        }
      })
      .sort({ roomNumber: 1 });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Update housekeeping status
// @route   PUT /api/housekeeping/rooms/:id
// @access  Private/Staff/Admin
exports.updateHousekeepingStatus = async (req, res, next) => {
  try {

    const { housekeepingStatus } = req.body;

    const validStatuses = [
      'clean',
      'dirty',
      'maintenance'
    ];

    if (!validStatuses.includes(housekeepingStatus)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid housekeeping status. Use clean, dirty, or maintenance.'
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room.housekeepingStatus = housekeepingStatus;

    await room.save();

    res.json({
      success: true,
      message: 'Housekeeping status updated successfully',
      data: room
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get housekeeping summary
// @route   GET /api/housekeeping/summary
// @access  Private/Staff/Admin
exports.getHousekeepingSummary = async (req, res, next) => {
  try {

    const summary = await Room.aggregate([
      {
        $group: {
          _id: '$housekeepingStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      clean: 0,
      dirty: 0,
      maintenance: 0
    };

    summary.forEach((item) => {
      result[item._id] = item.count;
    });

    result.totalRooms =
      result.clean +
      result.dirty +
      result.maintenance;

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};