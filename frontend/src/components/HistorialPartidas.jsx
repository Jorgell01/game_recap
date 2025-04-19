// src/components/HistorialPartidas.jsx
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HistorialPartidas.css";

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const HistorialPartidas = () => {
  const { theme } = useTheme();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchHistorial = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const agrupado = {};
        data.forEach(({ gameName, playTime, lastPlayed }) => {
          if (!agrupado[gameName]) {
            agrupado[gameName] = {
              name: gameName,
              totalHours: 0,
              lastSession: lastPlayed,
            };
          }
          agrupado[gameName].totalHours += playTime;
        });

        const juegos = Object.values(agrupado).slice(0, 100);

        const enriquecido = await Promise.all(
          juegos.map(async (juego) => {
            const res = await fetch(
              `https://api.rawg.io/api/games?search=${encodeURIComponent(juego.name)}&key=${RAWG_API_KEY}`
            );
            const rawg = await res.json();
            const match = rawg.results?.[0];
            return {
              ...juego,
              id: match?.id || null,
              totalHours: juego.totalHours > 0 ? (juego.totalHours / 60).toFixed(1) : "0",
              image: match?.background_image || null,
            };
          })
        );

        setTimeout(() => {
          setHistorial(enriquecido);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error("❌ Error al cargar historial:", err.message);
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div
      className="historial-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424",
        color: theme === "light" ? "var(--color-text)" : "#ffffff",
      }}
    >
      <h2>🕹️ Historial de Partidas</h2>

      {loading ? (
        <p className="historial-loading">⏳ Cargando historial...</p>
      ) : (
        <div className="historial-grid">
          {historial.map((juego, index) => (
            <div
              key={index}
              className={`historial-card ${juego.lastSession ? "" : "no-jugado"}`}
              onClick={() => juego.id && navigate(`/dashboard/community/${juego.id}`)}
              style={{ cursor: juego.id ? "pointer" : "default" }}
            >
              {juego.image && <img src={juego.image} alt={juego.name} />}
              <div className="historial-info">
                <h3>{juego.name}</h3>
                <p><strong>Tiempo jugado:</strong> {juego.totalHours} horas</p>
                <p>
                  <strong>Última sesión:</strong>{" "}
                  {juego.lastSession
                    ? new Date(juego.lastSession).toLocaleDateString()
                    : "No jugado"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialPartidas;
