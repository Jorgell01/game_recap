import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // Inicializa el cliente de Prisma para interactuar con la base de datos

// Controlador para obtener los juegos favoritos del usuario
export const getFavoritesByUser = async (req, res) => {
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token

  try {
    // Busca todos los juegos favoritos del usuario en la base de datos, ordenados por fecha de creación (más recientes primero)
    const favoritos = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Devuelve la lista de favoritos como respuesta
    res.json(favoritos);
  } catch (err) {
    // Si ocurre un error, lo registra en la consola y responde con un error 500
    console.error("❌ Error al obtener favoritos:", err);
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
};

// Controlador para añadir un juego a favoritos
export const createFavorite = async (req, res) => {
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token
  const { gameId, gameName, coverUrl } = req.body; // Obtiene los datos del juego desde el cuerpo de la solicitud

  try {
    // Verifica si el juego ya está en favoritos para este usuario
    const exists = await prisma.favorite.findFirst({
      where: {
        userId,
        gameId: String(gameId), // Convierte el gameId a cadena para evitar problemas de tipo
      },
    });

    // Si el juego ya está en favoritos, responde con un error 409 (conflicto)
    if (exists) {
      return res.status(409).json({ message: "Ya está en favoritos" });
    }

    // Crea un nuevo registro en la tabla de favoritos con los datos proporcionados
    const nuevo = await prisma.favorite.create({
      data: {
        userId,
        gameId: String(gameId), // Convierte el gameId a cadena
        gameName,
        coverUrl,
      },
    });

    // Responde con un código 201 (creado) y los datos del nuevo favorito
    res.status(201).json(nuevo);
  } catch (err) {
    // Si ocurre un error, lo registra en la consola y responde con un error 500
    console.error("❌ Error al crear favorito:", err);
    res.status(500).json({ message: "Error al crear favorito" });
  }
};

// Controlador para eliminar un juego de favoritos
export const deleteFavorite = async (req, res) => {
  const userId = req.user.id; // Obtiene el ID del usuario autenticado desde el token
  const gameId = String(req.params.gameId); // Obtiene el ID del juego desde los parámetros de la URL y lo convierte a cadena

  try {
    // Busca el registro del juego en favoritos para este usuario
    const favorito = await prisma.favorite.findFirst({
      where: {
        userId,
        gameId,
      },
    });

    // Si no se encuentra el juego en favoritos, responde con un error 404 (no encontrado)
    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    // Elimina el registro del juego en favoritos
    await prisma.favorite.delete({ where: { id: favorito.id } });

    // Responde con un código 204 (sin contenido) para indicar que la operación fue exitosa
    res.status(204).end();
  } catch (err) {
    // Si ocurre un error, lo registra en la consola y responde con un error 500
    console.error("❌ Error al eliminar favorito:", err);
    res.status(500).json({ message: "Error al eliminar favorito" });
  }
};
