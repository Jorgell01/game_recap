import { PrismaClient } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos
import axios from "axios"; // Importa Axios para realizar solicitudes HTTP

const prisma = new PrismaClient(); // Crea una instancia del cliente de Prisma

// Función para registrar una nueva partida manualmente
const registrarPartida = async ({ userId, gameName, playTime }) => {
  return await prisma.gameSession.create({
    data: {
      userId, // ID del usuario que jugó la partida
      gameName, // Nombre del juego
      playTime, // Tiempo jugado en minutos
    },
  });
};

// Función para obtener el historial de partidas de un usuario
const obtenerHistorial = async (userId) => {
  return await prisma.gameSession.findMany({
    where: { userId }, // Filtra las partidas por el ID del usuario
    orderBy: { lastPlayed: "desc" }, // Ordena las partidas por la última vez jugada (descendente)
  });
};

// Función para obtener información de un juego por su ID
const getGameDataById = async (gameId) => {
  const gameData = await prisma.game.findUnique({
    where: { id: gameId }, // Busca el juego por su ID
    include: {
      sessions: true, // Incluye las sesiones asociadas al juego
    },
  });

  if (!gameData) {
    throw new Error("Game not found"); // Lanza un error si el juego no existe
  }

  return gameData; // Devuelve los datos del juego
};

// Función para obtener estadísticas de un usuario
const getUserStats = async (userId) => {
  const partidas = await prisma.gameSession.findMany({
    where: { userId }, // Filtra las partidas por el ID del usuario
  });

  if (partidas.length === 0) {
    // Si no hay partidas, devuelve estadísticas vacías
    return {
      totalGames: 0,
      totalPlayTime: 0,
      averageSessionTime: 0,
      favoriteGame: null,
    };
  }

  // Calcula el tiempo total jugado
  const totalPlayTime = partidas.reduce((acc, p) => acc + p.playTime, 0); // en minutos
  const totalGames = partidas.length; // Número total de juegos
  const averageSessionTime = Math.round(totalPlayTime / totalGames); // Tiempo promedio por sesión (en minutos)

  // Calcula el juego favorito (el más jugado)
  const playTimeByGame = {};
  partidas.forEach(({ gameName, playTime }) => {
    playTimeByGame[gameName] = (playTimeByGame[gameName] || 0) + playTime;
  });

  const favoriteGame = Object.entries(playTimeByGame).sort(
    (a, b) => b[1] - a[1] // Ordena por tiempo jugado (descendente)
  )[0][0];

  return {
    totalGames,
    totalPlayTime,
    averageSessionTime,
    favoriteGame,
  };
};

// Función para obtener los juegos de un usuario desde Steam
const obtenerJuegosDesdeSteam = async (steamId) => {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;

  const response = await axios.get(url); // Realiza una solicitud HTTP a la API de Steam
  return response.data.response.games || []; // Devuelve los juegos obtenidos o un array vacío
};

// Función para sincronizar partidas desde Steam
const sincronizarPartidasSteam = async (user) => {
  if (!user.steamId) return; // Si el usuario no tiene Steam vinculado, no hace nada

  const partidas = await obtenerJuegosDesdeSteam(user.steamId); // Obtiene las partidas desde Steam

  for (const juego of partidas) {
    // Busca si ya existe una sesión para este juego y usuario
    const existente = await prisma.gameSession.findFirst({
      where: {
        userId: user.id,
        gameName: juego.gameName,
      },
      orderBy: {
        lastPlayed: "desc", // Ordena por la última vez jugada
      },
    });

    const tiempoSteam = juego.playtime_forever; // Tiempo jugado en minutos
    const ultimaFechaJugado = new Date(juego.last_played * 1000); // Convierte el timestamp de Steam a una fecha

    // Si no existe una sesión o el tiempo jugado en Steam es mayor, crea una nueva sesión
    if (!existente || tiempoSteam > existente.playTime) {
      await prisma.gameSession.create({
        data: {
          userId: user.id,
          gameName: juego.gameName,
          playTime: tiempoSteam,
          lastPlayed: ultimaFechaJugado, // Asigna la última fecha jugada de Steam
        },
      });
    }
  }
};

// Exporta las funciones para que puedan ser utilizadas en otros archivos
export {
  registrarPartida,
  getGameDataById,
  obtenerHistorial,
  getUserStats,
  obtenerJuegosDesdeSteam,
  sincronizarPartidasSteam,
};
