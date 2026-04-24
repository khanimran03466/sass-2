const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../utils/asyncHandler');
const billsController = require('./bills.controller');
const { billPaymentSchema } = require('./bills.validation');

const router = express.Router();

router.use(requireAuth);
router.post('/payments', validate(billPaymentSchema), asyncHandler(billsController.createBillPayment));
router.get('/payments', asyncHandler(billsController.listBillPayments));

module.exports = router;
