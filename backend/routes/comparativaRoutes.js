import express from "express";
import { getRadarData, getRanking } from "../controllers/comparativaController.js";

const router = express.Router();

router.get("/radar-data", getRadarData);
router.get("/ranking", getRanking);

export default router;