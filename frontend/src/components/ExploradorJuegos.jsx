// src/components/ExploradorJuegos.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema
import { useNavigate } from "react-router-dom";
import BotonFavorito from "./BotonFavoritos";
import "./ExploradorJuegos.css";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const TAGS = ["multiplayer", "co-op", "indie", "rpg", "strategy"];
const GENRES = ["action", "adventure", "racing", "shooter", "puzzle"];

const ExploradorJuegos = () => {
  const { theme } = useTheme(); // Obtén el tema actual del contexto
  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      let url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${pagina}&page_size=20`;
      if (busqueda) url += `&search=${encodeURIComponent(busqueda)}`;
      if (selectedGenre) url += `&genres=${selectedGenre}`;
      if (selectedTag) url += `&tags=${selectedTag}`;

      const response = await fetch(url);
      const data = await response.json();
      setJuegos(data.results || []);
      setTotalPages(data.count ? Math.ceil(data.count / 20) : 10);
    } catch (err) {
      console.error("❌ Error al obtener juegos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [pagina, selectedGenre, selectedTag]);

  const handleBuscar = () => {
    setPagina(1);
    fetchGames();
  };

  return (
    <div
      className="explorador-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424",
        color: theme === "light" ? "var(--color-text)" : "#ffffff",
      }}
    >
      <h2 className="explorador-title">🎮 Community Hub</h2>

      <div className="explorador-filters">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        />
        <button onClick={handleBuscar}>🔍</button>

        <select
          value={selectedGenre}
          onChange={(e) => {
            setPagina(1);
            setSelectedGenre(e.target.value);
          }}
        >
          <option value="">Género</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={selectedTag}
          onChange={(e) => {
            setPagina(1);
            setSelectedTag(e.target.value);
          }}
        >
          <option value="">Tag</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="explorador-grid">
        {juegos.length > 0 ? (
          juegos.map((juego) => (
            <div
              key={juego.id}
              className="juego-card"
              onClick={() => navigate(`/dashboard/community/${juego.id}`)}
            >
              <img
                src={juego.background_image}
                alt={juego.name}
                className="juego-image"
              />
              <p className="juego-name">{juego.name}</p>
              <BotonFavorito
                gameId={juego.id}
                gameName={juego.name}
                coverUrl={juego.background_image}
              />
            </div>
          ))
        ) : (
          <p>No se encontraron juegos.</p>
        )}
      </div>

      <div className="explorador-pagination">
        <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>⬅️ Anterior</button>
        <span>Página {pagina}</span>
        <button disabled={pagina === totalPages} onClick={() => setPagina(p => p + 1)}>Siguiente ➡️</button>
      </div>

      {isLoading && <p className="cargando">⏳ Cargando...</p>}
    </div>
  );
};

export default ExploradorJuegos;
