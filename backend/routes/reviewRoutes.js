import express from "express";
import {
  getReviewsByGame, // ✅ nombre corregido
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:gameId", verifyToken, getReviewsByGame);
router.post("/", verifyToken, createReview);
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
