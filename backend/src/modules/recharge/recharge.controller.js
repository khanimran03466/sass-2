const { StatusCodes } = require('http-status-codes');
const rechargeService = require('./recharge.service');

const getPlans = async (req, res) => {
  const plans = await rechargeService.getPlans(req.params.operator);
  return res.status(StatusCodes.OK).json({
    success: true,
    ...plans
  });
};

const createRecharge = async (req, res) => {
  const payload = await rechargeService.createRecharge(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    ...payload
  });
};

const listTransactions = async (req, res) => {
  const transactions = await rechargeService.listTransactions(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    transactions
  });
};

module.exports = {
  getPlans,
  createRecharge,
  listTransactions
};
