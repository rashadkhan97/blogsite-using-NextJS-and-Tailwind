const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { password, ...safeUser } = user.toJSON();
  return safeUser;
};

const updateProfile = async (userId, { firstName, lastName }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update({ firstName, lastName });

  const { password, ...safeUser } = user.toJSON();
  return safeUser;
};

const updateProfileImage = async (userId, avatarPath) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update({ avatar: avatarPath });

  const { password, ...safeUser } = user.toJSON();
  return safeUser;
};

const changePassword = async (userId, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
};

module.exports = { getProfile, updateProfile, updateProfileImage, changePassword };
