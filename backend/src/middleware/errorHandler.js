const { StatusCodes } = require('http-status-codes');
const { ZodError } = require('zod');

const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    });
  }

  return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Internal server error'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
