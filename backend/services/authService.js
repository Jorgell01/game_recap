const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Base de datos
const prisma = require('../prisma/prismaClient');

const registerUser = async ({ username, email, password }) => {
  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) throw new Error("Usuario ya registrado");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      username: true,
      email: true
    }
  });

  return user;
};


const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw new Error("Credenciales incorrectas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales incorrectas");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    token
  };
};


module.exports = { registerUser, loginUser };
