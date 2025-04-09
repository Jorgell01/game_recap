const express = require("express");
const router = express.Router();
const { getGameInfo } = require("../controllers/gameController");
const { crearPartida } = require("../controllers/gameController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/session", verifyToken, crearPartida);
router.get("/:id", getGameInfo);

module.exports = router;
