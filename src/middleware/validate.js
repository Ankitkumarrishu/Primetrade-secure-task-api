const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Middleware to check express-validator results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new ApiError(422, messages.join('. '), errors.array()));
  }
  next();
};

module.exports = validate;
