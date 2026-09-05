const express = require('express');
const router = express.Router();
const { createRoomType, getRoomTypes, getRoomType, updateRoomType, deleteRoomType } = require('../controllers/roomTypeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.route('/')
  .get(getRoomTypes)
  .post(
    auth, 
    authorize('admin'), 
    [
      body('hotelId').isMongoId().withMessage('Valid Hotel ID is required'),
      body('name').notEmpty().withMessage('Room type name is required'),
      body('basePrice').isNumeric().withMessage('Base price must be a number'),
      body('totalRooms').isInt({ min: 0 }).withMessage('Total rooms must be a positive integer'),
      body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
    ], 
    validate, 
    createRoomType
  );

router.route('/:id')
  .get(getRoomType)
  .put(auth, authorize('admin'), updateRoomType)
  .delete(auth, authorize('admin'), deleteRoomType);

module.exports = router;
