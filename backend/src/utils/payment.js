const crypto = require('crypto');
const razorpay = require('../config/razorpay');

const createRazorpayOrder = async ({ amount, receipt, notes }) => {
  return razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt,
    notes
  });
};

const verifyRazorpayWebhookSignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
};

const issueRefund = async ({ paymentId, amount, notes }) => {
  return razorpay.payments.refund(paymentId, {
    amount: Math.round(Number(amount) * 100),
    notes
  });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayWebhookSignature,
  issueRefund
};
