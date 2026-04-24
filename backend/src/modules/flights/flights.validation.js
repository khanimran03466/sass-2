const { z } = require('zod');

const searchFlightsSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  departureDate: z.string(),
  travellers: z.coerce.number().int().positive().max(9)
});

const flightBookingSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  departureDate: z.string(),
  travellers: z.coerce.number().int().positive().max(9),
  airline: z.string().min(2),
  flightNumber: z.string().min(2),
  provider: z.string().min(2),
  supplierCost: z.coerce.number().positive()
});

module.exports = {
  searchFlightsSchema,
  flightBookingSchema
};
