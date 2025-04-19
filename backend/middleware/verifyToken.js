import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "mi_secreto", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    // Guarda todo el payload como req.user
    req.user = decoded;
    next();
  });
};

export default verifyToken;
