import { getUserStats } from "../services/gameService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = (req, res) => {
  res.json({
    message: "Perfil del usuario",
    user: req.user
  });
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getUserStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { lastPlayed: 'desc' }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el historial de partidas" });
  }
};
