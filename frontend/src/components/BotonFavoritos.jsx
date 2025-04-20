import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import toast from "react-hot-toast"; // Importa la librería para mostrar notificaciones

// Componente para manejar el botón de favoritos
const BotonFavoritos = ({ gameId, gameName, coverUrl }) => {
  const [esFavorito, setEsFavorito] = useState(false); // Estado para determinar si el juego es favorito

  // Función para cargar los favoritos del usuario
  const cargarFavoritos = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local
    try {
      // Realiza una solicitud para obtener los favoritos del usuario
      const res = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }, // Incluye el token en los encabezados
      });
      const data = await res.json(); // Convierte la respuesta a JSON
      // Verifica si el juego actual está en la lista de favoritos
      setEsFavorito(data.some(f => f.gameId === String(gameId)));
    } catch (err) {
      console.error("❌ Error al obtener favoritos:", err.message); // Muestra un error en la consola si falla
    }
  };

  // Efecto que se ejecuta cuando cambia el `gameId`
  useEffect(() => {
    cargarFavoritos(); // Carga los favoritos al montar el componente o cambiar el `gameId`
  }, [gameId]);

  // Función para alternar el estado de favorito
  const toggleFavorito = async (e) => {
    e.stopPropagation(); // Evita que el evento se propague a otros elementos
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local
    const headers = {
      "Content-Type": "application/json", // Especifica el tipo de contenido
      Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
    };

    try {
      if (esFavorito) {
        // Si el juego ya es favorito, envía una solicitud para eliminarlo
        await fetch(`http://localhost:3000/api/favorites/${gameId}`, {
          method: "DELETE", // Método HTTP para eliminar
          headers,
        });
        setEsFavorito(false); // Actualiza el estado a "no favorito"
        toast.success("Eliminado de favoritos"); // Muestra una notificación de éxito
      } else {
        // Si el juego no es favorito, envía una solicitud para añadirlo
        await fetch("http://localhost:3000/api/favorites", {
          method: "POST", // Método HTTP para crear
          headers,
          body: JSON.stringify({
            gameId: String(gameId), // ID del juego
            gameName: gameName?.toString(), // Nombre del juego
            coverUrl: coverUrl?.toString(), // URL de la portada del juego
          }),
        });
        setEsFavorito(true); // Actualiza el estado a "favorito"
        toast.success("Añadido a favoritos"); // Muestra una notificación de éxito
      }
    } catch (err) {
      console.error("❌ Error al actualizar favorito:", err.message); // Muestra un error en la consola si falla
      toast.error("Error al actualizar favorito"); // Muestra una notificación de error
    }
  };

  // Renderiza el botón de favoritos
  return (
    <button
      onClick={toggleFavorito} // Llama a `toggleFavorito` al hacer clic
      title={esFavorito ? "Eliminar de favoritos" : "Añadir a favoritos"} // Cambia el título según el estado
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo semitransparente
        color: esFavorito ? "#ff4d4f" : "#ffffff", // Cambia el color según el estado
        border: "none",
        borderRadius: "50%", // Forma circular
        width: "36px",
        height: "36px",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 10,
        transition: "transform 0.2s ease, background-color 0.2s ease", // Transiciones suaves
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")} // Aumenta el tamaño al pasar el mouse
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Restaura el tamaño al quitar el mouse
    >
      {esFavorito ? "❤️" : "🤍"} {/* Muestra un corazón lleno o vacío según el estado */}
    </button>
  );
};

export default BotonFavoritos; // Exporta el componente para usarlo en otros archivos
