import express from "express";
import { getWeeklyStats, getRecentAchievements } from "../controllers/dashboardController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/weekly-stats", verifyToken, getWeeklyStats);
router.get("/recent-achievements", verifyToken, getRecentAchievements);

export default router;