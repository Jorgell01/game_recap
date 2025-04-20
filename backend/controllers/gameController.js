import { getGameDataById, registrarPartida, obtenerHistorial } from "../services/gameService.js";
import { obtenerPartidasDesdeSteam } from "../services/steamSyncService.js";
import prisma from "../prisma/prismaClient.js";

// 🔍 Obtener información de un juego por ID
export const getGameInfo = async (req, res) => {
  try {
    const gameId = req.params.id; // Obtiene el ID del juego desde los parámetros de la URL
    const gameData = await getGameDataById(gameId); // Llama al servicio para obtener los datos del juego
    res.json(gameData); // Devuelve los datos del juego como respuesta
  } catch (error) {
    console.error("Error en getGameInfo:", error); // Registra el error en la consola
    res.status(500).json({ error: "Error al obtener los datos del juego" }); // Responde con un error 500 si algo falla
  }
};

// ➕ Crear partida manualmente
export const crearPartida = async (req, res) => {
  try {
    const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token
    const { gameName, playTime } = req.body; // Obtiene el nombre del juego y el tiempo jugado desde el cuerpo de la solicitud

    // Llama al servicio para registrar una nueva partida
    const partida = await registrarPartida({ userId, gameName, playTime });

    // Responde con un código 201 (creado) y los datos de la partida registrada
    res.status(201).json({
      message: "Partida guardada correctamente",
      partida,
    });
  } catch (error) {
    res.status(400).json({ error: error.message }); // Responde con un error 400 si algo falla
  }
};

// 📜 Obtener historial de partidas
export const getHistorial = async (req, res) => {
  try {
    const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token
    const partidas = await obtenerHistorial(userId); // Llama al servicio para obtener el historial de partidas del usuario
    res.json(partidas); // Devuelve el historial de partidas como respuesta
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial" }); // Responde con un error 500 si algo falla
  }
};

// 🔁 Sincronizar partidas desde Steam
export const sincronizarSteamPartidas = async (req, res) => {
  try {
    const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token

    // Busca al usuario en la base de datos para verificar si tiene Steam vinculado
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.steamId) {
      return res.status(400).json({ error: "Usuario no tiene Steam vinculado" }); // Responde con un error 400 si no hay Steam vinculado
    }

    // Llama al servicio para obtener las partidas desde Steam
    const partidasSteam = await obtenerPartidasDesdeSteam(user.steamId);
    const partidasGuardadas = []; // Array para almacenar las partidas sincronizadas

    // Itera sobre las partidas obtenidas desde Steam
    for (const partida of partidasSteam) {
      if (partida.playtime_forever > 0) { // Solo sincroniza partidas con tiempo jugado mayor a 0
        const nueva = await registrarPartida({
          userId,
          gameName: partida.name,
          playTime: partida.playtime_forever,
        });
        partidasGuardadas.push(nueva); // Agrega la partida sincronizada al array
      }
    }

    // Responde con un código 201 (creado) y el total de partidas sincronizadas
    res.status(201).json({
      message: "✅ Partidas sincronizadas desde Steam",
      total: partidasGuardadas.length,
    });

  } catch (error) {
    console.error("❌ Error al sincronizar partidas desde Steam:", error); // Registra el error en la consola
    res.status(500).json({ error: "Error al sincronizar partidas desde Steam" }); // Responde con un error 500 si algo falla
  }
};
