const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    avatar: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
