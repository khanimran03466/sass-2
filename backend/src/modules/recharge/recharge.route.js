const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../utils/asyncHandler');
const rechargeController = require('./recharge.controller');
const { rechargeSchema } = require('./recharge.validation');

const router = express.Router();

router.get('/plans/:operator', asyncHandler(rechargeController.getPlans));
router.use(requireAuth);
router.post('/transactions', validate(rechargeSchema), asyncHandler(rechargeController.createRecharge));
router.get('/transactions', asyncHandler(rechargeController.listTransactions));

module.exports = router;
