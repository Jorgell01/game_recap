const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Base de datos simulada temporal
const users = [];

const registerUser = async ({ username, email, password }) => {
  const userExists = users.find(u => u.email === email);
  if (userExists) throw new Error("Usuario ya registrado");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, email, password: hashedPassword };

  users.push(user);
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Credenciales incorrectas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales incorrectas");

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  return { user, token };
};

module.exports = { registerUser, loginUser };
