const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Ruta para iniciar el login con Steam
router.get("/steam", passport.authenticate("steam"));

// Ruta que Steam usa para devolver al usuario
router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;

    // 🔐 Generar el token como en login normal
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🚀 Redirigir al frontend y pasarle el token por la URL
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

module.exports = router;
