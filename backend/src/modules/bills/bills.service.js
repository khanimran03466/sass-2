const prisma = require('../../config/prisma');
const { calculateRevenueBreakdown } = require('../../utils/revenue');
const { createRazorpayOrder } = require('../../utils/payment');
const { PAYMENT_PURPOSE, PAYMENT_STATUS } = require('../../config/constants');

const createBillPayment = async (userId, payload) => {
  const revenue = calculateRevenueBreakdown('bill', payload.amount);
  const receiptNumber = `BILL-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      purpose: PAYMENT_PURPOSE.BILL,
      status: PAYMENT_STATUS.CREATED,
      baseAmount: revenue.baseAmount,
      platformFee: revenue.platformFee,
      taxAmount: 0,
      totalAmount: revenue.totalAmount,
      netRevenue: revenue.netRevenue,
      receiptNumber,
      notes: payload
    }
  });

  const billPayment = await prisma.billPayment.create({
    data: {
      userId,
      paymentId: payment.id,
      category: payload.category,
      providerName: payload.providerName,
      consumerNumber: payload.consumerNumber,
      billAmount: payload.amount,
      serviceFee: revenue.platformFee,
      status: PAYMENT_STATUS.CREATED
    }
  });

  const order = await createRazorpayOrder({
    amount: revenue.totalAmount,
    receipt: receiptNumber,
    notes: {
      module: 'bill',
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
    billPayment,
    revenue,
    order
  };
};

const listBillPayments = async (userId) =>
  prisma.billPayment.findMany({
    where: { userId },
    include: { payment: true },
    orderBy: { createdAt: 'desc' }
  });

module.exports = {
  createBillPayment,
  listBillPayments
};
