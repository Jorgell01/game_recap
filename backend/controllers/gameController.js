const { getGameDataById } = require("../services/gameService");

const getGameInfo = async (req, res) => {
  try {
    const gameId = req.params.id;
    const gameData = await getGameDataById(gameId);
    res.json(gameData);
  } catch (error) {
    console.error("Error en gameController:", error);
    res.status(500).json({ error: "Error al obtener los datos del juego" });
  }
};

module.exports = { getGameInfo };

