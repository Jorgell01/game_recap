const { getGameDataById } = require("../services/gameService");
const { registrarPartida } = require("../services/gameService");
const { obtenerHistorial } = require("../services/gameService");

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

const crearPartida = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameName, playTime } = req.body;

    const partida = await registrarPartida({ userId, gameName, playTime });

    res.status(201).json({
      message: "Partida guardada correctamente",
      partida,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHistorial = async (req, res) => {
  try {
    const userId = req.user.id;
    const partidas = await obtenerHistorial(userId);
    res.json(partidas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial" });
  }
};

module.exports = {
  getGameInfo,
  crearPartida,
  getHistorial
};
