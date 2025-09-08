// authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Normal users can register themselves
router.post('/register', register);

// Login route
router.post('/login', login);

// Admin-only routes to add users (admins/store owners) can be separate
router.post('/add-user', authMiddleware, roleCheck('admin'), register);

export default router;
