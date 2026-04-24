const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/apiError');
const { calculateRevenueBreakdown } = require('../../utils/revenue');
const { createRazorpayOrder } = require('../../utils/payment');
const { PAYMENT_PURPOSE, PAYMENT_STATUS } = require('../../config/constants');

const createLandlord = async (userId, payload) => {
  return prisma.landlord.create({
    data: {
      userId,
      ...payload
    }
  });
};

const listLandlords = async (userId) => {
  return prisma.landlord.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

const initiateRentPayment = async (userId, payload) => {
  const landlord = await prisma.landlord.findFirst({
    where: {
      id: payload.landlordId,
      userId
    }
  });

  if (!landlord) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Landlord not found');
  }

  const revenue = calculateRevenueBreakdown('rent', payload.amount);
  const receiptNumber = `RENT-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      landlordId: landlord.id,
      purpose: PAYMENT_PURPOSE.RENT,
      status: PAYMENT_STATUS.CREATED,
      baseAmount: revenue.baseAmount,
      platformFee: revenue.platformFee,
      taxAmount: revenue.tax,
      totalAmount: revenue.totalAmount,
      netRevenue: revenue.netRevenue,
      receiptNumber,
      notes: {
        month: payload.month,
        remarks: payload.remarks || ''
      }
    }
  });

  const order = await createRazorpayOrder({
    amount: revenue.totalAmount,
    receipt: receiptNumber,
    notes: {
      module: 'rent',
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
    landlord,
    revenue,
    order
  };
};

const getRentTransactions = async (userId) => {
  return prisma.payment.findMany({
    where: {
      userId,
      purpose: PAYMENT_PURPOSE.RENT
    },
    include: {
      landlord: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getReceipt = async (userId, paymentId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      userId,
      purpose: PAYMENT_PURPOSE.RENT
    },
    include: {
      landlord: true,
      user: true
    }
  });

  if (!payment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Receipt not found');
  }

  return payment;
};

module.exports = {
  createLandlord,
  listLandlords,
  initiateRentPayment,
  getRentTransactions,
  getReceipt
};
