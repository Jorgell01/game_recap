import express from "express"; // Importa Express para manejar las rutas
import verifyToken from "../middleware/verifyToken.js"; // Importa el middleware para verificar el token JWT

import {
  getProfile, // Controlador para obtener el perfil del usuario autenticado
  getStats, // Controlador para obtener estadísticas del usuario
  getUserHistory, // Controlador para obtener el historial de partidas del usuario
} from "../controllers/userController.js"; // Importa los controladores relacionados con el usuario

const router = express.Router(); // Crea un enrutador de Express

// Ruta para obtener el perfil del usuario autenticado
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `getProfile` para manejar la lógica de obtención del perfil
router.get("/profile", verifyToken, getProfile);

// Ruta para obtener estadísticas del usuario
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `getStats` para manejar la lógica de obtención de estadísticas
router.get("/stats", verifyToken, getStats);

// Ruta para obtener el historial de partidas del usuario
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `getUserHistory` para manejar la lógica de obtención del historial
router.get("/history", verifyToken, getUserHistory);

export default router; // Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
