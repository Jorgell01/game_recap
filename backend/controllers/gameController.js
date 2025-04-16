import { getGameDataById, registrarPartida, obtenerHistorial } from "../services/gameService.js";
import { obtenerPartidasDesdeSteam } from "../services/steamSyncService.js";
import prisma from "../prisma/prismaClient.js";

// 🔍 Obtener información de un juego por ID
export const getGameInfo = async (req, res) => {
  try {
    const gameId = req.params.id;
    const gameData = await getGameDataById(gameId);
    res.json(gameData);
  } catch (error) {
    console.error("Error en getGameInfo:", error);
    res.status(500).json({ error: "Error al obtener los datos del juego" });
  }
};

// ➕ Crear partida manualmente
export const crearPartida = async (req, res) => {
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

// 📜 Obtener historial de partidas
export const getHistorial = async (req, res) => {
  try {
    const userId = req.user.id;
    const partidas = await obtenerHistorial(userId);
    res.json(partidas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial" });
  }
};

// 🔁 Sincronizar partidas desde Steam
export const sincronizarSteamPartidas = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.steamId) {
      return res.status(400).json({ error: "Usuario no tiene Steam vinculado" });
    }

    const partidasSteam = await obtenerPartidasDesdeSteam(user.steamId);
    const partidasGuardadas = [];

    for (const partida of partidasSteam) {
      if (partida.playtime_forever > 0) {
        const nueva = await registrarPartida({
          userId,
          gameName: partida.name,
          playTime: partida.playtime_forever,
        });
        partidasGuardadas.push(nueva);
      }
    }

    res.status(201).json({
      message: "✅ Partidas sincronizadas desde Steam",
      total: partidasGuardadas.length,
    });

  } catch (error) {
    console.error("❌ Error al sincronizar partidas desde Steam:", error);
    res.status(500).json({ error: "Error al sincronizar partidas desde Steam" });
  }
};
