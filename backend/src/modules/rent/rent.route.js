const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../utils/asyncHandler');
const rentController = require('./rent.controller');
const { landlordSchema, rentPaymentSchema } = require('./rent.validation');

const router = express.Router();

router.use(requireAuth);
router.post('/landlords', validate(landlordSchema), asyncHandler(rentController.createLandlord));
router.get('/landlords', asyncHandler(rentController.listLandlords));
router.post('/payments', validate(rentPaymentSchema), asyncHandler(rentController.initiatePayment));
router.get('/payments', asyncHandler(rentController.listTransactions));
router.get('/payments/:paymentId/receipt', asyncHandler(rentController.downloadReceipt));

module.exports = router;
