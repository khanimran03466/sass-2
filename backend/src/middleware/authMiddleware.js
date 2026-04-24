const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { USER_ROLE } = require('../config/constants');

const requireAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const token = bearerToken || req.cookies?.accessToken;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'You do not have permission to perform this action'
    });
  }

  return next();
};

module.exports = {
  requireAuth,
  requireRole,
  adminOnly: [requireAuth, requireRole(USER_ROLE.ADMIN)]
};
