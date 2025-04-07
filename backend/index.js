const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Importar ruta de juegos
const gameRoutes = require("./routes/gameRoutes");
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("🎮 Game Recap API funcionando correctamente.");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en http://localhost:${PORT}`);
});
