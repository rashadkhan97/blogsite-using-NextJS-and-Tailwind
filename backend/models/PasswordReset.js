const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const PasswordReset = sequelize.define(
  'PasswordReset',
  {
    tokenHash: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: 'password_resets',
    timestamps: true,
  }
);

User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordResets' });
PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = PasswordReset;
