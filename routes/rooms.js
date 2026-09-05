const express = require('express');
const router = express.Router();
const { createRoom, getRooms, getRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.route('/')
  .get(auth, authorize('admin'), getRooms)
  .post(
    auth, 
    authorize('admin'), 
    [
      body('roomTypeId').isMongoId().withMessage('Valid RoomType ID is required'),
      body('roomNumber').notEmpty().withMessage('Room number is required')
    ], 
    validate, 
    createRoom
  );

router.route('/:id')
  .get(auth, authorize('admin'), getRoom)
  .put(auth, authorize('admin'), updateRoom)
  .delete(auth, authorize('admin'), deleteRoom);

module.exports = router;
