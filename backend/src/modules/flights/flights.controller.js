const { StatusCodes } = require('http-status-codes');
const flightsService = require('./flights.service');

const searchFlights = async (req, res) => {
  const data = await flightsService.searchFlights(req.query);
  return res.status(StatusCodes.OK).json({
    success: true,
    ...data
  });
};

const createBooking = async (req, res) => {
  const payload = await flightsService.createBooking(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    ...payload
  });
};

const listBookings = async (req, res) => {
  const bookings = await flightsService.listBookings(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    bookings
  });
};

module.exports = {
  searchFlights,
  createBooking,
  listBookings
};
