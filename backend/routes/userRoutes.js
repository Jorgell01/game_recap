import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
  getProfile,
  getStats,
  getUserHistory
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.get("/stats", verifyToken, getStats);
router.get("/history", verifyToken, getUserHistory);

export default router;
