const { z } = require('zod');

const searchHotelsSchema = z.object({
  city: z.string().min(2),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().positive().max(8)
});

const hotelBookingSchema = z.object({
  city: z.string().min(2),
  hotelName: z.string().min(2),
  roomType: z.string().min(2),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().positive().max(8),
  provider: z.string().min(2),
  supplierCost: z.coerce.number().positive()
});

module.exports = {
  searchHotelsSchema,
  hotelBookingSchema
};
