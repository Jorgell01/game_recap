import { PrismaClient } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos
import axios from "axios"; // Importa Axios para realizar solicitudes HTTP

const prisma = new PrismaClient(); // Crea una instancia del cliente de Prisma

// 🕹️ Obtener partidas desde la API de Steam
const obtenerPartidasDesdeSteam = async (steamId) => {
  try {
    // Realiza una solicitud HTTP a la API de Steam para obtener los juegos del usuario
    const response = await axios.get(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/",
      {
        params: {
          key: process.env.STEAM_API_KEY, // Clave de la API de Steam (almacenada en las variables de entorno)
          steamid: steamId, // ID de Steam del usuario
          include_appinfo: true, // Incluye información adicional de los juegos
          include_played_free_games: true, // Incluye juegos gratuitos jugados
          format: "json", // Formato de la respuesta
        },
      }
    );

    // Mapea los datos obtenidos para devolver un array con información relevante de los juegos
    const juegos = response.data.response.games || [];
    return juegos.map((juego) => ({
      steamAppId: juego.appid, // ID de la aplicación en Steam
      gameName: juego.name, // Nombre del juego
      playTime: juego.playtime_forever, // Tiempo jugado en minutos
      lastPlayed: juego.rtime_last_played
        ? new Date(juego.rtime_last_played * 1000) // Convierte el timestamp Unix a una fecha
        : null, // Si no hay valor, asigna null
    }));
  } catch (error) {
    // Si ocurre un error, lo registra en la consola y devuelve un array vacío
    console.error("❌ Error al obtener partidas desde Steam:", error.message);
    return [];
  }
};

// 🔄 Sincronizar partidas automáticamente
const sincronizarPartidasSteam = async (user) => {
  if (!user.steamId) return; // Si el usuario no tiene Steam vinculado, no hace nada

  // Obtiene las partidas desde Steam
  const partidas = await obtenerPartidasDesdeSteam(user.steamId);

  // Itera sobre cada juego obtenido desde Steam
  for (const juego of partidas) {
    // Busca si ya existe una sesión para este juego y usuario en la base de datos
    const existente = await prisma.gameSession.findFirst({
      where: {
        userId: user.id, // ID del usuario
        gameName: juego.gameName, // Nombre del juego
      },
    });

    const tiempoSteam = juego.playTime; // Tiempo jugado en minutos
    const ultimaFechaJugado = juego.lastPlayed; // Fecha de última sesión

    // Si no existe una sesión o si los datos de Steam son más recientes, actualiza o crea una nueva sesión
    if (
      !existente || 
      tiempoSteam > existente.playTime || 
      (ultimaFechaJugado && ultimaFechaJugado > existente.lastPlayed)
    ) {
      await prisma.gameSession.upsert({
        where: {
          userId_gameName: {
            userId: user.id, // ID del usuario
            gameName: juego.gameName, // Nombre del juego
          },
        },
        update: {
          playTime: tiempoSteam, // Actualiza el tiempo jugado
          lastPlayed: ultimaFechaJugado, // Actualiza la última fecha jugada
        },
        create: {
          userId: user.id, // Crea una nueva sesión con el ID del usuario
          gameName: juego.gameName, // Nombre del juego
          playTime: tiempoSteam, // Tiempo jugado
          lastPlayed: ultimaFechaJugado, // Última fecha jugada
        },
      });
    }
  }
};

// 🕹️ Mostrar la última sesión de un juego específico
const mostrarUltimaSesionJuego = async (steamId, gameName) => {
  try {
    // Obtiene las partidas desde Steam
    const partidas = await obtenerPartidasDesdeSteam(steamId);

    // Busca el juego específico en las partidas obtenidas
    const juego = partidas.find((juego) => juego.gameName === gameName);

    if (juego) {
      // Si el juego existe, muestra su información en la consola
      console.log(`🎮 Juego: ${juego.gameName}`);
      console.log(`🕒 Última sesión: ${juego.lastPlayed?.toLocaleString() || "No disponible"}`);
    } else {
      // Si no se encuentra el juego, muestra un mensaje de error
      console.log(`❌ No se encontró información para el juego: ${gameName}`);
    }
  } catch (error) {
    // Si ocurre un error, lo registra en la consola
    console.error("❌ Error al mostrar la última sesión del juego:", error.message);
  }
};

// Exporta las funciones para que puedan ser utilizadas en otros archivos
export { obtenerPartidasDesdeSteam, sincronizarPartidasSteam, mostrarUltimaSesionJuego };
