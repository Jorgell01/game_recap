const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registrarPartida = async ({ userId, gameName, playTime }) => {
  return await prisma.gameSession.create({
    data: {
      userId,
      gameName,
      playTime,
    },
  });
};

const obtenerHistorial = async (userId) => {
  return await prisma.gameSession.findMany({
    where: { userId },
    orderBy: { playedAt: "desc" },
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
}

const getUserStats = async (userId) => {
  // 1. Obtener todas las partidas del usuario
  const partidas = await prisma.gameSession.findMany({
    where: { userId }
  });

  if (partidas.length === 0) {
    return {
      totalGames: 0,
      totalPlayTime: 0,
      averageSessionTime: 0,
      favoriteGame: null
    };
  }

  // 2. Procesar estadísticas
  const totalPlayTime = partidas.reduce((acc, p) => acc + p.playTime, 0);
  const totalGames = partidas.length;
  const averageSessionTime = Math.round(totalPlayTime / totalGames);

  // 3. Calcular juego más jugado
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
    favoriteGame
  };
};

module.exports = {
  registrarPartida,
  getGameDataById,
  obtenerHistorial,
  getUserStats
};