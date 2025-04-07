const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };
