const { error } = require('../utils/response');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';

  if (!err.statusCode) {
    console.error(err);
  }

  return error(res, message, statusCode);
};
