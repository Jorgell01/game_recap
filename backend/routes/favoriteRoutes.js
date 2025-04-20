import express from "express"; // Importa Express para manejar las rutas
import {
  getFavoritesByUser, // Controlador para obtener los juegos favoritos del usuario
  createFavorite, // Controlador para añadir un juego a favoritos
  deleteFavorite, // Controlador para eliminar un juego de favoritos
} from "../controllers/favoriteController.js"; // Importa los controladores relacionados con favoritos
import verifyToken from "../middleware/verifyToken.js"; // Importa el middleware para verificar el token JWT

const router = express.Router(); // Crea un enrutador de Express

// Ruta para obtener los juegos favoritos del usuario autenticado
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `getFavoritesByUser` para manejar la lógica de obtención de favoritos
router.get("/", verifyToken, getFavoritesByUser);

// Ruta para añadir un juego a favoritos
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `createFavorite` para manejar la lógica de creación de favoritos
router.post("/", verifyToken, createFavorite);

// Ruta para eliminar un juego de favoritos
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `deleteFavorite` para manejar la lógica de eliminación de favoritos
router.delete("/:gameId", verifyToken, deleteFavorite);

export default router; // Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
