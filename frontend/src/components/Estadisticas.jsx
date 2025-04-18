import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "./Estadisticas.css";

const COLORS = [
  "#2A5CAA", "#FF5722", "#8884d8", "#82ca9d", "#ffc658",
  "#9C27B0", "#4CAF50", "#FF9800", "#E91E63", "#00BCD4"
];

const Estadisticas = () => {
  const [stats, setStats] = useState(null);
  const [porJuego, setPorJuego] = useState([]);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const resStats = await fetch("http://localhost:3000/api/user/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resHistorial = await fetch("http://localhost:3000/api/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const statsData = await resStats.json();
        const historialData = await resHistorial.json();

        statsData.totalPlayTime = (statsData.totalPlayTime / 60).toFixed(1);
        statsData.averageSessionTime = (statsData.averageSessionTime / 60).toFixed(1);

        const agrupado = {};
        historialData.forEach(({ gameName, playTime }) => {
          agrupado[gameName] = (agrupado[gameName] || 0) + playTime;
        });

        let datos = Object.entries(agrupado).map(([name, tiempo]) => ({
          name,
          horas: parseFloat((tiempo / 60).toFixed(1)),
        }));

        datos = datos.sort((a, b) => b.horas - a.horas);
        setTotalGames(datos.length);
        datos = datos.slice(0, 10);

        setStats(statsData);
        setPorJuego(datos);
      } catch (err) {
        console.error("❌ Error al cargar estadísticas:", err.message);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p className="loading-text">Cargando estadísticas...</p>;

  return (
    <div className="estadisticas-container">
      <h2 className="titulo-seccion">📈 Estadísticas</h2>

      <div className="estad-card">
        <ul className="stats-list">
          <li><strong>Partidas jugadas:</strong> {stats.totalGames}</li>
          <li><strong>Tiempo total jugado:</strong> {stats.totalPlayTime} horas</li>
          <li><strong>Media por sesión:</strong> {stats.averageSessionTime} horas</li>
          <li><strong>Juego favorito:</strong> {stats.favoriteGame}</li>
        </ul>
      </div>

      <div className="estad-card">
        <h3>🎮 Top 10 juegos más jugados</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={porJuego}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={120}
              />
              <YAxis label={{ value: "Horas", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="horas" fill="#2A5CAA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="estad-card">
        <h3>🧠 Reparto (Top 10)</h3>
        <div className="pie-container">
          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                data={porJuego}
                dataKey="horas"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={120}
                label
              >
                {porJuego.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={70}
                wrapperStyle={{
                  marginTop: "1rem",
                  marginBottom: "0.5rem"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {totalGames > porJuego.length && (
          <div className="otros-juegos">
            ...y {totalGames - porJuego.length} juegos más registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Estadisticas;
