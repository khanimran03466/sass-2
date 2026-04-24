const { z } = require('zod');

const billPaymentSchema = z.object({
  category: z.enum(['ELECTRICITY', 'DTH', 'BROADBAND']),
  providerName: z.string().min(2),
  consumerNumber: z.string().min(4).max(30),
  amount: z.coerce.number().positive()
});

module.exports = {
  billPaymentSchema
};
