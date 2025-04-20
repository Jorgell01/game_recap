import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Inicializa el cliente de Prisma para interactuar con la base de datos

// Obtener todas las reseñas para un juego específico
export const getReviewsByGame = async (req, res) => {
  const { gameId } = req.params; // Obtiene el ID del juego desde los parámetros de la URL

  try {
    // Busca todas las reseñas asociadas al juego en la base de datos, ordenadas por fecha de creación (más recientes primero)
    const reviews = await prisma.review.findMany({
      where: { gameId },
      orderBy: { createdAt: "desc" },
    });

    // Devuelve las reseñas como respuesta
    res.json(reviews);
  } catch (error) {
    // Si ocurre un error, lo registra en la consola y responde con un error 500
    console.error("❌ Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// Crear una nueva reseña
export const createReview = async (req, res) => {
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token
  const { gameId, rating, comment } = req.body; // Obtiene los datos de la reseña desde el cuerpo de la solicitud

  try {
    // Busca al usuario en la base de datos para verificar que existe
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Si el usuario no existe, responde con un error 404 (no encontrado)
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crea una nueva reseña en la base de datos con los datos proporcionados
    const nuevaReview = await prisma.review.create({
      data: {
        userId,
        gameId: String(gameId), // Convierte el gameId a cadena para evitar problemas de tipo
        username: user.username || "Anónimo", // Usa el nombre de usuario o "Anónimo" si no está disponible
        rating: Number(rating), // Convierte la calificación a número
        comment, // Comentario de la reseña
      },
    });

    // Responde con un código 201 (creado) y los datos de la nueva reseña
    res.status(201).json(nuevaReview);
  } catch (error) {
    // Si ocurre un error, lo registra en la consola y responde con un error 500
    console.error("❌ Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

// Eliminar una reseña (opcional, para usuario propietario o admins)
export const deleteReview = async (req, res) => {
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token
  const { reviewId } = req.params; // Obtiene el ID de la reseña desde los parámetros de la URL

  try {
    // Busca la reseña en la base de datos por su ID
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) }, // Convierte el reviewId a número
    });

    // Si la reseña no existe, responde con un error 404 (no encontrado)
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    // Verifica si el usuario autenticado es el propietario de la reseña
    if (review.userId !== userId) {
      return res.status(403).json({ message: "No autorizado para eliminar esta reseña" }); // Responde con un error 403 (prohibido) si no es el propietario
    }

    // Elimina la reseña de la base de datos
    await prisma.review.delete({ where: { id: Number(reviewId) } });

    // Responde con un código 204 (sin contenido) para indicar que la operación fue exitosa
    res.status(204).end();
  } catch (error) {
    // Si ocurre un error, lo registra en la consola y responde con un error 500
    console.error("❌ Error al eliminar reseña:", error);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};
