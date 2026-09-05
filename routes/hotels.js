const express = require('express');
const router = express.Router();
const { createHotel, getHotels, getHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.route('/')
  .get(getHotels)
  .post(
    auth, 
    authorize('admin'), 
    [
      body('name').notEmpty().withMessage('Hotel name is required'),
      body('city').notEmpty().withMessage('City is required')
    ], 
    validate, 
    createHotel
  );

router.route('/:id')
  .get(getHotel)
  .put(auth, authorize('admin'), updateHotel)
  .delete(auth, authorize('admin'), deleteHotel);

module.exports = router;
