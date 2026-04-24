const prisma = require('../../config/prisma');
const { calculateRevenueBreakdown } = require('../../utils/revenue');
const { createRazorpayOrder } = require('../../utils/payment');
const { PAYMENT_PURPOSE, PAYMENT_STATUS } = require('../../config/constants');

const getPlans = async (operator) => {
  const plans = [
    { planCode: `${operator}-199`, amount: 199, validity: '28 days', benefits: 'Unlimited calls + 2GB/day' },
    { planCode: `${operator}-399`, amount: 399, validity: '56 days', benefits: 'Unlimited calls + 2.5GB/day' },
    { planCode: `${operator}-699`, amount: 699, validity: '84 days', benefits: 'Unlimited calls + 3GB/day' }
  ];

  return {
    operator,
    plans
  };
};

const createRecharge = async (userId, payload) => {
  const revenue = calculateRevenueBreakdown('recharge', payload.amount);
  const receiptNumber = `RCH-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      purpose: PAYMENT_PURPOSE.RECHARGE,
      status: PAYMENT_STATUS.CREATED,
      baseAmount: revenue.baseAmount,
      platformFee: 0,
      taxAmount: 0,
      totalAmount: revenue.totalAmount,
      netRevenue: revenue.netRevenue,
      receiptNumber,
      notes: payload
    }
  });

  const recharge = await prisma.rechargeTransaction.create({
    data: {
      userId,
      paymentId: payment.id,
      operator: payload.operator,
      mobileNumber: payload.mobileNumber,
      planCode: payload.planCode,
      planAmount: payload.amount,
      commission: revenue.commission || 0,
      status: PAYMENT_STATUS.CREATED
    }
  });

  const order = await createRazorpayOrder({
    amount: revenue.totalAmount,
    receipt: receiptNumber,
    notes: {
      module: 'recharge',
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
    recharge,
    revenue,
    order
  };
};

const listTransactions = async (userId) =>
  prisma.rechargeTransaction.findMany({
    where: { userId },
    include: { payment: true },
    orderBy: { createdAt: 'desc' }
  });

module.exports = {
  getPlans,
  createRecharge,
  listTransactions
};
