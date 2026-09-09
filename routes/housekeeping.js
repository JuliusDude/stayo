const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const {
  getHousekeepingRooms,
  updateHousekeepingStatus,
  getHousekeepingSummary
} = require('../controllers/housekeepingController');


// Get summary
router.get(
  '/summary',
  auth,
  authorize(['staff', 'admin']),
  getHousekeepingSummary
);


// Get all rooms with housekeeping status
router.get(
  '/rooms',
  auth,
  authorize(['staff', 'admin']),
  getHousekeepingRooms
);


// Update room housekeeping status
router.put(
  '/rooms/:id',
  auth,
  authorize(['staff', 'admin']),
  updateHousekeepingStatus
);


module.exports = router;