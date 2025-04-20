// Importa las funciones de servicio para registrar e iniciar sesión desde el archivo authService.js
import { registerUser, loginUser } from "../services/authService.js";

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    // Llama a la función registerUser con los datos enviados en el cuerpo de la solicitud (req.body)
    const user = await registerUser(req.body);

    // Si el registro es exitoso, responde con un código 201 (creado) y un mensaje de éxito junto con los datos del usuario
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    // Si ocurre un error, responde con un código 400 (solicitud incorrecta) y el mensaje de error
    res.status(400).json({ error: error.message });
  }
};

// Controlador para iniciar sesión
export const login = async (req, res) => {
  try {
    // Llama a la función loginUser con los datos enviados en el cuerpo de la solicitud (req.body)
    const result = await loginUser(req.body);

    // Si el inicio de sesión es exitoso, responde con un código 200 (OK) y los datos del resultado (por ejemplo, token JWT)
    res.status(200).json(result);
  } catch (error) {
    // Si ocurre un error (por ejemplo, credenciales incorrectas), responde con un código 401 (no autorizado) y el mensaje de error
    res.status(401).json({ error: error.message });
  }
};
