import { useState } from "react";

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState("jorge");
  const [email, setEmail] = useState("jorge@mail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) return setError("❌ El nombre es obligatorio.");
    if (!validateEmail(email)) return setError("❌ Email inválido.");
    if (password.trim().length < 6) return setError("❌ Contraseña muy corta.");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error("No se pudo registrar");

      const data = await res.json();
      localStorage.setItem("token", data.token); // Te loguea automáticamente
      if (onRegister) onRegister();
    } catch (err) {
      setError("❌ Error al registrar: correo ya usado o fallo de servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>📝 Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterForm;
