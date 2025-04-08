const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/steam",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    // nunca se ejecuta, Steam redirige directamente
  }
);

router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    // Puedes enviar un JWT si quieres mantener la coherencia
    res.send(`✅ Bienvenido, ${req.user.username} desde Steam`);
  }
);

module.exports = router;
 
