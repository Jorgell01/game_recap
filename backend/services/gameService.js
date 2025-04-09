const prisma = require("../prisma/prismaClient");

const registrarPartida = async ({ userId, gameName, playTime }) => {
  const session = await prisma.gameSession.create({
    data: {
      userId,
      gameName,
      playTime
    }
  });
  return session;
};

module.exports = { registrarPartida };
