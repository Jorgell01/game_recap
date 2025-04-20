import bcrypt from "bcryptjs"; // Importa bcrypt para manejar el hash de contraseñas
import jwt from "jsonwebtoken"; // Importa JSON Web Token para generar y verificar tokens JWT
import prisma from "../prisma/prismaClient.js"; // Importa el cliente de Prisma para interactuar con la base de datos

// Función para registrar un nuevo usuario
const registerUser = async ({ username, email, password }) => {
  // Verifica si ya existe un usuario con el mismo email
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  // Si el usuario ya está registrado, lanza un error
  if (userExists) throw new Error("Usuario ya registrado");

  // Hashea la contraseña proporcionada por el usuario
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crea un nuevo usuario en la base de datos con los datos proporcionados
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword, // Guarda la contraseña hasheada
    },
    select: {
      id: true, // Devuelve el ID del usuario
      username: true, // Devuelve el nombre de usuario
      email: true, // Devuelve el email del usuario
    },
  });

  // Devuelve los datos del usuario recién creado
  return user;
};

// Función para iniciar sesión de un usuario
const loginUser = async ({ email, password }) => {
  // Busca al usuario en la base de datos por su email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Si el usuario no existe, lanza un error
  if (!user) throw new Error("Credenciales incorrectas");

  // Compara la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales incorrectas"); // Si no coinciden, lanza un error

  // Genera un token JWT con los datos del usuario
  const token = jwt.sign(
    { id: user.id, email: user.email }, // Payload del token
    process.env.JWT_SECRET, // Clave secreta para firmar el token
    { expiresIn: "1h" } // El token expira en 1 hora
  );

  // Devuelve los datos del usuario y el token generado
  return {
    user: {
      id: user.id, // ID del usuario
      username: user.username, // Nombre de usuario
      email: user.email, // Email del usuario
    },
    token, // Token JWT
  };
};

// Exporta las funciones para que puedan ser utilizadas en otros archivos
export { registerUser, loginUser };
