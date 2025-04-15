const { getUserStats } = require("../services/gameService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getProfile = (req, res) => {
  res.json({
    message: "Perfil del usuario",
    user: req.user
  });
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getUserStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el historial de partidas" });
  }
};

module.exports = { getProfile, getStats, getUserHistory };

