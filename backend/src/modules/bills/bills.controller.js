const { StatusCodes } = require('http-status-codes');
const billsService = require('./bills.service');

const createBillPayment = async (req, res) => {
  const payload = await billsService.createBillPayment(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    ...payload
  });
};

const listBillPayments = async (req, res) => {
  const payments = await billsService.listBillPayments(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    payments
  });
};

module.exports = {
  createBillPayment,
  listBillPayments
};
