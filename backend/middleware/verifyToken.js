import jwt from "jsonwebtoken"; // Importa la librería JSON Web Token para manejar tokens JWT

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  // Obtiene el encabezado de autorización de la solicitud
  const authHeader = req.headers["authorization"];

  // Extrae el token del encabezado de autorización (formato esperado: "Bearer <token>")
  const token = authHeader && authHeader.split(" ")[1];

  // Si no se proporciona un token, responde con un error 401 (no autorizado)
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // Verifica el token utilizando la clave secreta definida en las variables de entorno o un valor por defecto
  jwt.verify(token, process.env.JWT_SECRET || "mi_secreto", (err, decoded) => {
    // Si el token es inválido o ha expirado, responde con un error 403 (prohibido)
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    // Si el token es válido, guarda el payload decodificado en `req.user`
    req.user = decoded;

    // Llama a `next()` para pasar el control al siguiente middleware o controlador
    next();
  });
};

export default verifyToken; // Exporta el middleware para usarlo en rutas protegidas
