import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las reseñas para un juego específico
export const getReviewsByGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { gameId },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error("❌ Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// Crear una nueva reseña
export const createReview = async (req, res) => {
  const userId = req.user.id;
  const { gameId, rating, comment } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const nuevaReview = await prisma.review.create({
      data: {
        userId,
        gameId: String(gameId),
        username: user.username || "Anónimo",
        rating: Number(rating),
        comment,
      },
    });

    res.status(201).json(nuevaReview);
  } catch (error) {
    console.error("❌ Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

// Eliminar una reseña (opcional, para usuario propietario o admins)
export const deleteReview = async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;

  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
    });

    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: "No autorizado para eliminar esta reseña" });
    }

    await prisma.review.delete({ where: { id: Number(reviewId) } });

    res.status(204).end();
  } catch (error) {
    console.error("❌ Error al eliminar reseña:", error);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};
