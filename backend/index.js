const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar ruta de juegos
const gameRoutes = require("./routes/gameRoutes");
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("🎮 Game Recap API funcionando correctamente.");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en http://localhost:${PORT}`);
});
