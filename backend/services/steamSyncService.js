import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

// 🕹️ Obtener partidas desde la API de Steam
const obtenerPartidasDesdeSteam = async (steamId) => {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/",
      {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: steamId,
          include_appinfo: true,
          include_played_free_games: true,
          format: "json",
        },
      }
    );

    const juegos = response.data.response.games || [];
    return juegos.map((juego) => ({
      steamAppId: juego.appid,
      gameName: juego.name,
      playTime: juego.playtime_forever, // Tiempo en minutos
      lastPlayed: juego.rtime_last_played
        ? new Date(juego.rtime_last_played * 1000) // Convertir de Unix timestamp a Date
        : null, // Si no hay valor, asignar null
    }));
  } catch (error) {
    console.error("❌ Error al obtener partidas desde Steam:", error.message);
    return [];
  }
};

// 🔄 Sincronizar partidas automáticamente
const sincronizarPartidasSteam = async (user) => {
  if (!user.steamId) return;

  const partidas = await obtenerPartidasDesdeSteam(user.steamId);

  for (const juego of partidas) {
    const existente = await prisma.gameSession.findFirst({
      where: {
        userId: user.id,
        gameName: juego.gameName,
      },
    });

    const tiempoSteam = juego.playTime; // Tiempo en minutos
    const ultimaFechaJugado = juego.lastPlayed; // Fecha de última sesión

    if (
      !existente || 
      tiempoSteam > existente.playTime || 
      (ultimaFechaJugado && ultimaFechaJugado > existente.lastPlayed)
    ) {
      await prisma.gameSession.upsert({
        where: {
          userId_gameName: {
            userId: user.id,
            gameName: juego.gameName,
          },
        },
        update: {
          playTime: tiempoSteam,
          lastPlayed: ultimaFechaJugado,
        },
        create: {
          userId: user.id,
          gameName: juego.gameName,
          playTime: tiempoSteam,
          lastPlayed: ultimaFechaJugado,
        },
      });
    }
  }
};

// 🕹️ Mostrar la última sesión de un juego específico
const mostrarUltimaSesionJuego = async (steamId, gameName) => {
  try {
    const partidas = await obtenerPartidasDesdeSteam(steamId);

    const juego = partidas.find((juego) => juego.gameName === gameName);

    if (juego) {
      console.log(`🎮 Juego: ${juego.gameName}`);
      console.log(`🕒 Última sesión: ${juego.lastPlayed?.toLocaleString() || "No disponible"}`);
    } else {
      console.log(`❌ No se encontró información para el juego: ${gameName}`);
    }
  } catch (error) {
    console.error("❌ Error al mostrar la última sesión del juego:", error.message);
  }
};

export { obtenerPartidasDesdeSteam, sincronizarPartidasSteam, mostrarUltimaSesionJuego };
