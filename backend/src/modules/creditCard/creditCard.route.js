const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../utils/asyncHandler');
const creditCardController = require('./creditCard.controller');
const { creditCardPaymentSchema } = require('./creditCard.validation');

const router = express.Router();

router.use(requireAuth);
router.post('/payments', validate(creditCardPaymentSchema), asyncHandler(creditCardController.initiatePayment));
router.get('/payments', asyncHandler(creditCardController.listPayments));

module.exports = router;
