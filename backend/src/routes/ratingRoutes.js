import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { submitRating } from '../controllers/ratingController.js';

const router = express.Router();

// Normal user submit or update rating
// ratingRoutes.js
// ratingRoutes.js
router.post('/:storeId', authMiddleware, roleCheck('user'), submitRating);



export default router;
