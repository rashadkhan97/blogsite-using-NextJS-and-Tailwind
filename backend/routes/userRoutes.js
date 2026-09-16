const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
} = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);
router.patch('/profile/image', authMiddleware, upload.single('image'), updateProfileImage);
router.patch('/password', authMiddleware, changePassword);

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateUserStatus);

module.exports = router;
