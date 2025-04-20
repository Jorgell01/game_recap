import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema (claro/oscuro)
import "./GameReviews.css"; // Importa los estilos específicos para este componente

// Componente principal para mostrar y gestionar reseñas de un juego
const GameReviews = ({ gameId }) => {
  const { theme } = useTheme(); // Obtiene el tema actual (claro u oscuro) desde el contexto
  const [reviews, setReviews] = useState([]); // Estado para almacenar las reseñas del juego
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" }); // Estado para la nueva reseña

  // Función para obtener las reseñas del juego desde el backend
  const fetchReviews = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local
    try {
      // Realiza una solicitud para obtener las reseñas del juego
      const res = await fetch(`http://localhost:3000/api/reviews/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
      });

      const data = await res.json(); // Convierte la respuesta a JSON
      if (Array.isArray(data)) {
        setReviews(data); // Actualiza el estado con las reseñas obtenidas
      } else {
        setReviews([]); // Por seguridad, limpia el estado si no es un array
        console.error("⚠️ Las reseñas recibidas no son un array:", data);
      }
    } catch (err) {
      console.error("❌ Error cargando reseñas:", err.message); // Muestra un error en la consola si falla
    }
  };

  // Función para eliminar una reseña
  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local
    try {
      // Realiza una solicitud para eliminar la reseña
      const res = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "DELETE", // Método HTTP para eliminar
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
      });

      if (res.ok) {
        // Si la eliminación es exitosa, actualiza el estado eliminando la reseña
        setReviews((prev) => prev.filter((rev) => rev.id !== reviewId));
      } else {
        const errMsg = await res.text();
        alert(`Error al eliminar reseña: ${errMsg}`); // Muestra un mensaje de error
      }
    } catch (err) {
      console.error("❌ Error eliminando reseña:", err.message); // Muestra un error en la consola si falla
    }
  };

  // Función para enviar una nueva reseña
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    const token = localStorage.getItem("token"); // Obtiene el token JWT del almacenamiento local

    try {
      // Realiza una solicitud para enviar la nueva reseña
      const res = await fetch(`http://localhost:3000/api/reviews`, {
        method: "POST", // Método HTTP para crear
        headers: {
          "Content-Type": "application/json", // Especifica el tipo de contenido
          Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
        body: JSON.stringify({ ...newReview, gameId }), // Envía la reseña junto con el ID del juego
      });

      if (res.ok) {
        setNewReview({ rating: 5, comment: "" }); // Limpia el formulario
        fetchReviews(); // Actualiza las reseñas
      } else {
        const errMsg = await res.text();
        alert(`Error al enviar reseña: ${errMsg}`); // Muestra un mensaje de error
      }
    } catch (err) {
      console.error("❌ Error enviando reseña:", err.message); // Muestra un error en la consola si falla
    }
  };

  // Efecto que se ejecuta al montar el componente o cuando cambia el ID del juego
  useEffect(() => {
    fetchReviews(); // Llama a la función para obtener las reseñas
  }, [gameId]);

  // Renderiza el componente
  return (
    <div
      className="reviews-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424", // Cambia el fondo según el tema
        color: theme === "light" ? "var(--color-text)" : "#ffffff", // Cambia el texto según el tema
      }}
    >
      <h3>💬 Reseñas de usuarios</h3>

      {/* Lista de reseñas */}
      {Array.isArray(reviews) && reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((rev) => (
            <li key={rev.id} className="review-card">
              <strong>{rev.username}</strong> ⭐{rev.rating}/5 {/* Usuario y valoración */}
              <p>{rev.comment}</p> {/* Comentario */}
              <span className="review-date">
                {new Date(rev.createdAt).toLocaleString()} {/* Fecha de creación */}
              </span>
              <button
                className="delete-review-button"
                onClick={() => handleDelete(rev.id)} // Llama a la función para eliminar la reseña
              >
                🗑️ Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reseñas todavía.</p> // Mensaje si no hay reseñas
      )}

      {/* Formulario para añadir una nueva reseña */}
      <form onSubmit={handleSubmit} className="review-form">
        <h4>📝 Añadir reseña</h4>
        <label>
          Valoración (1-5):
          <input
            type="number"
            min="1"
            max="5"
            value={newReview.rating} // Valor de la valoración
            onChange={(e) =>
              setNewReview({ ...newReview, rating: parseInt(e.target.value) }) // Actualiza la valoración
            }
            required
          />
        </label>
        <textarea
          value={newReview.comment} // Valor del comentario
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value }) // Actualiza el comentario
          }
          placeholder="Escribe tu reseña..."
          required
        />
        <button type="submit">Publicar reseña</button> {/* Botón para enviar la reseña */}
      </form>
    </div>
  );
};

export default GameReviews; // Exporta el componente para usarlo en otros archivos
