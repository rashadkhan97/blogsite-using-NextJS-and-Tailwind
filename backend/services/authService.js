const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const AppError = require('../utils/AppError');
const gmailService = require('./gmailService');

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const register = async ({ firstName, lastName, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('Email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const { password: _omit, ...safeUser } = user.toJSON();
  return safeUser;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const { password: _omit, ...safeUser } = user.toJSON();
  return { token, user: safeUser };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Don't reveal whether the email exists — respond as if it worked either way.
    return;
  }

  await PasswordReset.destroy({ where: { userId: user.id } });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await PasswordReset.create({ userId: user.id, tokenHash, expiresAt });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
  await gmailService.sendPasswordResetEmail(user.email, resetUrl);
};

const resetPassword = async (rawToken, newPassword) => {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const record = await PasswordReset.findOne({ where: { tokenHash } });
  if (!record || record.expiresAt < new Date()) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const user = await User.findByPk(record.userId);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

  await PasswordReset.destroy({ where: { userId: user.id } });
};

module.exports = { register, login, forgotPassword, resetPassword };
