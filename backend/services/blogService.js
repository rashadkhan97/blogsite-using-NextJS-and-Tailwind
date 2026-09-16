const { Op } = require('sequelize');
const Blog = require('../models/Blog');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const AUTHOR_ATTRIBUTES = ['id', 'firstName', 'lastName', 'avatar'];

const getBlogs = async ({ title, category, authorId }) => {
  const where = {};

  if (title) {
    where.blogTitle = { [Op.like]: `%${title}%` };
  }
  if (category && category !== 'All') {
    where.category = category;
  }
  if (authorId) {
    where.authorId = authorId;
  }

  return Blog.findAll({
    where,
    include: [{ model: User, as: 'author', attributes: AUTHOR_ATTRIBUTES }],
    order: [['createdAt', 'DESC']],
  });
};

const getBlogById = async (id) => {
  const blog = await Blog.findByPk(id, {
    include: [{ model: User, as: 'author', attributes: AUTHOR_ATTRIBUTES }],
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  return blog;
};

const createBlog = async ({ blogTitle, blog, category, authorId }) => {
  const created = await Blog.create({ blogTitle, blog, category, authorId });
  return getBlogById(created.id);
};

const assertCanModify = (existingBlog, user, action) => {
  if (user.role !== 'admin' && existingBlog.authorId !== user.id) {
    throw new AppError(`You are not authorized to ${action} this blog`, 403);
  }
};

const updateBlog = async (id, { blogTitle, blog, category }, user) => {
  const existing = await Blog.findByPk(id);
  if (!existing) {
    throw new AppError('Blog not found', 404);
  }

  assertCanModify(existing, user, 'update');

  await existing.update({ blogTitle, blog, category });
  return getBlogById(id);
};

const deleteBlog = async (id, user) => {
  const existing = await Blog.findByPk(id);
  if (!existing) {
    throw new AppError('Blog not found', 404);
  }

  assertCanModify(existing, user, 'delete');

  await existing.destroy();
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
