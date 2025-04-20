import express from "express"; // Importa Express para manejar el servidor y las rutas
import cors from "cors"; // Importa CORS para permitir solicitudes desde otros dominios
import session from "express-session"; // Importa express-session para manejar sesiones
import passport from "passport"; // Importa Passport para manejar la autenticación
import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno
import configureSteamStrategy from "./passport/steamStrategy.js"; // Configura la estrategia de autenticación con Steam

// Rutas existentes
import authRoutes from "./routes/authRoutes.js"; // Rutas relacionadas con la autenticación
import userRoutes from "./routes/userRoutes.js"; // Rutas relacionadas con el usuario
import steamRoutes from "./routes/steamRoutes.js"; // Rutas relacionadas con Steam
import gameRoutes from "./routes/gameRoutes.js"; // Rutas relacionadas con juegos
import reviewRoutes from "./routes/reviewRoutes.js"; // Rutas relacionadas con reseñas
import favoriteRoutes from "./routes/favoriteRoutes.js"; // Rutas relacionadas con favoritos

// 🔧 Cargar variables de entorno
dotenv.config(); // Carga las variables de entorno desde el archivo `.env`

// 🛠️ Inicializar estrategia de Steam
configureSteamStrategy(); // Configura la estrategia de autenticación con Steam

const app = express(); // Crea una instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Define el puerto del servidor (por defecto 3000)

// Middlewares
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros dominios
app.use(express.json()); // Habilita el análisis de JSON en las solicitudes

// Configuración de sesiones
app.use(
  session({
    secret: "supersecretsteamlogin", // Clave secreta para firmar las sesiones
    resave: false, // No guarda la sesión si no se modifica
    saveUninitialized: true, // Guarda sesiones no inicializadas
  })
);

app.use(passport.initialize()); // Inicializa Passport para manejar la autenticación
app.use(passport.session()); // Habilita el manejo de sesiones con Passport

// Rutas
app.use("/api/auth", authRoutes); // Rutas para autenticación (registro e inicio de sesión)
app.use("/api/user", userRoutes); // Rutas para obtener datos del usuario
app.use("/api/auth", steamRoutes); // Rutas para autenticación con Steam
app.use("/api/game", gameRoutes); // Rutas para manejar juegos y partidas
app.use("/api/reviews", reviewRoutes); // Rutas para manejar reseñas de juegos
app.use("/api/favorites", favoriteRoutes); // Rutas para manejar juegos favoritos

// Ruta principal
app.get("/", (req, res) => {
  res.send("🎮 Game Recap API funcionando correctamente."); // Responde con un mensaje de bienvenida
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en http://localhost:${PORT}`); // Muestra un mensaje en la consola indicando que el servidor está activo
});
