import express from "express";
import {
  getFavoritesByUser,
  createFavorite,
  deleteFavorite, // ✅ nombre correcto
} from "../controllers/favoriteController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getFavoritesByUser);
router.post("/", verifyToken, createFavorite);
router.delete("/:gameId", verifyToken, deleteFavorite);

export default router;
