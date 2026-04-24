const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/apiError');
const { toCsv } = require('../../utils/csv');
const { issueRefund } = require('../../utils/payment');

const getOverview = async () => {
  const [users, payments, successfulPayments] = await Promise.all([
    prisma.user.count(),
    prisma.payment.count(),
    prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: {
        id: true,
        purpose: true,
        totalAmount: true,
        netRevenue: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const revenueByPurpose = successfulPayments.reduce((acc, payment) => {
    const key = payment.purpose;
    acc[key] = Number(acc[key] || 0) + Number(payment.netRevenue);
    return acc;
  }, {});

  const grossVolume = successfulPayments.reduce((sum, payment) => sum + Number(payment.totalAmount), 0);
  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + Number(payment.netRevenue), 0);

  return {
    users,
    payments,
    grossVolume,
    totalRevenue,
    revenueByPurpose,
    recentPayments: successfulPayments.slice(0, 10)
  };
};

const getUsers = async () =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

const getTransactions = async () =>
  prisma.payment.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

const exportTransactions = async () => {
  const transactions = await prisma.payment.findMany({
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return toCsv(
    transactions.map((item) => ({
      id: item.id,
      purpose: item.purpose,
      status: item.status,
      customer: item.user.name,
      email: item.user.email,
      totalAmount: item.totalAmount.toString(),
      netRevenue: item.netRevenue.toString(),
      createdAt: item.createdAt.toISOString()
    }))
  );
};

const refundTransaction = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Payment not found');
  }

  if (!payment.razorpayPaymentId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Razorpay payment id missing; refund cannot be initiated');
  }

  const refund = await issueRefund({
    paymentId: payment.razorpayPaymentId,
    amount: Number(payment.totalAmount),
    notes: {
      reason: 'Admin initiated refund',
      paymentId: payment.id
    }
  });

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'REFUNDED',
      razorpayRefundId: refund.id
    }
  });

  return refund;
};

module.exports = {
  getOverview,
  getUsers,
  getTransactions,
  exportTransactions,
  refundTransaction
};
