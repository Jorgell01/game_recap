// src/components/Favoritos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Favoritos.css";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  const fetchFavoritos = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setFavoritos(data);
    } catch (err) {
      console.error("❌ Error al cargar favoritos:", err.message);
    }
  };

  const eliminarFavorito = async (gameId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/favorites/${gameId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFavoritos((prev) => prev.filter((f) => f.gameId !== gameId));
        toast.success("Favorito eliminado");
      } else {
        toast.error("Error al eliminar favorito");
      }
    } catch (err) {
      console.error("❌ Error al eliminar favorito:", err.message);
      toast.error("Error al eliminar favorito");
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, []);

  return (
    <div className="favoritos-container">
      <h2 className="favoritos-title">💖 Mis juegos favoritos</h2>

      {favoritos.length === 0 ? (
        <p className="favoritos-vacio">No tienes favoritos aún.</p>
      ) : (
        <div className="favoritos-grid">
          {favoritos.map((juego) => (
            <div
              key={juego.gameId}
              className="favorito-card"
              onClick={() => navigate(`/dashboard/community/${juego.gameId}`)}
            >
              <img
                src={juego.coverUrl}
                alt={juego.gameName}
                className="favorito-img"
              />
              <p className="favorito-nombre">{juego.gameName}</p>
              <button
                className="favorito-delete"
                onClick={(e) => {
                  e.stopPropagation(); // Evita que se dispare el navigate
                  eliminarFavorito(juego.gameId);
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
