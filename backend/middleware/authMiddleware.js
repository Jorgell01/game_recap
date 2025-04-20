import jwt from "jsonwebtoken"; // Importa la librería JSON Web Token para manejar tokens JWT

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Obtiene el encabezado de autorización de la solicitud

  // Verifica si el encabezado de autorización no existe o no comienza con "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" }); // Responde con un error 401 (no autorizado) si no hay token
  }

  // Extrae el token del encabezado de autorización
  const token = authHeader.split(" ")[1];

  try {
    // Verifica el token utilizando la clave secreta definida en las variables de entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token es válido, guarda la información del usuario decodificada en `req.user`
    req.user = decoded;

    // Llama a `next()` para pasar el control al siguiente middleware o controlador
    next();
  } catch (error) {
    // Si el token no es válido, responde con un error 401 (no autorizado)
    res.status(401).json({ error: "Token inválido" });
  }
};

export default authMiddleware; // Exporta el middleware para usarlo en las rutas protegidas
