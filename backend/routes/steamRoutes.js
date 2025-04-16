import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sincronizarPartidasSteam } from "../services/steamSyncService.js";

const router = express.Router();

// 🟢 Inicia el login con Steam
router.get("/steam", passport.authenticate("steam"));

// 🔁 Steam redirige aquí después del login
router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user;

    // 🔐 Genera token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ⏱️ Sincroniza partidas desde Steam automáticamente
    try {
      await sincronizarPartidasSteam(user);
    } catch (error) {
      console.error("❌ Error al sincronizar con Steam tras login:", error.message);
    }

    // 🚀 Redirige al frontend con el token
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

export default router;
