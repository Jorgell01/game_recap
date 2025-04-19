import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getFavoritesByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const favoritos = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(favoritos);
  } catch (err) {
    console.error("❌ Error al obtener favoritos:", err);
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
};

export const createFavorite = async (req, res) => {
  const userId = req.user.id;
  const { gameId, gameName, coverUrl } = req.body;

  try {
    const exists = await prisma.favorite.findFirst({
      where: {
        userId,
        gameId: String(gameId),
      },
    });

    if (exists) {
      return res.status(409).json({ message: "Ya está en favoritos" });
    }

    const nuevo = await prisma.favorite.create({
      data: {
        userId,
        gameId: String(gameId),
        gameName,
        coverUrl,
      },
    });

    res.status(201).json(nuevo);
  } catch (err) {
    console.error("❌ Error al crear favorito:", err);
    res.status(500).json({ message: "Error al crear favorito" });
  }
};

export const deleteFavorite = async (req, res) => {
  const userId = req.user.id;
  const gameId = String(req.params.gameId);

  try {
    const favorito = await prisma.favorite.findFirst({
      where: {
        userId,
        gameId,
      },
    });

    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    await prisma.favorite.delete({ where: { id: favorito.id } });

    res.status(204).end();
  } catch (err) {
    console.error("❌ Error al eliminar favorito:", err);
    res.status(500).json({ message: "Error al eliminar favorito" });
  }
};
