import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Elimina todas las partidas asociadas a un usuario
 * @param {number} userId - ID del usuario en la base de datos (debe ser un entero)
 */
const resetHistorialUsuario = async (userId) => {
  try {
    const deleted = await prisma.gameSession.deleteMany({
      where: { userId },
    });

    console.log(`🧹 ${deleted.count} partidas eliminadas del usuario con ID: ${userId}`);
  } catch (error) {
    console.error("❌ Error al eliminar historial:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

// ✅ Cambia el ID por el del usuario que quieres limpiar
const userId = 3;  // Asegúrate de que sea un número entero
resetHistorialUsuario(userId);
