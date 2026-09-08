const PricingRule = require('../models/PricingRule');
const RoomType = require('../models/RoomType');

// @desc    Create a pricing rule
// @route   POST /api/pricing-rules
// @access  Private/Admin
exports.createPricingRule = async (req, res, next) => {
  try {
    const { roomTypeId, startDate, endDate } = req.body;

    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      res.status(404);
      throw new Error('RoomType not found');
    }

    if (new Date(startDate) >= new Date(endDate)) {
      res.status(400);
      throw new Error('endDate must be after startDate');
    }

    const pricingRule = await PricingRule.create(req.body);
    res.status(201).json({ success: true, data: pricingRule });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pricing rules (optionally filter by roomTypeId)
// @route   GET /api/pricing-rules
// @access  Public
exports.getPricingRules = async (req, res, next) => {
  try {
    const { roomTypeId } = req.query;
    const filter = roomTypeId ? { roomTypeId } : {};
    const pricingRules = await PricingRule.find(filter).populate('roomTypeId', 'name basePrice');
    res.json({ success: true, data: pricingRules });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pricing rule
// @route   PUT /api/pricing-rules/:id
// @access  Private/Admin
exports.updatePricingRule = async (req, res, next) => {
  try {
    const pricingRule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!pricingRule) {
      res.status(404);
      throw new Error('PricingRule not found');
    }
    res.json({ success: true, data: pricingRule });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pricing rule
// @route   DELETE /api/pricing-rules/:id
// @access  Private/Admin
exports.deletePricingRule = async (req, res, next) => {
  try {
    const pricingRule = await PricingRule.findByIdAndDelete(req.params.id);
    if (!pricingRule) {
      res.status(404);
      throw new Error('PricingRule not found');
    }
    res.json({ success: true, message: 'PricingRule deleted successfully' });
  } catch (error) {
    next(error);
  }
};
