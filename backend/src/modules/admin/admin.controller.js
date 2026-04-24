const { StatusCodes } = require('http-status-codes');
const adminService = require('./admin.service');

const getOverview = async (req, res) => {
  const data = await adminService.getOverview();
  return res.status(StatusCodes.OK).json({
    success: true,
    analytics: data
  });
};

const getUsers = async (req, res) => {
  const users = await adminService.getUsers();
  return res.status(StatusCodes.OK).json({
    success: true,
    users
  });
};

const getTransactions = async (req, res) => {
  const transactions = await adminService.getTransactions();
  return res.status(StatusCodes.OK).json({
    success: true,
    transactions
  });
};

const exportTransactions = async (req, res) => {
  const csv = await adminService.exportTransactions();
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
  res.setHeader('Content-Type', 'text/csv');
  return res.status(StatusCodes.OK).send(csv);
};

const refundTransaction = async (req, res) => {
  const refund = await adminService.refundTransaction(req.params.paymentId);
  return res.status(StatusCodes.OK).json({
    success: true,
    refund
  });
};

module.exports = {
  getOverview,
  getUsers,
  getTransactions,
  exportTransactions,
  refundTransaction
};
