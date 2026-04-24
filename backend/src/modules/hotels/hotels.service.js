const prisma = require('../../config/prisma');
const { calculateRevenueBreakdown } = require('../../utils/revenue');
const { createRazorpayOrder } = require('../../utils/payment');
const { PAYMENT_PURPOSE, PAYMENT_STATUS, BOOKING_STATUS } = require('../../config/constants');

const searchHotels = async ({ city, checkIn, checkOut, guests }) => {
  const sampleBase = 3200 + guests * 950;
  const properties = [0, 1, 2].map((index) => {
    const supplierCost = sampleBase + index * 2200;
    const revenue = calculateRevenueBreakdown('hotel', supplierCost);

    return {
      id: `${city}-${index + 1}`,
      city,
      checkIn,
      checkOut,
      guests,
      hotelName: ['Luxe Stay', 'Business Inn', 'Skyline Suites'][index],
      roomType: ['Deluxe', 'Executive', 'Premium'][index],
      provider: 'Expedia-ready',
      supplierCost,
      revenue,
      totalDisplayPrice: revenue.totalAmount
    };
  });

  return {
    providerRecommendation: 'Expedia Partner API',
    apiStatus: 'Mocked structure ready for partner integration',
    properties
  };
};

const createBooking = async (userId, payload) => {
  const revenue = calculateRevenueBreakdown('hotel', payload.supplierCost);
  const receiptNumber = `HTL-${Date.now()}`;
  const bookingReference = `HB${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      purpose: PAYMENT_PURPOSE.HOTEL,
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

  const booking = await prisma.hotelBooking.create({
    data: {
      userId,
      paymentId: payment.id,
      city: payload.city,
      hotelName: payload.hotelName,
      roomType: payload.roomType,
      checkIn: new Date(payload.checkIn),
      checkOut: new Date(payload.checkOut),
      guests: payload.guests,
      provider: payload.provider,
      supplierCost: payload.supplierCost,
      markupAmount: revenue.markupAmount || 0,
      serviceFee: revenue.platformFee,
      bookingReference,
      status: BOOKING_STATUS.PENDING
    }
  });

  const order = await createRazorpayOrder({
    amount: revenue.totalAmount,
    receipt: receiptNumber,
    notes: {
      module: 'hotel',
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
    booking,
    revenue,
    order
  };
};

const listBookings = async (userId) =>
  prisma.hotelBooking.findMany({
    where: { userId },
    include: { payment: true },
    orderBy: { createdAt: 'desc' }
  });

module.exports = {
  searchHotels,
  createBooking,
  listBookings
};
