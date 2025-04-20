import express from "express"; // Importa Express para manejar las rutas
import { register, login } from "../controllers/authController.js"; // Importa los controladores para registrar e iniciar sesión
import verifyToken from "../middleware/verifyToken.js"; // Importa el middleware para verificar el token JWT

const router = express.Router(); // Crea un enrutador de Express

// Ruta para registrar un nuevo usuario
// Llama al controlador `register` para manejar la lógica de registro
router.post("/register", register);

// Ruta para iniciar sesión
// Llama al controlador `login` para manejar la lógica de autenticación y generación de token
router.post("/login", login);

// 🔐 Ruta protegida para probar el token
// Utiliza el middleware `verifyToken` para verificar que el usuario esté autenticado
router.get("/profile", verifyToken, (req, res) => {
  // Si el token es válido, responde con un mensaje y los datos del usuario autenticado
  res.json({
    message: "Acceso permitido al perfil",
    user: req.user, // `req.user` contiene los datos del usuario extraídos del token
  });
});

export default router; // Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
