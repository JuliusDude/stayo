// Calculates the total price for a stay by walking night-by-night between
// checkIn and checkOut, applying the highest-multiplier PricingRule whose
// date range covers that night (if any), otherwise falling back to basePrice.
//
// This is used by bookingController.createBooking, and can be reused by
// Member 3's Invoice Generation Summary module for a consistent breakdown.
function calculateBookingPrice(basePrice, checkInDate, checkOutDate, pricingRules = []) {
  const nights = [];
  let total = 0;

  const current = new Date(checkInDate);
  const end = new Date(checkOutDate);

  while (current < end) {
    const nightStart = new Date(current);
    const nightEnd = new Date(current);
    nightEnd.setDate(nightEnd.getDate() + 1);

    // Find rules covering this specific night
    const matchingRules = pricingRules.filter(
      (rule) => new Date(rule.startDate) <= nightStart && new Date(rule.endDate) > nightStart
    );

    // If multiple rules match the same night, apply the highest multiplier
    const multiplier = matchingRules.length
      ? Math.max(...matchingRules.map((r) => r.multiplier))
      : 1;

    const nightRate = basePrice * multiplier;
    total += nightRate;

    nights.push({
      date: nightStart,
      baseRate: basePrice,
      multiplier,
      rate: nightRate,
    });

    current.setDate(current.getDate() + 1);
  }

  return {
    totalAmount: Math.round(total * 100) / 100,
    nights,
  };
}

module.exports = { calculateBookingPrice };
