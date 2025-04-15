import { useEffect, useState } from "react";

const HistorialPartidas = () => {
  const [partidas, setPartidas] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // <- Asegúrate de guardar el token al logearte

  useEffect(() => {
    fetch("http://localhost:3000/api/user/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener historial");
        return res.json();
      })
      .then((data) => setPartidas(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>🕹️ Historial de Partidas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {partidas.map((p, i) => (
          <li key={i}>
            <strong>{p.gameName}</strong> — {p.playTime} min —{" "}
            {new Date(p.playedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialPartidas;
