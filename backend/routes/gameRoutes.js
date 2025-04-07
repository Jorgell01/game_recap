const express = require("express");
const router = express.Router();
const { getGameInfo } = require("../controllers/gameController");

router.get("/:id", getGameInfo);

module.exports = router;
