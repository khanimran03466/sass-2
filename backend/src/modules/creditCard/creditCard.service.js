const prisma = require('../../config/prisma');
const { calculateRevenueBreakdown } = require('../../utils/revenue');
const { createRazorpayOrder } = require('../../utils/payment');
const { PAYMENT_PURPOSE, PAYMENT_STATUS } = require('../../config/constants');

const initiatePayment = async (userId, payload) => {
  const revenue = calculateRevenueBreakdown('creditCard', payload.dueAmount);
  const receiptNumber = `CC-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      purpose: PAYMENT_PURPOSE.CREDIT_CARD,
      status: PAYMENT_STATUS.CREATED,
      baseAmount: revenue.baseAmount,
      platformFee: revenue.platformFee,
      taxAmount: 0,
      totalAmount: revenue.totalAmount,
      netRevenue: revenue.netRevenue,
      receiptNumber,
      notes: {
        cardIssuer: payload.cardIssuer,
        cardLast4: payload.cardLast4
      }
    }
  });

  await prisma.creditCardPayment.create({
    data: {
      userId,
      paymentId: payment.id,
      cardIssuer: payload.cardIssuer,
      cardLast4: payload.cardLast4,
      dueAmount: payload.dueAmount,
      status: PAYMENT_STATUS.CREATED
    }
  });

  const order = await createRazorpayOrder({
    amount: revenue.totalAmount,
    receipt: receiptNumber,
    notes: {
      module: 'creditCard',
      paymentId: payment.id,
      userId
    }
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayOrderId: order.id,
      status: PAYMENT_STATUS.PENDING
    }
  });

  return {
    paymentId: payment.id,
    revenue,
    order
  };
};

const listPayments = async (userId) =>
  prisma.creditCardPayment.findMany({
    where: { userId },
    include: { payment: true },
    orderBy: { createdAt: 'desc' }
  });

module.exports = {
  initiatePayment,
  listPayments
};
