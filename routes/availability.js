const express = require('express');
const router = express.Router();
const { searchAvailability } = require('../controllers/availabilityController');
const validate = require('../middleware/validate');
const { query } = require('express-validator');

// Using /search as per the prompt requirement GET /api/hotels/search (though putting it under availability is cleaner, or we can mount it under hotels in server.js)
// But prompt asks for GET /api/hotels/search, let's map it there in server.js or keep it here.
router.get('/search', [
  query('hotelId').isMongoId().withMessage('Valid Hotel ID is required'),
  query('checkInDate').isISO8601().toDate().withMessage('Valid check-in date is required'),
  query('checkOutDate').isISO8601().toDate().withMessage('Valid check-out date is required'),
  query('guests').isInt({ min: 1 }).withMessage('Guests must be a positive integer')
], validate, searchAvailability);

module.exports = router;
