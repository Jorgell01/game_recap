// src/components/GameReviews.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "./GameReviews.css";

const GameReviews = ({ gameId }) => {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]); // por seguridad
        console.error("⚠️ Las reseñas recibidas no son un array:", data);
      }
    } catch (err) {
      console.error("❌ Error cargando reseñas:", err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((rev) => rev.id !== reviewId));
      } else {
        const errMsg = await res.text();
        alert(`Error al eliminar reseña: ${errMsg}`);
      }
    } catch (err) {
      console.error("❌ Error eliminando reseña:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newReview, gameId }),
      });

      if (res.ok) {
        setNewReview({ rating: 5, comment: "" });
        fetchReviews();
      } else {
        const errMsg = await res.text();
        alert(`Error al enviar reseña: ${errMsg}`);
      }
    } catch (err) {
      console.error("❌ Error enviando reseña:", err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  return (
    <div
      className="reviews-container"
      style={{
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424",
        color: theme === "light" ? "var(--color-text)" : "#ffffff",
      }}
    >
      <h3>💬 Reseñas de usuarios</h3>

      {Array.isArray(reviews) && reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((rev) => (
            <li key={rev.id} className="review-card">
              <strong>{rev.username}</strong> ⭐{rev.rating}/5
              <p>{rev.comment}</p>
              <span className="review-date">
                {new Date(rev.createdAt).toLocaleString()}
              </span>
              <button
                className="delete-review-button"
                onClick={() => handleDelete(rev.id)}
              >
                🗑️ Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reseñas todavía.</p>
      )}

      <form onSubmit={handleSubmit} className="review-form">
        <h4>📝 Añadir reseña</h4>
        <label>
          Valoración (1-5):
          <input
            type="number"
            min="1"
            max="5"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: parseInt(e.target.value) })
            }
            required
          />
        </label>
        <textarea
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder="Escribe tu reseña..."
          required
        />
        <button type="submit">Publicar reseña</button>
      </form>
    </div>
  );
};

export default GameReviews;
