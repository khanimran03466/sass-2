import { http } from './http';

const unwrap = async (promise) => {
  const { data } = await promise;
  return data;
};

export const authApi = {
  register: (payload) => unwrap(http.post('/auth/register', payload)),
  login: (payload) => unwrap(http.post('/auth/login', payload)),
  me: () => unwrap(http.get('/auth/me'))
};

export const rentApi = {
  landlords: () => unwrap(http.get('/rent/landlords')),
  addLandlord: (payload) => unwrap(http.post('/rent/landlords', payload)),
  createPayment: (payload) => unwrap(http.post('/rent/payments', payload)),
  transactions: () => unwrap(http.get('/rent/payments'))
};

export const creditCardApi = {
  createPayment: (payload) => unwrap(http.post('/credit-card/payments', payload)),
  payments: () => unwrap(http.get('/credit-card/payments'))
};

export const flightApi = {
  search: (params) => unwrap(http.get('/flights/search', { params })),
  createBooking: (payload) => unwrap(http.post('/flights/bookings', payload)),
  bookings: () => unwrap(http.get('/flights/bookings'))
};

export const hotelApi = {
  search: (params) => unwrap(http.get('/hotels/search', { params })),
  createBooking: (payload) => unwrap(http.post('/hotels/bookings', payload)),
  bookings: () => unwrap(http.get('/hotels/bookings'))
};

export const rechargeApi = {
  getPlans: (operator) => unwrap(http.get(`/recharge/plans/${operator}`)),
  createTransaction: (payload) => unwrap(http.post('/recharge/transactions', payload)),
  transactions: () => unwrap(http.get('/recharge/transactions'))
};

export const billApi = {
  createPayment: (payload) => unwrap(http.post('/bills/payments', payload)),
  payments: () => unwrap(http.get('/bills/payments'))
};

export const adminApi = {
  analytics: () => unwrap(http.get('/admin/analytics')),
  users: () => unwrap(http.get('/admin/users')),
  transactions: () => unwrap(http.get('/admin/transactions'))
};
