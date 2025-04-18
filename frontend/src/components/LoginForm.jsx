import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("jorge@mail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) return setError("❌ El email no tiene un formato válido.");
    if (password.trim() === "") return setError("❌ La contraseña no puede estar vacía.");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("❌ Credenciales inválidas o servidor no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Correo electrónico</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Conectando..." : "Iniciar sesión"}
        </button>

        <hr style={styles.divider} />

        <a href="http://localhost:3000/api/auth/steam" style={{ textAlign: "center" }}>
          <button type="button" style={{ ...styles.button, backgroundColor: "#FF5722" }}>
            🚀 Iniciar sesión con Steam
          </button>
        </a>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontFamily: "var(--font-body)",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "var(--font-body)",
  },
  button: {
    backgroundColor: "#2A5CAA",
    color: "white",
    padding: "0.75rem 1.2rem",
    borderRadius: "8px",
    fontWeight: "600",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "#E91E63",
    fontSize: "0.95rem",
    fontWeight: "bold",
  },
  divider: {
    margin: "1.5rem 0",
    borderTop: "1px solid #ddd",
  },
};

export default LoginForm;
