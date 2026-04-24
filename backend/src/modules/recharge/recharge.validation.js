const { z } = require('zod');

const rechargeSchema = z.object({
  operator: z.string().min(2),
  mobileNumber: z.string().min(10).max(10),
  planCode: z.string().min(2),
  amount: z.coerce.number().positive()
});

module.exports = {
  rechargeSchema
};
