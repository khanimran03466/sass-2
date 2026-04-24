const { StatusCodes } = require('http-status-codes');
const authService = require('./auth.service');

const issueAuthResponse = (res, payload) => {
  res.cookie('accessToken', payload.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    ...payload
  });
};

const register = async (req, res) => {
  const payload = await authService.register(req.body);
  return issueAuthResponse(res, payload);
};

const login = async (req, res) => {
  const payload = await authService.login(req.body);
  return issueAuthResponse(res, payload);
};

const me = async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    user
  });
};

const logout = async (req, res) => {
  res.clearCookie('accessToken');
  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  me,
  logout
};
