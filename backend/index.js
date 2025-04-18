import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import configureSteamStrategy from "./passport/steamStrategy.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import steamRoutes from "./routes/steamRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import comparativaRoutes from "./routes/comparativaRoutes.js";

// 🔧 Cargar variables de entorno
dotenv.config();

// 🛠️ Inicializar estrategia de Steam
configureSteamStrategy();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "supersecretsteamlogin",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", steamRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/comparativa", comparativaRoutes);

app.get("/", (req, res) => {
  res.send("🎮 Game Recap API funcionando correctamente.");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en http://localhost:${PORT}`);
});
