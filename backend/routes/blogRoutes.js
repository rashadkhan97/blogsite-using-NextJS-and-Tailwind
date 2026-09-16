const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/create', authMiddleware, createBlog);
router.put('/update/:id', authMiddleware, updateBlog);
router.delete('/delete/:id', authMiddleware, deleteBlog);

module.exports = router;
