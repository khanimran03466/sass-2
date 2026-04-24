const prisma = require('../../config/prisma');
const { calculateRevenueBreakdown } = require('../../utils/revenue');
const { createRazorpayOrder } = require('../../utils/payment');
const { PAYMENT_PURPOSE, PAYMENT_STATUS, BOOKING_STATUS } = require('../../config/constants');

const searchFlights = async ({ origin, destination, departureDate, travellers }) => {
  const sampleBase = 4200 + travellers * 1800;
  const options = [0, 1, 2].map((index) => {
    const supplierCost = sampleBase + index * 1450;
    const revenue = calculateRevenueBreakdown('flight', supplierCost);

    return {
      id: `${origin}${destination}${index + 1}`,
      airline: ['IndiGo', 'Air India', 'Akasa Air'][index],
      flightNumber: `AI${310 + index}`,
      provider: 'Amadeus-ready',
      origin,
      destination,
      departureDate,
      travellers,
      supplierCost,
      revenue,
      totalDisplayPrice: revenue.totalAmount
    };
  });

  return {
    providerRecommendation: 'Amadeus',
    apiStatus: 'Mocked structure ready for partner integration',
    options
  };
};

const createBooking = async (userId, payload) => {
  const revenue = calculateRevenueBreakdown('flight', payload.supplierCost);
  const receiptNumber = `FLT-${Date.now()}`;
  const bookingReference = `FB${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      purpose: PAYMENT_PURPOSE.FLIGHT,
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

  const booking = await prisma.flightBooking.create({
    data: {
      userId,
      paymentId: payment.id,
      origin: payload.origin,
      destination: payload.destination,
      departureDate: new Date(payload.departureDate),
      travellers: payload.travellers,
      airline: payload.airline,
      flightNumber: payload.flightNumber,
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
      module: 'flight',
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
  prisma.flightBooking.findMany({
    where: { userId },
    include: { payment: true },
    orderBy: { createdAt: 'desc' }
  });

module.exports = {
  searchFlights,
  createBooking,
  listBookings
};
