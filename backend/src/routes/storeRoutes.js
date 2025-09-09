import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { addStore, getStores, getStoreRatings } from '../controllers/storeController.js';
import { ownerDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

// Admin routes
// Store Owner can create their store
router.post('/', authMiddleware, roleCheck('admin'), addStore);


// All users can get store list
router.get('/', authMiddleware, getStores);

// Store Owner dashboard
router.get('/owner-dashboard', authMiddleware, roleCheck('owner'), ownerDashboard);

// Store Owner: get user ratings for their store
router.get('/ratings', authMiddleware, roleCheck('owner'), getStoreRatings);

export default router;
