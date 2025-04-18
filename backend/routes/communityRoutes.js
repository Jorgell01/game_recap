import express from "express";
import { getGameRatings, getGameReviews, getGameTags } from "../controllers/communityController.js";

const router = express.Router();

router.get("/ratings", getGameRatings);
router.get("/reviews", getGameReviews);
router.get("/tags", getGameTags);

export default router;