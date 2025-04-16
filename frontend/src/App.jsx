import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HistorialPartidas from "./components/HistorialPartidas";
import LogoutButton from "./components/LogoutButton";
import Estadisticas from "./components/Estadisticas";

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
      window.history.replaceState({}, document.title, "/");
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

  // 🔁 Sincronización automática desde Steam
  const sincronizarSteam = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/game/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message} (${data.total} partidas añadidas)`);
        cargarDatosUsuario(); // recarga el historial actualizado
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      alert("❌ Error al sincronizar partidas desde Steam");
      console.error(error);
    }
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
          <button onClick={sincronizarSteam} style={{ marginBottom: "1rem" }}>
            🔄 Sincronizar partidas desde Steam
          </button>
          <HistorialPartidas historial={historial} />
          <Estadisticas usuarioStats={usuarioStats} />
        </>
      )}
    </div>
  );
}

export default App;
