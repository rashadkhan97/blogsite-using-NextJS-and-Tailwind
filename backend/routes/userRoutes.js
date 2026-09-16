const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
} = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);
router.patch('/profile/image', authMiddleware, upload.single('image'), updateProfileImage);
router.patch('/password', authMiddleware, changePassword);

module.exports = router;
