const express =
  require('express');

const router =
  express.Router();

const auth =
  require('../middleware/auth');

const authorize =
  require('../middleware/role');

const {
  getOccupancyReport,
  getRevenueReport
} =
  require('../controllers/reportController');


router.get(

  '/occupancy',

  auth,

  authorize(['admin']),

  getOccupancyReport

);

router.get(
  '/revenue',
  auth,
  authorize(['admin']),
  getRevenueReport
);

module.exports =
  router;