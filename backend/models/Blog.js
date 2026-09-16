const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Blog = sequelize.define(
  'Blog',
  {
    blogTitle: { type: DataTypes.STRING, allowNull: false },
    blog: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'blogs',
    timestamps: true,
  }
);

User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = Blog;
