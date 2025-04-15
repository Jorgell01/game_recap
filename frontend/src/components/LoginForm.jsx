import { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("jorge@mail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateEmail(email)) {
      return setError("❌ El email no tiene un formato válido.");
    }

    if (password.trim() === "") {
      return setError("❌ La contraseña no puede estar vacía.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setSuccess(true);
      if (onLogin) onLogin();
    } catch (err) {
      setError("❌ Credenciales inválidas o servidor no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>🔐 Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? "Conectando..." : "Iniciar sesión"}
        </button>
      </form>

      {success && <p style={{ color: "green" }}>✅ ¡Sesión iniciada!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr style={{ marginTop: "2rem", marginBottom: "1rem" }} />

      <a href="http://localhost:3000/api/auth/steam">
        <button type="button">🚀 Iniciar sesión con Steam</button>
      </a>
    </div>
  );
};

export default LoginForm;
