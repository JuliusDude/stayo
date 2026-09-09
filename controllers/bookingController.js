const Booking = require('../models/Booking');
const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const PricingRule = require('../models/PricingRule');
const { calculateBookingPrice } = require('../utils/pricingCalculator');
const { calculateRefund } = require('../utils/refundCalculator');

// Small helper so every thrown error carries a specific errorCode instead of
// falling through to the generic "SERVER_ERROR" default in errorHandler.js
const fail = (res, statusCode, message, errorCode) => {
  res.status(statusCode);
  const error = new Error(message);
  error.errorCode = errorCode;
  throw error;
};

// Valid status transitions - enforced so this is a real workflow engine,
// not a plain CRUD endpoint that lets any status jump to any other.
const STATUS_TRANSITIONS = {
  Reserved: ['Confirmed', 'Cancelled'],
  Confirmed: ['Checked-in', 'Cancelled'],
  'Checked-in': ['Checked-out'],
  'Checked-out': [],
  Cancelled: []
};

// @desc    Create a reservation (auto-assigns an available room of the requested type)
// @route   POST /api/bookings
// @access  Private/Guest
exports.createBooking = async (req, res, next) => {
  try {
    const { roomTypeId, checkInDate, checkOutDate } = req.body;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      fail(res, 400, 'Check-out date must be after check-in date', 'INVALID_DATE_RANGE');
    }

    if (checkIn < new Date().setHours(0, 0, 0, 0)) {
      fail(res, 400, 'Check-in date cannot be in the past', 'INVALID_DATE_RANGE');
    }

    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      fail(res, 404, 'RoomType not found', 'NOT_FOUND');
    }

    // Find rooms of this type, then find ones with no overlapping active booking
    // Overlap rule (same as Member 1's availability search):
    // (Booking.checkIn < RequestedCheckOut) AND (Booking.checkOut > RequestedCheckIn)
    const rooms = await Room.find({ roomTypeId });
    const roomIds = rooms.map((r) => r._id);

    const overlappingBookings = await Booking.find({
      roomId: { $in: roomIds },
      status: { $in: ['Reserved', 'Confirmed', 'Checked-in'] },
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } }
      ]
    });
    const bookedRoomIds = overlappingBookings.map((b) => b.roomId.toString());

    const availableRoom = rooms.find((r) => !bookedRoomIds.includes(r._id.toString()));
    if (!availableRoom) {
      fail(res, 409, 'No rooms of this type are available for the selected dates', 'ROOM_UNAVAILABLE');
    }

    // Dynamic Pricing: apply any active pricing rules for this room type
    const pricingRules = await PricingRule.find({ roomTypeId });
    const { totalAmount } = calculateBookingPrice(
      roomType.basePrice,
      checkIn,
      checkOut,
      pricingRules
    );

    const booking = await Booking.create({
      guestId: req.user.userId,
      hotelId: roomType.hotelId,
      roomTypeId,
      roomId: availableRoom._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount,
      status: 'Reserved'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (optionally filter by status/hotelId)
// @route   GET /api/bookings
// @access  Private/Staff/Admin
exports.getBookings = async (req, res, next) => {
  try {
    const { status, hotelId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (hotelId) filter.hotelId = hotelId;

    const bookings = await Booking.find(filter)
      .populate('guestId', 'name email')
      .populate('roomTypeId', 'name basePrice')
      .populate('roomId', 'roomNumber')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (owner guest, or staff/admin)
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guestId', 'name email')
      .populate('roomTypeId', 'name basePrice')
      .populate('roomId', 'roomNumber');

    if (!booking) {
      fail(res, 404, 'Booking not found', 'NOT_FOUND');
    }

    const isOwner = booking.guestId._id.toString() === req.user.userId;
    const isStaffOrAdmin = ['staff', 'admin'].includes(req.user.role);
    if (!isOwner && !isStaffOrAdmin) {
      fail(res, 403, 'Forbidden. You do not have access to this booking.', 'FORBIDDEN');
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// Shared helper for every status-changing endpoint below: loads the booking,
// checks it exists, and validates the transition against STATUS_TRANSITIONS.
const applyStatusTransition = async (bookingId, nextStatus, res) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    fail(res, 404, 'Booking not found', 'NOT_FOUND');
  }

  const allowedNext = STATUS_TRANSITIONS[booking.status] || [];
  if (!allowedNext.includes(nextStatus)) {
    fail(
      res,
      409,
      `Invalid status transition: cannot move from '${booking.status}' to '${nextStatus}'`,
      'INVALID_STATUS_TRANSITION'
    );
  }

  return booking;
};

// @desc    Confirm a reservation
// @route   PUT /api/bookings/:id/confirm
// @access  Private/Staff/Admin
exports.confirmBooking = async (req, res, next) => {
  try {
    const booking = await applyStatusTransition(req.params.id, 'Confirmed', res);
    booking.status = 'Confirmed';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Staff check-in action
// @route   PUT /api/bookings/:id/checkin
// @access  Private/Staff
exports.checkInBooking = async (req, res, next) => {
  try {
    const booking = await applyStatusTransition(req.params.id, 'Checked-in', res);
    booking.status = 'Checked-in';
    booking.actualCheckInAt = new Date();
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Staff check-out action
// @route   PUT /api/bookings/:id/checkout
// @access  Private/Staff
exports.checkOutBooking = async (req, res, next) => {
  try {
    const booking = await applyStatusTransition(req.params.id, 'Checked-out', res);
    booking.status = 'Checked-out';
    booking.actualCheckOutAt = new Date();
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a reservation
// @route   PUT /api/bookings/:id/cancel
// @access  Private (owner guest, or staff/admin)
// @note    Basic status change only. Refund-amount calculation based on
//          proximity to check-in is owned by Member 3's Cancellation &
//          Refund Policy Engine module - refundAmount is left for them to set.
exports.cancelBooking = async (req, res, next) => {
  try {

    const existing =
      await Booking.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }


    const isOwner =
      existing.guestId.toString() ===
      req.user.userId;

    const isStaffOrAdmin =
      ['staff', 'admin'].includes(req.user.role);


    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden. You do not have access to this booking.'
      });
    }


    const booking =
      await applyStatusTransition(
        req.params.id,
        'Cancelled',
        res
      );


    // Calculate refund
    const refundDetails =
      calculateRefund(
        booking.totalAmount,
        booking.checkInDate,
        new Date()
      );


    booking.status = 'Cancelled';


    booking.cancellation = {
      cancelledAt: new Date(),

      reason:
        req.body.reason ||
        'Not specified',

      refundAmount:
        refundDetails.refundAmount
    };


    await booking.save();


    res.json({
      success: true,

      message:
        'Booking cancelled successfully',

      refund: refundDetails,

      data: booking
    });

  } catch (error) {
    next(error);
  }
};

