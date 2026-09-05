const RoomType = require('../models/RoomType');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

// @desc    Search availability
// @route   GET /api/availability/search
// @access  Public
exports.searchAvailability = async (req, res, next) => {
  try {
    const { hotelId, checkInDate, checkOutDate, guests } = req.query;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numGuests = parseInt(guests, 10);

    if (checkIn >= checkOut) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    // Find all room types for the hotel that can accommodate the guests
    const roomTypes = await RoomType.find({
      hotelId: hotelId,
      capacity: { $gte: numGuests }
    });

    if (!roomTypes.length) {
      return res.json({ success: true, data: [] }); // No room types big enough
    }

    const roomTypeIds = roomTypes.map(rt => rt._id);

    // Find all rooms that belong to these room types
    const rooms = await Room.find({ roomTypeId: { $in: roomTypeIds } });
    const roomIds = rooms.map(r => r._id);

    // Find overlapping bookings for these rooms
    // A booking overlaps if (Booking.checkIn < RequestedCheckOut) AND (Booking.checkOut > RequestedCheckIn)
    const overlappingBookings = await Booking.find({
      roomId: { $in: roomIds },
      status: { $in: ['Reserved', 'Confirmed', 'Checked-in'] },
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } }
      ]
    });

    const bookedRoomIds = overlappingBookings.map(b => b.roomId.toString());

    // Filter available rooms
    const availableRooms = rooms.filter(r => !bookedRoomIds.includes(r._id.toString()));

    // Group available rooms by RoomType
    const availableRoomTypesCount = {};
    availableRooms.forEach(room => {
      const typeId = room.roomTypeId.toString();
      availableRoomTypesCount[typeId] = (availableRoomTypesCount[typeId] || 0) + 1;
    });

    // Construct response
    const results = roomTypes.map(rt => {
      const availableCount = availableRoomTypesCount[rt._id.toString()] || 0;
      return {
        roomType: rt,
        availableRoomsCount: availableCount,
        isAvailable: availableCount > 0
      };
    }).filter(rt => rt.isAvailable); // optionally filter out ones with 0 available

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    next(error);
  }
};
