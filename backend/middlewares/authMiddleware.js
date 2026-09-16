const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-checked on every request (not just at login) so an admin
    // deactivating a user takes effect immediately, even if that
    // user's existing token hasn't expired yet.
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('Invalid or expired token', 401));
  }
};
