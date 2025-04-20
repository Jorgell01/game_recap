import express from "express"; // Importa Express para manejar las rutas
import passport from "passport"; // Importa Passport para manejar la autenticación
import jwt from "jsonwebtoken"; // Importa JSON Web Token para generar tokens JWT
import { sincronizarPartidasSteam } from "../services/steamSyncService.js"; // Importa el servicio para sincronizar partidas desde Steam

const router = express.Router(); // Crea un enrutador de Express

// 🟢 Inicia el login con Steam
// Ruta para iniciar el proceso de autenticación con Steam
// Utiliza Passport con la estrategia de Steam para redirigir al usuario a la página de login de Steam
router.get("/steam", passport.authenticate("steam"));

// 🔁 Steam redirige aquí después del login
// Ruta de retorno a la que Steam redirige después de que el usuario se autentique
router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }), // Si la autenticación falla, redirige al inicio
  async (req, res) => {
    const user = req.user; // Obtiene los datos del usuario autenticado desde Passport

    // 🔐 Genera token JWT
    // Crea un token JWT con los datos del usuario (ID y nombre de usuario)
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Payload del token
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: "7d" } // El token expira en 7 días
    );

    // ⏱️ Sincroniza partidas desde Steam automáticamente
    // Llama al servicio para sincronizar las partidas del usuario desde Steam
    try {
      await sincronizarPartidasSteam(user);
    } catch (error) {
      console.error("❌ Error al sincronizar con Steam tras login:", error.message); // Registra el error en la consola si algo falla
    }

    // 🚀 Redirige al frontend con el token
    // Redirige al frontend pasando el token JWT como parámetro en la URL
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

export default router; // Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
