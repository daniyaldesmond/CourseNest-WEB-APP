import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  uploadAvatar,
  removeAvatar
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/profile/avatar', protect, removeAvatar);

router.route('/users')
  .get(protect, authorize('admin'), getAllUsers);

router.route('/users/:id')
  .delete(protect, authorize('admin'), deleteUser);

router.route('/users/:id/role')
  .put(protect, authorize('admin'), updateUserRole);

router.route('/users/:id/status')
  .put(protect, authorize('admin'), toggleUserStatus);

export default router;
