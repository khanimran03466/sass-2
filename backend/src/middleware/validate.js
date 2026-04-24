const validate = (schema, property = 'body') => (req, res, next) => {
  req[property] = schema.parse(req[property]);
  next();
};

module.exports = validate;
