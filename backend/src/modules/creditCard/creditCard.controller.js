const { StatusCodes } = require('http-status-codes');
const creditCardService = require('./creditCard.service');

const initiatePayment = async (req, res) => {
  const payload = await creditCardService.initiatePayment(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    ...payload
  });
};

const listPayments = async (req, res) => {
  const payments = await creditCardService.listPayments(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    payments
  });
};

module.exports = {
  initiatePayment,
  listPayments
};
