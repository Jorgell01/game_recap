import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"; // Importa componentes de la librería Recharts para gráficos
import "./Estadisticas.css"; // Importa los estilos específicos para este componente

// Colores para los gráficos
const COLORS = [
  "#2A5CAA", "#FF5722", "#8884d8", "#82ca9d", "#ffc658",
  "#9C27B0", "#4CAF50", "#FF9800", "#E91E63", "#00BCD4"
];

// Componente principal para mostrar estadísticas
const Estadisticas = () => {
  const { theme } = useTheme(); // Obtiene el tema actual (claro u oscuro) desde el contexto
  const [stats, setStats] = useState(null); // Estado para las estadísticas generales del usuario
  const [porJuego, setPorJuego] = useState([]); // Estado para las estadísticas por juego
  const [totalGames, setTotalGames] = useState(0); // Estado para el número total de juegos registrados

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local

    // Función para obtener las estadísticas del usuario
    const fetchStats = async () => {
      try {
        // Solicita las estadísticas generales del usuario
        const resStats = await fetch("http://localhost:3000/api/user/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Solicita el historial de partidas del usuario
        const resHistorial = await fetch("http://localhost:3000/api/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const statsData = await resStats.json(); // Convierte la respuesta de estadísticas a JSON
        const historialData = await resHistorial.json(); // Convierte la respuesta del historial a JSON

        // Convierte el tiempo total y promedio jugado de minutos a horas
        statsData.totalPlayTime = (statsData.totalPlayTime / 60).toFixed(1);
        statsData.averageSessionTime = (statsData.averageSessionTime / 60).toFixed(1);

        // Agrupa el tiempo jugado por juego
        const agrupado = {};
        historialData.forEach(({ gameName, playTime }) => {
          agrupado[gameName] = (agrupado[gameName] || 0) + playTime;
        });

        // Convierte los datos agrupados en un array y los ordena por tiempo jugado
        let datos = Object.entries(agrupado).map(([name, tiempo]) => ({
          name,
          horas: parseFloat((tiempo / 60).toFixed(1)), // Convierte minutos a horas
        }));

        datos = datos.sort((a, b) => b.horas - a.horas); // Ordena de mayor a menor por horas jugadas
        setTotalGames(datos.length); // Actualiza el número total de juegos
        datos = datos.slice(0, 10); // Toma los 10 juegos más jugados

        setStats(statsData); // Actualiza las estadísticas generales
        setPorJuego(datos); // Actualiza las estadísticas por juego
      } catch (err) {
        console.error("❌ Error al cargar estadísticas:", err.message); // Muestra un error en la consola si falla
      }
    };

    fetchStats(); // Llama a la función para obtener las estadísticas
  }, []);

  // Muestra un mensaje de carga mientras se obtienen las estadísticas
  if (!stats) return <p className="loading-text"> ⌛ Cargando estadísticas...</p>;

  // Renderiza el componente
  return (
    <div
      className="estadisticas-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424", // Cambia el fondo según el tema
        color: theme === "light" ? "var(--color-text)" : "#ffffff", // Cambia el texto según el tema
      }}
    >
      <h2 className="titulo-seccion">📈 Estadísticas</h2>

      {/* Estadísticas generales */}
      <div className="estad-card">
        <ul className="stats-list">
          <li><strong>Partidas jugadas:</strong> {stats.totalGames}</li>
          <li><strong>Tiempo total jugado:</strong> {stats.totalPlayTime} horas</li>
          <li><strong>Media por sesión:</strong> {stats.averageSessionTime} horas</li>
          <li><strong>Juego favorito:</strong> {stats.favoriteGame}</li>
        </ul>
      </div>

      {/* Gráfico de barras: Top 10 juegos más jugados */}
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

      {/* Gráfico de pastel: Reparto de tiempo jugado */}
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

        {/* Muestra un mensaje si hay más juegos registrados fuera del Top 10 */}
        {totalGames > porJuego.length && (
          <div className="otros-juegos">
            ...y {totalGames - porJuego.length} juegos más registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Estadisticas; // Exporta el componente para usarlo en otros archivos
