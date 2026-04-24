const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/apiError');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  createdAt: user.createdAt
});

const register = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'An account with this email already exists');
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      phone: payload.phone
    }
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: sanitizeUser(user)
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: sanitizeUser(user)
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  getProfile
};
