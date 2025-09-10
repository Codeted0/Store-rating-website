import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getOwnerStore } from "../controllers/storeController.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// Owner can fetch their store
router.get("/stores", authMiddleware, roleCheck('owner'), getOwnerStore);

export default router;
