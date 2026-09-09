const express = require('express');

const router = express.Router();

const auth =
  require('../middleware/auth');

const {
  generateInvoice
} =
  require('../controllers/invoiceController');


router.get(

  '/:bookingId',

  auth,

  generateInvoice

);


module.exports = router;