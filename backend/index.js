const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./passport/steamStrategy"); // 👈 Importa la configuración de Steam

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
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const steamRoutes = require("./routes/steamRoutes");
const gameRoutes = require("./routes/gameRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", steamRoutes); // 👈 Rutas de Steam login
app.use("/api/game", gameRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🎮 Game Recap API funcionando correctamente.");
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en http://localhost:${PORT}`);
});
