import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HistorialPartidas from "./components/HistorialPartidas";
import LogoutButton from "./components/LogoutButton";
import Estadisticas from "./components/Estadisticas";
import AddSessionForm from "./components/AddSessionForm";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [historial, setHistorial] = useState([]);
  const [usuarioStats, setUsuarioStats] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // 🔍 Detecta token desde la URL si viene de Steam
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, "/"); // limpia la URL
    }
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [resHistorial, resStats] = await Promise.all([
        fetch("http://localhost:3000/api/user/history", { headers }),
        fetch("http://localhost:3000/api/user/stats", { headers }),
      ]);

      if (!resHistorial.ok || !resStats.ok) {
        throw new Error("Error cargando datos del usuario");
      }

      const dataHistorial = await resHistorial.json();
      const dataStats = await resStats.json();

      setHistorial(dataHistorial);
      setUsuarioStats(dataStats);
    } catch (err) {
      console.error("❌ Error al cargar datos:", err.message);
    }
  };

  useEffect(() => {
    if (token) {
      cargarDatosUsuario();
    }
  }, [token]);

  const handleLogin = () => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setHistorial([]);
    setUsuarioStats(null);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎮 Game Recap</h1>

      {!token ? (
        <>
          {mostrarRegistro ? (
            <>
              <RegisterForm onRegister={handleLogin} />
              <p>
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => setMostrarRegistro(false)}>
                  Iniciar sesión
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLogin={handleLogin} />
              <p>
                ¿No tienes cuenta?{" "}
                <button onClick={() => setMostrarRegistro(true)}>
                  Registrarse
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <LogoutButton onLogout={handleLogout} />
          <HistorialPartidas historial={historial} />
          <Estadisticas usuarioStats={usuarioStats} />
          <AddSessionForm onSessionAdded={cargarDatosUsuario} />
        </>
      )}
    </div>
  );
}

export default App;
