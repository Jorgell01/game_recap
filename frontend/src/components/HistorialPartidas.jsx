import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema (claro/oscuro)
import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { useNavigate } from "react-router-dom"; // Importa el hook para navegar entre rutas
import "./HistorialPartidas.css"; // Importa los estilos específicos para este componente

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY; // Obtiene la clave de la API desde las variables de entorno

// Componente principal para mostrar el historial de partidas del usuario
const HistorialPartidas = () => {
  const { theme } = useTheme(); // Obtiene el tema actual (claro u oscuro) desde el contexto
  const [historial, setHistorial] = useState([]); // Estado para almacenar el historial de partidas
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local

    // Función para obtener el historial de partidas del usuario
    const fetchHistorial = async () => {
      try {
        // Solicita el historial de partidas desde el backend
        const res = await fetch("http://localhost:3000/api/user/history", {
          headers: { Authorization: `Bearer ${token}` }, // Incluye el token en los encabezados
        });

        const data = await res.json(); // Convierte la respuesta a JSON

        // Agrupa el tiempo jugado por juego
        const agrupado = {};
        data.forEach(({ gameName, playTime, lastPlayed }) => {
          if (!agrupado[gameName]) {
            agrupado[gameName] = {
              name: gameName, // Nombre del juego
              totalHours: 0, // Tiempo total jugado (en horas)
              lastSession: lastPlayed, // Última sesión jugada
            };
          }
          agrupado[gameName].totalHours += playTime; // Suma el tiempo jugado
        });

        // Convierte el objeto agrupado en un array y toma los primeros 100 juegos
        const juegos = Object.values(agrupado).slice(0, 100);

        // Enriquecer los datos con información adicional desde la API de RAWG
        const enriquecido = await Promise.all(
          juegos.map(async (juego) => {
            const res = await fetch(
              `https://api.rawg.io/api/games?search=${encodeURIComponent(juego.name)}&key=${RAWG_API_KEY}`
            );
            const rawg = await res.json();
            const match = rawg.results?.[0]; // Toma el primer resultado que coincida
            return {
              ...juego,
              id: match?.id || null, // ID del juego en RAWG
              totalHours: juego.totalHours > 0 ? (juego.totalHours / 60).toFixed(1) : "0", // Convierte minutos a horas
              image: match?.background_image || null, // Imagen del juego
            };
          })
        );

        // Actualiza el estado con los datos enriquecidos
        setTimeout(() => {
          setHistorial(enriquecido);
          setLoading(false); // Desactiva el estado de carga
        }, 600); // Simula un pequeño retraso para la carga
      } catch (err) {
        console.error("❌ Error al cargar historial:", err.message); // Muestra un error en la consola si falla
        setLoading(false); // Desactiva el estado de carga
      }
    };

    fetchHistorial(); // Llama a la función para obtener el historial
  }, []);

  // Renderiza el componente
  return (
    <div
      className="historial-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424", // Cambia el fondo según el tema
        color: theme === "light" ? "var(--color-text)" : "#ffffff", // Cambia el texto según el tema
      }}
    >
      <h2>🕹️ Historial de Partidas</h2>

      {/* Muestra un mensaje de carga mientras se obtienen los datos */}
      {loading ? (
        <p className="historial-loading">⏳ Cargando historial...</p>
      ) : (
        // Muestra el historial de partidas en un grid
        <div className="historial-grid">
          {historial.map((juego, index) => (
            <div
              key={index} // Identificador único para cada juego
              className={`historial-card ${juego.lastSession ? "" : "no-jugado"}`} // Clase adicional si no se ha jugado
              onClick={() => juego.id && navigate(`/dashboard/community/${juego.id}`)} // Navega a la página del juego al hacer clic
              style={{ cursor: juego.id ? "pointer" : "default" }} // Cambia el cursor si el juego tiene ID
            >
              {/* Imagen del juego */}
              {juego.image && <img src={juego.image} alt={juego.name} />}
              <div className="historial-info">
                <h3>{juego.name}</h3> {/* Nombre del juego */}
                <p><strong>Tiempo jugado:</strong> {juego.totalHours} horas</p> {/* Tiempo total jugado */}
                <p>
                  <strong>Última sesión:</strong>{" "}
                  {juego.lastSession
                    ? new Date(juego.lastSession).toLocaleDateString() // Fecha de la última sesión
                    : "No jugado"} {/* Mensaje si no se ha jugado */}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialPartidas; // Exporta el componente para usarlo en otros archivos
