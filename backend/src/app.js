const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');

const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./modules/auth/auth.route');
const rentRoutes = require('./modules/rent/rent.route');
const creditCardRoutes = require('./modules/creditCard/creditCard.route');
const flightRoutes = require('./modules/flights/flights.route');
const hotelRoutes = require('./modules/hotels/hotels.route');
const rechargeRoutes = require('./modules/recharge/recharge.route');
const billRoutes = require('./modules/bills/bills.route');
const adminRoutes = require('./modules/admin/admin.route');
const webhookRoutes = require('./webhooks/razorpay.webhook');

const app = express();

app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan('combined'));
app.use('/api', apiLimiter);
app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Fintech super app backend is healthy'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rent', rentRoutes);
app.use('/api/credit-card', creditCardRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/recharge', rechargeRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks/razorpay', webhookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
