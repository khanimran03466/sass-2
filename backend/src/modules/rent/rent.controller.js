const { StatusCodes } = require('http-status-codes');
const rentService = require('./rent.service');

const createLandlord = async (req, res) => {
  const landlord = await rentService.createLandlord(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    landlord
  });
};

const listLandlords = async (req, res) => {
  const landlords = await rentService.listLandlords(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    landlords
  });
};

const initiatePayment = async (req, res) => {
  const payment = await rentService.initiateRentPayment(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    ...payment
  });
};

const listTransactions = async (req, res) => {
  const transactions = await rentService.getRentTransactions(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    transactions
  });
};

const downloadReceipt = async (req, res) => {
  const payment = await rentService.getReceipt(req.user.id, req.params.paymentId);
  const receiptBody = [
    `Receipt Number: ${payment.receiptNumber}`,
    `Tenant: ${payment.user.name}`,
    `Landlord: ${payment.landlord?.name || 'N/A'}`,
    `Base Amount: INR ${payment.baseAmount}`,
    `Platform Fee: INR ${payment.platformFee}`,
    `GST: INR ${payment.taxAmount}`,
    `Total Paid: INR ${payment.totalAmount}`,
    `Status: ${payment.status}`,
    `Date: ${payment.createdAt.toISOString()}`
  ].join('\n');

  res.setHeader('Content-Disposition', `attachment; filename="${payment.receiptNumber}.txt"`);
  res.setHeader('Content-Type', 'text/plain');
  return res.status(StatusCodes.OK).send(receiptBody);
};

module.exports = {
  createLandlord,
  listLandlords,
  initiatePayment,
  listTransactions,
  downloadReceipt
};
