
import { useEffect, useState } from "react";
import "./HistorialPartidas.css";

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const HistorialPartidas = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchHistorial = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // Agrupar datos por juego
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

        const juegos = Object.values(agrupado).slice(0, 100); // Puedes aumentar o quitar el límite

        // Añadir portada desde RAWG
        const enriquecido = await Promise.all(
          juegos.map(async (juego) => {
            const res = await fetch(
              `https://api.rawg.io/api/games?search=${encodeURIComponent(juego.name)}&key=${RAWG_API_KEY}`
            );
            const rawg = await res.json();
            const cover = rawg.results?.[0]?.background_image || null;
            return {
              ...juego,
              totalHours: juego.totalHours > 0 ? (juego.totalHours / 60).toFixed(1) : "0",
              image: cover,
            };
          })
        );

        setHistorial(enriquecido);
      } catch (err) {
        console.error("❌ Error al cargar historial:", err.message);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="historial-container">
      <h2>🕹️ Historial de Partidas</h2>
      <div className="historial-grid">
        {historial.map((juego, index) => (
          <div
            key={index}
            className={`historial-card ${juego.lastSession ? "" : "no-jugado"}`}
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
    </div>
  );
};

export default HistorialPartidas;
