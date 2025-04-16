import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const registrarPartida = async ({ userId, gameName, playTime }) => {
  return await prisma.gameSession.create({
    data: {
      userId,
      gameName,
      playTime, // minutos reales
    },
  });
};

const obtenerHistorial = async (userId) => {
  return await prisma.gameSession.findMany({
    where: { userId },
    orderBy: { lastPlayed: "desc" },
  });
};

const getGameDataById = async (gameId) => {
  const gameData = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      sessions: true,
    },
  });

  if (!gameData) {
    throw new Error("Game not found");
  }

  return gameData;
};

const getUserStats = async (userId) => {
  const partidas = await prisma.gameSession.findMany({
    where: { userId },
  });

  if (partidas.length === 0) {
    return {
      totalGames: 0,
      totalPlayTime: 0,
      averageSessionTime: 0,
      favoriteGame: null,
    };
  }

  const totalPlayTime = partidas.reduce((acc, p) => acc + p.playTime, 0); // en minutos
  const totalGames = partidas.length;
  const averageSessionTime = Math.round(totalPlayTime / totalGames); // también en minutos

  const playTimeByGame = {};
  partidas.forEach(({ gameName, playTime }) => {
    playTimeByGame[gameName] = (playTimeByGame[gameName] || 0) + playTime;
  });

  const favoriteGame = Object.entries(playTimeByGame).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    totalGames,
    totalPlayTime,
    averageSessionTime,
    favoriteGame,
  };
};

const obtenerJuegosDesdeSteam = async (steamId) => {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;

  const response = await axios.get(url);
  return response.data.response.games || [];
};

const sincronizarPartidasSteam = async (user) => {
  if (!user.steamId) return;

  const partidas = await obtenerPartidasDesdeSteam(user.steamId);

  for (const juego of partidas) {
    const existente = await prisma.gameSession.findFirst({
      where: {
        userId: user.id,
        gameName: juego.gameName,
      },
      orderBy: {
        lastPlayed: "desc", // Aquí ya usamos lastPlayed
      },
    });

    const tiempoSteam = juego.playtime_forever; // minutos
    const ultimaFechaJugado = new Date(juego.last_played * 1000); // Convierte de timestamp de Steam

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

export {
  registrarPartida,
  getGameDataById,
  obtenerHistorial,
  getUserStats,
  obtenerJuegosDesdeSteam,
  sincronizarPartidasSteam,
};
