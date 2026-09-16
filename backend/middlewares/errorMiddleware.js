const multer = require('multer');
const { error } = require('../utils/response');

module.exports = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return error(res, 'Image must be 3 MB or smaller', 400);
    }
    return error(res, err.message, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';

  if (!err.statusCode) {
    console.error(err);
  }

  return error(res, message, statusCode);
};
