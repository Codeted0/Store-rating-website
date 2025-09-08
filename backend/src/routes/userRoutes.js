import express from 'express';
import {
  getAllUsers,
  getUserById,
  updatePassword,
  createUser,
  searchUsers,
  resetUserPassword, 
} from '../controllers/userController.js';
import { register } from '../controllers/authController.js'; // ✅ import register
import { validateUserData } from '../middleware/validateUserData.js';

import { authMiddleware } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Admin can get all users
router.get('/', authMiddleware, roleCheck('admin'), getAllUsers);

// Admin can search/filter users
router.get('/search', authMiddleware, roleCheck('admin'), searchUsers);

// Get single user
router.get('/:id', authMiddleware, getUserById);

// Update password (any logged-in user)
router.put('/update-password', authMiddleware, updatePassword);

// Admin can create user (with validation)
router.post('/', authMiddleware, roleCheck('admin'), validateUserData, createUser);

// Normal user registration
router.post('/register', validateUserData, register);

// Admin reset user password
router.put('/reset-password/:id', authMiddleware, roleCheck('admin'), resetUserPassword);

export default router;
