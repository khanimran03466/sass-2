const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../utils/asyncHandler');
const flightsController = require('./flights.controller');
const { searchFlightsSchema, flightBookingSchema } = require('./flights.validation');

const router = express.Router();

router.get('/search', validate(searchFlightsSchema, 'query'), asyncHandler(flightsController.searchFlights));
router.use(requireAuth);
router.post('/bookings', validate(flightBookingSchema), asyncHandler(flightsController.createBooking));
router.get('/bookings', asyncHandler(flightsController.listBookings));

module.exports = router;
