const Booking =
  require('../models/Booking');

const Room =
  require('../models/Room');

const RoomType =
  require('../models/RoomType');


// Helper function
const getOverlappingDays = (
  bookingStart,
  bookingEnd,
  reportStart,
  reportEnd
) => {

  const start =
    new Date(
      Math.max(
        new Date(bookingStart),
        new Date(reportStart)
      )
    );

  const end =
    new Date(
      Math.min(
        new Date(bookingEnd),
        new Date(reportEnd)
      )
    );


  const difference =
    end - start;


  if (difference <= 0) {
    return 0;
  }


  return Math.ceil(
    difference /
    (1000 * 60 * 60 * 24)
  );

};



// @desc    Get hotel occupancy report
// @route   GET /api/reports/occupancy
// @access  Private/Admin
exports.getOccupancyReport =
async (req, res, next) => {

  try {

    const {
      hotelId,
      startDate,
      endDate
    } =
      req.query;


    if (
      !hotelId ||
      !startDate ||
      !endDate
    ) {

      return res.status(400).json({

        success: false,

        message:
          'hotelId, startDate and endDate are required'

      });

    }


    const reportStart =
      new Date(startDate);

    const reportEnd =
      new Date(endDate);


    if (
      reportStart >= reportEnd
    ) {

      return res.status(400).json({

        success: false,

        message:
          'endDate must be after startDate'

      });

    }


    // Get all room types
    const roomTypes =
      await RoomType.find({
        hotelId
      });


    const roomTypeIds =
      roomTypes.map(
        roomType =>
          roomType._id
      );


    // Get all rooms
    const totalRooms =
      await Room.countDocuments({

        roomTypeId:
          {
            $in:
              roomTypeIds
          }

      });


    // Get bookings overlapping
    // the selected date range

    const bookings =
      await Booking.find({

        hotelId,

        status:
          {
            $in: [
              'Reserved',
              'Confirmed',
              'Checked-in',
              'Checked-out'
            ]
          },

        checkInDate:
          {
            $lt:
              reportEnd
          },

        checkOutDate:
          {
            $gt:
              reportStart
          }

      });


    let occupiedRoomNights = 0;


    bookings.forEach(
      booking => {

        occupiedRoomNights +=
          getOverlappingDays(

            booking.checkInDate,

            booking.checkOutDate,

            reportStart,

            reportEnd

          );

      }
    );


    const totalDays =
      Math.ceil(
        (
          reportEnd -
          reportStart
        )
        /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    const availableRoomNights =
      totalRooms *
      totalDays;


    const occupancyRate =
      availableRoomNights > 0

        ?

        (
          occupiedRoomNights /
          availableRoomNights
        )
        *
        100

        :

        0;


    res.json({

      success: true,

      data: {

        hotelId,

        period: {

          startDate:
            reportStart,

          endDate:
            reportEnd

        },

        totalRooms,

        totalDays,

        availableRoomNights,

        occupiedRoomNights,

        occupancyRate:
          Number(
            occupancyRate.toFixed(2)
          ),

        totalBookings:
          bookings.length

      }

    });

  }

  catch (error) {

    next(error);

  }

};

// @desc    Get revenue report
// @route   GET /api/reports/revenue
// @access  Private/Admin
exports.getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate, hotelId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required'
      });
    }

    const reportStart = new Date(startDate);
    const reportEnd = new Date(endDate);

    if (reportStart >= reportEnd) {
      return res.status(400).json({
        success: false,
        message: 'endDate must be after startDate'
      });
    }

    const query = {
      status: {
        $in: ['Reserved', 'Confirmed', 'Checked-in', 'Checked-out']
      },
      checkInDate: { $lt: reportEnd },
      checkOutDate: { $gt: reportStart }
    };

    if (hotelId) {
      query.hotelId = hotelId;
    }

    const bookings = await Booking.find(query);

    const revenueByProperty = {};

    bookings.forEach(booking => {
      const hId = booking.hotelId.toString();
      if (!revenueByProperty[hId]) {
        revenueByProperty[hId] = {
          hotelId: hId,
          totalRevenue: 0,
          totalBookings: 0
        };
      }
      revenueByProperty[hId].totalRevenue += booking.totalAmount;
      revenueByProperty[hId].totalBookings += 1;
    });

    res.json({
      success: true,
      data: {
        period: {
          startDate: reportStart,
          endDate: reportEnd
        },
        revenuePerProperty: Object.values(revenueByProperty)
      }
    });

  } catch (error) {
    next(error);
  }
};