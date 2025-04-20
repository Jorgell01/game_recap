import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema
import { useNavigate } from "react-router-dom"; // Importa el hook para navegar entre rutas
import BotonFavorito from "./BotonFavoritos"; // Importa el componente para manejar favoritos
import "./ExploradorJuegos.css"; // Importa los estilos específicos para este componente

const API_KEY = import.meta.env.VITE_RAWG_API_KEY; // Obtiene la clave de la API desde las variables de entorno

// Listas de géneros y etiquetas para los filtros
const TAGS = ["multiplayer", "co-op", "indie", "rpg", "strategy"];
const GENRES = ["action", "adventure", "racing", "shooter", "puzzle"];

// Componente principal para explorar juegos
const ExploradorJuegos = () => {
  const { theme } = useTheme(); // Obtiene el tema actual (claro u oscuro) desde el contexto
  const [juegos, setJuegos] = useState([]); // Estado para almacenar los juegos obtenidos
  const [busqueda, setBusqueda] = useState(""); // Estado para el término de búsqueda
  const [pagina, setPagina] = useState(1); // Estado para la página actual
  const [selectedGenre, setSelectedGenre] = useState(""); // Estado para el género seleccionado
  const [selectedTag, setSelectedTag] = useState(""); // Estado para la etiqueta seleccionada
  const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si los datos están cargando
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para obtener los juegos desde la API
  const fetchGames = async () => {
    setIsLoading(true); // Activa el estado de carga
    try {
      // Construye la URL de la API con los filtros aplicados
      let url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${pagina}&page_size=20`;
      if (busqueda) url += `&search=${encodeURIComponent(busqueda)}`; // Agrega el término de búsqueda
      if (selectedGenre) url += `&genres=${selectedGenre}`; // Agrega el género seleccionado
      if (selectedTag) url += `&tags=${selectedTag}`; // Agrega la etiqueta seleccionada

      const response = await fetch(url); // Realiza la solicitud a la API
      const data = await response.json(); // Convierte la respuesta a JSON
      setJuegos(data.results || []); // Actualiza el estado con los juegos obtenidos
      setTotalPages(data.count ? Math.ceil(data.count / 20) : 10); // Calcula el número total de páginas
    } catch (err) {
      console.error("❌ Error al obtener juegos:", err); // Muestra un error en la consola si falla
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  // Efecto que se ejecuta al cambiar la página, el género o la etiqueta
  useEffect(() => {
    fetchGames(); // Llama a la función para obtener los juegos
  }, [pagina, selectedGenre, selectedTag]);

  // Función para manejar la búsqueda
  const handleBuscar = () => {
    setPagina(1); // Reinicia la página a la primera
    fetchGames(); // Llama a la función para obtener los juegos
  };

  // Renderiza el componente
  return (
    <div
      className="explorador-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424", // Cambia el fondo según el tema
        color: theme === "light" ? "var(--color-text)" : "#ffffff", // Cambia el texto según el tema
      }}
    >
      <h2 className="explorador-title">🎮 Community Hub</h2>

      {/* Filtros de búsqueda */}
      <div className="explorador-filters">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={busqueda} // Valor del término de búsqueda
          onChange={(e) => setBusqueda(e.target.value)} // Actualiza el término de búsqueda
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()} // Busca al presionar Enter
        />
        <button onClick={handleBuscar}>🔍</button>

        {/* Filtro por género */}
        <select
          value={selectedGenre}
          onChange={(e) => {
            setPagina(1); // Reinicia la página a la primera
            setSelectedGenre(e.target.value); // Actualiza el género seleccionado
          }}
        >
          <option value="">Género</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Filtro por etiqueta */}
        <select
          value={selectedTag}
          onChange={(e) => {
            setPagina(1); // Reinicia la página a la primera
            setSelectedTag(e.target.value); // Actualiza la etiqueta seleccionada
          }}
        >
          <option value="">Tag</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Grid de juegos */}
      <div className="explorador-grid">
        {juegos.length > 0 ? (
          juegos.map((juego) => (
            <div
              key={juego.id}
              className="juego-card"
              onClick={() => navigate(`/dashboard/community/${juego.id}`)} // Navega a la página del juego al hacer clic
            >
              <img
                src={juego.background_image} // Imagen del juego
                alt={juego.name} // Texto alternativo
                className="juego-image"
              />
              <p className="juego-name">{juego.name}</p> {/* Nombre del juego */}
              <BotonFavorito
                gameId={juego.id} // ID del juego
                gameName={juego.name} // Nombre del juego
                coverUrl={juego.background_image} // URL de la imagen del juego
              />
            </div>
          ))
        ) : (
          <p>No se encontraron juegos.</p> // Mensaje si no hay juegos
        )}
      </div>

      {/* Paginación */}
      <div className="explorador-pagination">
        <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>⬅️ Anterior</button>
        <span>Página {pagina}</span>
        <button disabled={pagina === totalPages} onClick={() => setPagina(p => p + 1)}>Siguiente ➡️</button>
      </div>

      {/* Mensaje de carga */}
      {isLoading && <p className="cargando">⏳ Cargando...</p>}
    </div>
  );
};

export default ExploradorJuegos; // Exporta el componente para usarlo en otros archivos
