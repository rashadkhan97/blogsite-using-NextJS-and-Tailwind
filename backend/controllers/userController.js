const userService = require('../services/userService');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return success(res, user, 'Profile fetched successfully');
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return error(res, 'firstName and lastName are required', 400);
    }

    const user = await userService.updateProfile(req.user.id, { firstName, lastName });
    logger.info(`Profile updated by user id ${req.user.id}`);
    return success(res, user, 'Profile updated successfully');
  } catch (err) { next(err); }
};

const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'No image uploaded', 400);
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await userService.updateProfileImage(req.user.id, avatarPath);
    logger.info(`Profile image updated for user id ${req.user.id}`);
    return success(res, user, 'Profile image updated successfully');
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return error(res, 'Password is required', 400);
    }
    if (password.length < 6) {
      return error(res, 'Password must be at least 6 characters', 400);
    }

    await userService.changePassword(req.user.id, password);
    logger.info(`Password changed for user id ${req.user.id}`);
    return success(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return success(res, users, 'Users fetched successfully');
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return success(res, user, 'User fetched successfully');
  } catch (err) { next(err); }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return error(res, 'isActive must be true or false', 400);
    }

    const user = await userService.updateUserStatus(req.params.id, isActive);
    logger.info(`User ${req.params.id} status set to isActive=${isActive} by admin ${req.user.id}`);
    return success(res, user, isActive ? 'User activated' : 'User deactivated');
  } catch (err) { next(err); }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
};
