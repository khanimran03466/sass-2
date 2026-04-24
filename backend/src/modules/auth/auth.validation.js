const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, 'Password must contain a letter, number, and symbol'),
  phone: z.string().min(10).max(15).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

module.exports = {
  registerSchema,
  loginSchema
};
