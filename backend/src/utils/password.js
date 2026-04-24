const bcrypt = require('bcryptjs');

const hashPassword = (value) => bcrypt.hash(value, 12);
const comparePassword = (value, hash) => bcrypt.compare(value, hash);

module.exports = {
  hashPassword,
  comparePassword
};
