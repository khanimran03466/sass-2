const { z } = require('zod');

const creditCardPaymentSchema = z.object({
  cardIssuer: z.string().min(2).max(50),
  cardLast4: z.string().length(4),
  dueAmount: z.coerce.number().positive()
});

module.exports = {
  creditCardPaymentSchema
};
