const express =
  require('express');

const router =
  express.Router();

const auth =
  require('../middleware/auth');

const authorize =
  require('../middleware/role');

const {
  getOccupancyReport
} =
  require('../controllers/reportController');


router.get(

  '/occupancy',

  auth,

  authorize(['admin']),

  getOccupancyReport

);


module.exports =
  router;