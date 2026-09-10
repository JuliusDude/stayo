const Booking = require('../models/Booking');


// @desc    Generate invoice summary
// @route   GET /api/invoices/:bookingId
// @access  Private
exports.generateInvoice = async (req, res, next) => {

  try {

    const booking =
      await Booking.findById(
        req.params.bookingId
      )

      .populate(
        'guestId',
        'name email'
      )

      .populate(
        'hotelId',
        'name city'
      )

      .populate(
        'roomTypeId',
        'name'
      )

      .populate(
        'roomId',
        'roomNumber'
      );


    if (!booking) {

      return res.status(404).json({

        success: false,

        message:
          'Booking not found'

      });

    }


    const isOwner =
      booking.guestId._id.toString() ===
      req.user.userId;


    const isStaffOrAdmin =
      ['staff', 'admin']
        .includes(req.user.role);


    if (
      !isOwner &&
      !isStaffOrAdmin
    ) {

      return res.status(403).json({

        success: false,

        message:
          'You do not have permission to view this invoice'

      });

    }


    const totalAmount = booking.totalAmount || 0;
    const taxes = booking.taxes !== undefined ? booking.taxes : totalAmount * 0.10;
    const addOns = booking.addOns || 0;
    const refundAmount =
      booking.cancellation?.refundAmount || 0;


    const invoice = {

      invoiceNumber:
        `INV-${booking._id
          .toString()
          .slice(-6)
          .toUpperCase()}`,

      generatedAt:
        new Date(),

      bookingId:
        booking._id,

      guest: {
        name:
          booking.guestId.name,

        email:
          booking.guestId.email
      },

      hotel: {
        name:
          booking.hotelId?.name,

        city:
          booking.hotelId?.city
      },

      room: {
        type:
          booking.roomTypeId?.name,

        roomNumber:
          booking.roomId?.roomNumber
      },

      stay: {

        checkIn:
          booking.checkInDate,

        checkOut:
          booking.checkOutDate

      },

      bookingStatus:
        booking.status,

      totalAmount:
        totalAmount,

      taxes:
        taxes,

      addOns:
        addOns,

      refundAmount:
        refundAmount,

      finalAmount:
        totalAmount + taxes + addOns - refundAmount

    };


    res.json({

      success: true,

      data:
        invoice

    });

  }

  catch (error) {

    next(error);

  }

};