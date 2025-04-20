import { PrismaClient } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient(); // Crea una instancia del cliente de Prisma

/**
 * Elimina todas las partidas asociadas a un usuario
 * @param {number} userId - ID del usuario en la base de datos (debe ser un entero)
 */
const resetHistorialUsuario = async (userId) => {
  try {
    // Elimina todas las sesiones de juego asociadas al usuario con el ID proporcionado
    const deleted = await prisma.gameSession.deleteMany({
      where: { userId }, // Filtra las sesiones por el ID del usuario
    });

    // Muestra en la consola cuántas partidas fueron eliminadas
    console.log(`🧹 ${deleted.count} partidas eliminadas del usuario con ID: ${userId}`);
  } catch (error) {
    // Si ocurre un error, lo registra en la consola
    console.error("❌ Error al eliminar historial:", error.message);
  } finally {
    // Cierra la conexión con la base de datos
    await prisma.$disconnect();
  }
};

// ✅ Cambia el ID por el del usuario que quieres limpiar
const userId = 3; // Asegúrate de que sea un número entero
resetHistorialUsuario(userId); // Llama a la función para eliminar el historial del usuario con el ID especificado
