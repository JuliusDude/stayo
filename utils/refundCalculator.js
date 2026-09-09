const calculateRefund = (totalAmount, checkInDate, cancellationDate = new Date()) => {

  const checkIn = new Date(checkInDate);
  const cancelledAt = new Date(cancellationDate);

  const differenceInMilliseconds =
    checkIn - cancelledAt;

  const daysBeforeCheckIn =
    differenceInMilliseconds /
    (1000 * 60 * 60 * 24);

  let refundPercentage = 0;


  // Cancellation 7 or more days before check-in
  if (daysBeforeCheckIn >= 7) {

    refundPercentage = 100;

  }

  // Cancellation between 2 and 7 days
  else if (daysBeforeCheckIn >= 2) {

    refundPercentage = 50;

  }

  // Less than 2 days
  else {

    refundPercentage = 0;

  }


  const refundAmount =
    (totalAmount * refundPercentage) / 100;


  return {
    refundPercentage,
    refundAmount: Number(refundAmount.toFixed(2)),
    daysBeforeCheckIn: Number(daysBeforeCheckIn.toFixed(2))
  };
};


module.exports = {
  calculateRefund
};