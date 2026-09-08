const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  cancelBooking
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.route('/')
  .get(auth, authorize(['staff', 'admin']), getBookings)
  .post(
    auth,
    authorize(['guest']),
    [
      body('roomTypeId').isMongoId().withMessage('Valid roomTypeId is required'),
      body('checkInDate').isISO8601().withMessage('Valid checkInDate is required'),
      body('checkOutDate').isISO8601().withMessage('Valid checkOutDate is required')
    ],
    validate,
    createBooking
  );

router.route('/:id')
  .get(auth, getBooking);

router.put('/:id/confirm', auth, authorize(['staff', 'admin']), confirmBooking);
router.put('/:id/checkin', auth, authorize(['staff', 'admin']), checkInBooking);
router.put('/:id/checkout', auth, authorize(['staff', 'admin']), checkOutBooking);
router.put(
  '/:id/cancel',
  auth,
  [body('reason').optional().isString()],
  validate,
  cancelBooking
);

module.exports = router;
