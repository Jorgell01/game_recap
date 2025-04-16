import express from "express";
import {
  getGameInfo,
  crearPartida,
  getHistorial,
  sincronizarSteamPartidas
} from "../controllers/gameController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Registrar una nueva partida manualmente
router.post("/session", verifyToken, crearPartida);

// 🔍 Obtener información de un juego por ID
router.get("/:id", getGameInfo);

// 📜 Obtener historial de partidas del usuario
router.get("/historial", verifyToken, getHistorial);

// 🔁 Sincronizar partidas desde Steam
router.post("/sync", verifyToken, sincronizarSteamPartidas);

export default router;
