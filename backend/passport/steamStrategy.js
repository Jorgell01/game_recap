import passport from "passport"; // Importa la librería Passport para la autenticación
import { Strategy as SteamStrategy } from "passport-steam"; // Importa la estrategia de autenticación de Steam
import prisma from "../prisma/prismaClient.js"; // Importa el cliente de Prisma para interactuar con la base de datos

// Configura la estrategia de autenticación con Steam
function configureSteamStrategy() {
  // Serializa el usuario para almacenarlo en la sesión
  passport.serializeUser((user, done) => {
    done(null, user.id); // Guarda el ID del usuario en la sesión
  });

  // Deserializa el usuario desde la sesión
  passport.deserializeUser(async (id, done) => {
    // Busca al usuario en la base de datos utilizando el ID almacenado en la sesión
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); // Devuelve el usuario encontrado
  });

  // Configura la estrategia de Steam
  passport.use(
    new SteamStrategy(
      {
        // URL a la que Steam redirige después de la autenticación
        returnURL: `${process.env.BASE_URL}/api/auth/steam/return`,
        // Dominio de la aplicación
        realm: `${process.env.BASE_URL}/`,
        // Clave de la API de Steam (almacenada en las variables de entorno)
        apiKey: process.env.STEAM_API_KEY,
      },
      // Callback que se ejecuta después de la autenticación exitosa
      async (identifier, profile, done) => {
        const steamId = profile.id; // Obtiene el ID de Steam del perfil autenticado

        // Busca al usuario en la base de datos utilizando el ID de Steam
        let user = await prisma.user.findUnique({ where: { steamId } });

        // Si el usuario no existe, lo crea en la base de datos
        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName, // Nombre de usuario obtenido del perfil de Steam
              steamId, // ID de Steam
            },
          });
        }

        // Devuelve el usuario (existente o recién creado)
        return done(null, user);
      }
    )
  );
}

export default configureSteamStrategy; // Exporta la función para configurar la estrategia de Steam
