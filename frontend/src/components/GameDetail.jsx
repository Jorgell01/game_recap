// src/components/GameDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import GameReviews from "./GameReviews";
import "./GameDetail.css";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const GameDetail = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJuego = async () => {
    try {
      const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
      const data = await res.json();
      setJuego(data);
    } catch (err) {
      console.error("❌ Error cargando datos del juego:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJuego();
  }, [id]);

  if (loading) return <p className="cargando">Cargando información del juego...</p>;
  if (!juego || juego.detail) return <p className="no-info">No se encontró información para este juego.</p>;

  return (
    <div
      className="game-detail-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424",
        color: theme === "light" ? "var(--color-text)" : "#fff",
      }}
    >
      <h2 className="game-title">{juego.name}</h2>
      <img className="game-image" src={juego.background_image} alt={juego.name} />

      <div className="game-info">
        <p><strong>🎮 Géneros:</strong> {juego.genres.map(g => g.name).join(", ")}</p>
        <p><strong>🕹️ Plataformas:</strong> {juego.platforms.map(p => p.platform.name).join(", ")}</p>
        <p>
          <strong>👥 Modos de juego:</strong>{" "}
          {juego.tags.filter(tag => tag.name.toLowerCase().includes("multiplayer") || tag.name.toLowerCase().includes("co-op"))
            .map(t => t.name).join(", ") || "N/A"}
        </p>
        <p><strong>⭐ Valoración:</strong> {juego.rating} / 5</p>
        <p><strong>📊 Metacritic:</strong> {juego.metacritic || "N/A"}</p>
      </div>

      <p className="game-description" dangerouslySetInnerHTML={{ __html: juego.description }} />

      <GameReviews gameId={id} />
    </div>
  );
};

export default GameDetail;
