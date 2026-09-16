const blogService = require('../services/blogService');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

const CATEGORIES = ['Testing', 'Automation', 'Programming', 'DevOps', 'AI'];

const getBlogs = async (req, res, next) => {
  try {
    const { title, category, authorId } = req.query;
    const blogs = await blogService.getBlogs({ title, category, authorId });
    return success(res, blogs, 'Blogs fetched successfully');
  } catch (err) { next(err); }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    return success(res, blog, 'Blog fetched successfully');
  } catch (err) { next(err); }
};

const createBlog = async (req, res, next) => {
  try {
    const { blogTitle, blog, category } = req.body;

    if (!blogTitle || !blog || !category) {
      return error(res, 'blogTitle, blog and category are required', 400);
    }
    if (!CATEGORIES.includes(category)) {
      return error(res, `Category must be one of: ${CATEGORIES.join(', ')}`, 400);
    }

    const created = await blogService.createBlog({
      blogTitle,
      blog,
      category,
      authorId: req.user.id,
    });
    logger.info(`Blog created by user id ${req.user.id}: ${blogTitle}`);
    return success(res, created, 'Blog created successfully', 201);
  } catch (err) { next(err); }
};

const updateBlog = async (req, res, next) => {
  try {
    const { blogTitle, blog, category } = req.body;

    if (!blogTitle || !blog || !category) {
      return error(res, 'blogTitle, blog and category are required', 400);
    }
    if (!CATEGORIES.includes(category)) {
      return error(res, `Category must be one of: ${CATEGORIES.join(', ')}`, 400);
    }

    const updated = await blogService.updateBlog(
      req.params.id,
      { blogTitle, blog, category },
      req.user
    );
    logger.info(`Blog updated by user id ${req.user.id}: id=${req.params.id}`);
    return success(res, updated, 'Blog updated successfully');
  } catch (err) { next(err); }
};

const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id, req.user);
    logger.info(`Blog deleted by user id ${req.user.id}: id=${req.params.id}`);
    return success(res, null, 'Blog deleted successfully');
  } catch (err) { next(err); }
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
