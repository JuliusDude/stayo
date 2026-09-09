const Booking = require('../models/Booking');


// @desc    Get logged-in guest booking history
// @route   GET /api/history/my-bookings
// @access  Private/Guest
exports.getMyBookingHistory = async (req, res, next) => {

  try {

    const bookings =
      await Booking.find({
        guestId: req.user.userId
      })

      .populate(
        'hotelId',
        'name city'
      )

      .populate(
        'roomTypeId',
        'name basePrice'
      )

      .populate(
        'roomId',
        'roomNumber'
      )

      .sort({
        createdAt: -1
      });


    res.json({

      success: true,

      count:
        bookings.length,

      data:
        bookings

    });

  }

  catch (error) {

    next(error);

  }

};