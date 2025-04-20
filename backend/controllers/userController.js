import { getUserStats } from "../services/gameService.js"; // Importa la función para obtener estadísticas del usuario
import { PrismaClient } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos

const prisma = new PrismaClient(); // Inicializa el cliente de Prisma

// Obtener el perfil del usuario autenticado
export const getProfile = (req, res) => {
  // Devuelve un mensaje con los datos del usuario autenticado (extraídos del token)
  res.json({
    message: "Perfil del usuario",
    user: req.user, // `req.user` contiene los datos del usuario autenticado
  });
};

// Obtener estadísticas del usuario
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token

    // Llama al servicio para obtener las estadísticas del usuario
    const stats = await getUserStats(userId);

    // Devuelve las estadísticas como respuesta
    res.json(stats);
  } catch (error) {
    // Si ocurre un error, responde con un código 500 (error interno del servidor)
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

// Obtener el historial de partidas del usuario
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token

    // Busca todas las sesiones de juego del usuario en la base de datos, ordenadas por la última vez jugada (descendente)
    const history = await prisma.gameSession.findMany({
      where: { userId }, // Filtra las sesiones por el ID del usuario
      orderBy: { lastPlayed: "desc" }, // Ordena las sesiones por la fecha de la última vez jugada
    });

    // Devuelve el historial de partidas como respuesta
    res.json(history);
  } catch (error) {
    // Si ocurre un error, lo registra en la consola y responde con un código 500 (error interno del servidor)
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ error: "No se pudo obtener el historial de partidas" });
  }
};
