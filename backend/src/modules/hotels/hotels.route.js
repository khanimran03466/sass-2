const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../utils/asyncHandler');
const hotelsController = require('./hotels.controller');
const { searchHotelsSchema, hotelBookingSchema } = require('./hotels.validation');

const router = express.Router();

router.get('/search', validate(searchHotelsSchema, 'query'), asyncHandler(hotelsController.searchHotels));
router.use(requireAuth);
router.post('/bookings', validate(hotelBookingSchema), asyncHandler(hotelsController.createBooking));
router.get('/bookings', asyncHandler(hotelsController.listBookings));

module.exports = router;
