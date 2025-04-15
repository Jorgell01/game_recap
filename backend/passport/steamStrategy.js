const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const prisma = require("../prisma/prismaClient");

function configureSteamStrategy() {
  console.log("✅ Steam strategy cargada");

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  });

  passport.use(
    new SteamStrategy(
      {
        returnURL: `${process.env.BASE_URL}/api/auth/steam/return`,
        realm: `${process.env.BASE_URL}/`,
        apiKey: process.env.STEAM_API_KEY,
      },
      async (identifier, profile, done) => {
        const steamId = profile.id;
        let user = await prisma.user.findUnique({ where: { steamId } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              steamId,
            },
          });
        }

        return done(null, user);
      }
    )
  );
}

module.exports = configureSteamStrategy;
