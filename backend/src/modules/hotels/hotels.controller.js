const { StatusCodes } = require('http-status-codes');
const hotelsService = require('./hotels.service');

const searchHotels = async (req, res) => {
  const data = await hotelsService.searchHotels(req.query);
  return res.status(StatusCodes.OK).json({
    success: true,
    ...data
  });
};

const createBooking = async (req, res) => {
  const payload = await hotelsService.createBooking(req.user.id, req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    ...payload
  });
};

const listBookings = async (req, res) => {
  const bookings = await hotelsService.listBookings(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    bookings
  });
};

module.exports = {
  searchHotels,
  createBooking,
  listBookings
};
