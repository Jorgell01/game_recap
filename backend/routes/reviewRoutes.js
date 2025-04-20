import express from "express"; // Importa Express para manejar las rutas
import {
  getReviewsByGame, // Controlador para obtener todas las reseñas de un juego específico
  createReview, // Controlador para crear una nueva reseña
  deleteReview, // Controlador para eliminar una reseña
} from "../controllers/reviewController.js"; // Importa los controladores relacionados con las reseñas
import verifyToken from "../middleware/verifyToken.js"; // Importa el middleware para verificar el token JWT

const router = express.Router(); // Crea un enrutador de Express

// Ruta para obtener todas las reseñas de un juego específico
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `getReviewsByGame` para manejar la lógica de obtención de reseñas
router.get("/:gameId", verifyToken, getReviewsByGame);

// Ruta para crear una nueva reseña
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `createReview` para manejar la lógica de creación de reseñas
router.post("/", verifyToken, createReview);

// Ruta para eliminar una reseña específica
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
// Llama al controlador `deleteReview` para manejar la lógica de eliminación de reseñas
router.delete("/:reviewId", verifyToken, deleteReview);

export default router; // Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
