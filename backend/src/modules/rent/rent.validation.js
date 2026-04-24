const { z } = require('zod');

const landlordSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
  bankName: z.string().max(120).optional(),
  accountNumber: z.string().max(30).optional(),
  ifscCode: z.string().max(20).optional()
});

const rentPaymentSchema = z.object({
  landlordId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  month: z.string().min(3).max(20),
  remarks: z.string().max(250).optional()
});

module.exports = {
  landlordSchema,
  rentPaymentSchema
};
