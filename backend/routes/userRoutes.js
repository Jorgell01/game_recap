const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getProfile,
  getStats,
  getUserHistory
} = require("../controllers/userController");

router.get("/profile", verifyToken, getProfile);
router.get("/stats", verifyToken, getStats);
router.get("/history", verifyToken, getUserHistory);

module.exports = router;
