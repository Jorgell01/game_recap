import { useEffect, useState } from "react";

const Estadisticas = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3000/api/user/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No se pudieron cargar las estadísticas");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>Cargando estadísticas...</p>;

  return (
    <div>
      <h2>📈 Estadísticas</h2>
      <ul>
        <li><strong>Partidas jugadas:</strong> {stats.totalGames}</li>
        <li><strong>Tiempo total jugado:</strong> {stats.totalPlayTime} min</li>
        <li><strong>Media por sesión:</strong> {stats.averageSessionTime} min</li>
        <li><strong>Juego favorito:</strong> {stats.favoriteGame}</li>
      </ul>
    </div>
  );
};

export default Estadisticas;
