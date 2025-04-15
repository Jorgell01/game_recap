const express = require("express");
const router = express.Router();
const { getGameInfo, crearPartida, getHistorial } = require("../controllers/gameController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/session", verifyToken, crearPartida);
router.get("/:id", getGameInfo);
router.get("/historial", verifyToken, getHistorial);

module.exports = router;
