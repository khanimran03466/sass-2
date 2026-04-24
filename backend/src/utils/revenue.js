const roundCurrency = (amount) => Number(Number(amount).toFixed(2));

const getEnvRate = (key, fallback) => Number(process.env[key] || fallback);

const calculateRevenueBreakdown = (module, baseAmount) => {
  const amount = Number(baseAmount);

  switch (module) {
    case 'rent': {
      const feeRate = getEnvRate('RENT_PLATFORM_FEE_RATE', 0.0325);
      const gstRate = getEnvRate('GST_RATE', 0.18);
      const platformFee = roundCurrency(amount * feeRate);
      const tax = roundCurrency(platformFee * gstRate);
      return {
        baseAmount: roundCurrency(amount),
        feeRate,
        markupRate: 0,
        platformFee,
        tax,
        totalAmount: roundCurrency(amount + platformFee + tax),
        netRevenue: roundCurrency(platformFee)
      };
    }
    case 'creditCard': {
      const feeRate = getEnvRate('CREDIT_CARD_FEE_RATE', 0.015);
      const platformFee = roundCurrency(amount * feeRate);
      return {
        baseAmount: roundCurrency(amount),
        feeRate,
        markupRate: 0,
        platformFee,
        tax: 0,
        totalAmount: roundCurrency(amount + platformFee),
        netRevenue: roundCurrency(platformFee)
      };
    }
    case 'flight': {
      const markupRate = getEnvRate('FLIGHT_MARKUP_RATE', 0.06);
      const serviceFee = getEnvRate('FLIGHT_SERVICE_FEE', 299);
      const markupAmount = roundCurrency(amount * markupRate);
      return {
        baseAmount: roundCurrency(amount),
        feeRate: 0,
        markupRate,
        platformFee: roundCurrency(serviceFee),
        markupAmount,
        tax: 0,
        totalAmount: roundCurrency(amount + markupAmount + serviceFee),
        netRevenue: roundCurrency(markupAmount + serviceFee)
      };
    }
    case 'hotel': {
      const markupRate = getEnvRate('HOTEL_MARKUP_RATE', 0.12);
      const feeRate = getEnvRate('HOTEL_SERVICE_FEE_RATE', 0.03);
      const markupAmount = roundCurrency(amount * markupRate);
      const platformFee = roundCurrency(amount * feeRate);
      return {
        baseAmount: roundCurrency(amount),
        feeRate,
        markupRate,
        platformFee,
        markupAmount,
        tax: 0,
        totalAmount: roundCurrency(amount + markupAmount + platformFee),
        netRevenue: roundCurrency(markupAmount + platformFee)
      };
    }
    case 'recharge': {
      const commissionRate = getEnvRate('RECHARGE_COMMISSION_RATE', 0.025);
      const commission = roundCurrency(amount * commissionRate);
      return {
        baseAmount: roundCurrency(amount),
        feeRate: 0,
        markupRate: 0,
        platformFee: 0,
        tax: 0,
        totalAmount: roundCurrency(amount),
        netRevenue: commission,
        commission
      };
    }
    case 'bill': {
      const feeRate = getEnvRate('BILL_PAYMENT_FEE_RATE', 0.02);
      const platformFee = roundCurrency(amount * feeRate);
      return {
        baseAmount: roundCurrency(amount),
        feeRate,
        markupRate: 0,
        platformFee,
        tax: 0,
        totalAmount: roundCurrency(amount + platformFee),
        netRevenue: roundCurrency(platformFee)
      };
    }
    default:
      return {
        baseAmount: roundCurrency(amount),
        feeRate: 0,
        markupRate: 0,
        platformFee: 0,
        tax: 0,
        totalAmount: roundCurrency(amount),
        netRevenue: 0
      };
  }
};

module.exports = {
  calculateRevenueBreakdown,
  roundCurrency
};
