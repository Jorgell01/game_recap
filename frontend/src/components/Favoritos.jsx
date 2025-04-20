import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { useNavigate } from "react-router-dom"; // Importa el hook para navegar entre rutas
import toast from "react-hot-toast"; // Importa la librería para mostrar notificaciones
import "./Favoritos.css"; // Importa los estilos específicos para este componente

// Componente principal para mostrar y gestionar los juegos favoritos
const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]); // Estado para almacenar los juegos favoritos
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para obtener los juegos favoritos del usuario
  const fetchFavoritos = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local

    try {
      // Realiza una solicitud para obtener los favoritos del usuario
      const res = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }, // Incluye el token en los encabezados
      });

      const data = await res.json(); // Convierte la respuesta a JSON
      setFavoritos(data); // Actualiza el estado con los favoritos obtenidos
    } catch (err) {
      console.error("❌ Error al cargar favoritos:", err.message); // Muestra un error en la consola si falla
    }
  };

  // Función para eliminar un juego de los favoritos
  const eliminarFavorito = async (gameId) => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local

    try {
      // Realiza una solicitud para eliminar el juego de los favoritos
      const res = await fetch(`http://localhost:3000/api/favorites/${gameId}`, {
        method: "DELETE", // Método HTTP para eliminar
        headers: { Authorization: `Bearer ${token}` }, // Incluye el token en los encabezados
      });

      if (res.ok) {
        // Si la eliminación es exitosa, actualiza el estado eliminando el juego
        setFavoritos((prev) => prev.filter((f) => f.gameId !== gameId));
        toast.success("Favorito eliminado"); // Muestra una notificación de éxito
      } else {
        toast.error("Error al eliminar favorito"); // Muestra una notificación de error
      }
    } catch (err) {
      console.error("❌ Error al eliminar favorito:", err.message); // Muestra un error en la consola si falla
      toast.error("Error al eliminar favorito"); // Muestra una notificación de error
    }
  };

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    fetchFavoritos(); // Llama a la función para obtener los favoritos
  }, []);

  // Renderiza el componente
  return (
    <div className="favoritos-container">
      <h2 className="favoritos-title">💖 Mis juegos favoritos</h2>

      {/* Si no hay favoritos, muestra un mensaje */}
      {favoritos.length === 0 ? (
        <p className="favoritos-vacio">No tienes favoritos aún.</p>
      ) : (
        // Si hay favoritos, muestra un grid con los juegos
        <div className="favoritos-grid">
          {favoritos.map((juego) => (
            <div
              key={juego.gameId} // Identificador único del juego
              className="favorito-card"
              onClick={() => navigate(`/dashboard/community/${juego.gameId}`)} // Navega a la página del juego al hacer clic
            >
              <img
                src={juego.coverUrl} // Imagen del juego
                alt={juego.gameName} // Texto alternativo
                className="favorito-img"
              />
              <p className="favorito-nombre">{juego.gameName}</p> {/* Nombre del juego */}
              <button
                className="favorito-delete"
                onClick={(e) => {
                  e.stopPropagation(); // Evita que se dispare el evento de navegación
                  eliminarFavorito(juego.gameId); // Llama a la función para eliminar el favorito
                }}
              >
                🗑️ {/* Ícono de eliminar */}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos; // Exporta el componente para usarlo en otros archivos
