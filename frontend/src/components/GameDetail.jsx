import { useParams } from "react-router-dom"; // Importa el hook para obtener parámetros de la URL
import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema (claro/oscuro)
import GameReviews from "./GameReviews"; // Importa el componente para mostrar reseñas del juego
import "./GameDetail.css"; // Importa los estilos específicos para este componente

const API_KEY = import.meta.env.VITE_RAWG_API_KEY; // Obtiene la clave de la API desde las variables de entorno

// Componente principal para mostrar los detalles de un juego
const GameDetail = () => {
  const { id } = useParams(); // Obtiene el ID del juego desde los parámetros de la URL
  const { theme } = useTheme(); // Obtiene el tema actual (claro u oscuro) desde el contexto
  const [juego, setJuego] = useState(null); // Estado para almacenar los datos del juego
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando

  // Función para obtener los datos del juego desde la API
  const fetchJuego = async () => {
    try {
      // Realiza una solicitud a la API para obtener los detalles del juego
      const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
      const data = await res.json();
      setJuego(data); // Actualiza el estado con los datos del juego
    } catch (err) {
      console.error("❌ Error cargando datos del juego:", err); // Muestra un error en la consola si falla
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  // Efecto que se ejecuta al montar el componente o cuando cambia el ID del juego
  useEffect(() => {
    fetchJuego(); // Llama a la función para obtener los datos del juego
  }, [id]);

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) return <p className="cargando">Cargando información del juego...</p>;

  // Muestra un mensaje si no se encuentra información del juego
  if (!juego || juego.detail) return <p className="no-info">No se encontró información para este juego.</p>;

  // Renderiza el componente
  return (
    <div
      className="game-detail-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424", // Cambia el fondo según el tema
        color: theme === "light" ? "var(--color-text)" : "#fff", // Cambia el texto según el tema
      }}
    >
      {/* Título del juego */}
      <h2 className="game-title">{juego.name}</h2>

      {/* Imagen del juego */}
      <img className="game-image" src={juego.background_image} alt={juego.name} />

      {/* Información del juego */}
      <div className="game-info">
        <p><strong>🎮 Géneros:</strong> {juego.genres.map(g => g.name).join(", ")}</p> {/* Lista de géneros */}
        <p><strong>🕹️ Plataformas:</strong> {juego.platforms.map(p => p.platform.name).join(", ")}</p> {/* Plataformas */}
        <p>
          <strong>👥 Modos de juego:</strong>{" "}
          {juego.tags.filter(tag => tag.name.toLowerCase().includes("multiplayer") || tag.name.toLowerCase().includes("co-op"))
            .map(t => t.name).join(", ") || "N/A"} {/* Modos de juego (multijugador o cooperativo) */}
        </p>
        <p><strong>⭐ Valoración:</strong> {juego.rating} / 5</p> {/* Valoración del juego */}
        <p><strong>📊 Metacritic:</strong> {juego.metacritic || "N/A"}</p> {/* Puntuación de Metacritic */}
      </div>

      {/* Descripción del juego */}
      <p className="game-description" dangerouslySetInnerHTML={{ __html: juego.description }} />

      {/* Componente para mostrar las reseñas del juego */}
      <GameReviews gameId={id} />
    </div>
  );
};

export default GameDetail; // Exporta el componente para usarlo en otros archivos
