import { useState } from "react";
import toast from "react-hot-toast";
import "../components/LoginForm.css";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success("¡Sesión iniciada!");
      onLogin?.();
    } catch (err) {
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Iniciar sesión</button>

      <hr style={{ margin: "1rem 0", borderColor: "var(--color-card)" }} />

      <button
        type="button"
        className="steam-button"
        onClick={() => {
          window.location.href = "http://localhost:3000/api/auth/steam";
        }}
      >
        🎮 Iniciar sesión con Steam
      </button>
    </form>
  );
};

export default LoginForm;
