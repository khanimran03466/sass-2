const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const { adminOnly } = require('../../middleware/authMiddleware');
const adminController = require('./admin.controller');

const router = express.Router();

router.use(...adminOnly);
router.get('/analytics', asyncHandler(adminController.getOverview));
router.get('/users', asyncHandler(adminController.getUsers));
router.get('/transactions', asyncHandler(adminController.getTransactions));
router.get('/transactions/export', asyncHandler(adminController.exportTransactions));
router.post('/transactions/:paymentId/refund', asyncHandler(adminController.refundTransaction));

module.exports = router;
