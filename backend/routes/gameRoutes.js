import express from "express"; // Importa Express para manejar las rutas
import {
  getGameInfo, // Controlador para obtener información de un juego por su ID
  crearPartida, // Controlador para registrar una nueva partida manualmente
  getHistorial, // Controlador para obtener el historial de partidas del usuario
  sincronizarSteamPartidas, // Controlador para sincronizar partidas desde Steam
} from "../controllers/gameController.js"; // Importa los controladores relacionados con juegos
import verifyToken from "../middleware/authMiddleware.js"; // Importa el middleware para verificar el token JWT

const router = express.Router(); // Crea un enrutador de Express

// ➕ Registrar una nueva partida manualmente
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `crearPartida` para manejar la lógica de registro de partidas
router.post("/session", verifyToken, crearPartida);

// 🔍 Obtener información de un juego por ID
// Llama al controlador `getGameInfo` para manejar la lógica de obtención de información del juego
router.get("/:id", getGameInfo);

// 📜 Obtener historial de partidas del usuario
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `getHistorial` para manejar la lógica de obtención del historial de partidas
router.get("/historial", verifyToken, getHistorial);

// 🔁 Sincronizar partidas desde Steam
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `sincronizarSteamPartidas` para manejar la lógica de sincronización de partidas desde Steam
router.post("/sync", verifyToken, sincronizarSteamPartidas);

export default router; // Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
