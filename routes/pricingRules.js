const express = require('express');
const router = express.Router();
const {
  createPricingRule,
  getPricingRules,
  updatePricingRule,
  deletePricingRule
} = require('../controllers/pricingRuleController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.route('/')
  .get(getPricingRules)
  .post(
    auth,
    authorize(['admin']),
    [
      body('roomTypeId').isMongoId().withMessage('Valid roomTypeId is required'),
      body('season').notEmpty().withMessage('Season is required'),
      body('multiplier').isFloat({ min: 0 }).withMessage('Multiplier must be a positive number'),
      body('startDate').isISO8601().withMessage('Valid startDate is required'),
      body('endDate').isISO8601().withMessage('Valid endDate is required')
    ],
    validate,
    createPricingRule
  );

router.route('/:id')
  .put(auth, authorize(['admin']), updatePricingRule)
  .delete(auth, authorize(['admin']), deletePricingRule);

module.exports = router;
