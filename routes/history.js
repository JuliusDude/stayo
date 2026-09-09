const express = require('express');

const router = express.Router();

const auth =
  require('../middleware/auth');

const authorize =
  require('../middleware/role');

const {
  getMyBookingHistory
} =
  require('../controllers/historyController');


router.get(

  '/my-bookings',

  auth,

  authorize(['guest']),

  getMyBookingHistory

);


module.exports = router;