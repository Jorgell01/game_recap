import express from "express";
import { register, login } from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// 🔐 Ruta protegida para probar el token
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Acceso permitido al perfil",
    user: req.user,
  });
});

export default router;
