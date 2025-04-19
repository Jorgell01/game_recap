// src/components/BotonFavoritos.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BotonFavoritos = ({ gameId, gameName, coverUrl }) => {
  const [esFavorito, setEsFavorito] = useState(false);

  const cargarFavoritos = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEsFavorito(data.some(f => f.gameId === String(gameId)));
    } catch (err) {
      console.error("❌ Error al obtener favoritos:", err.message);
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, [gameId]);

  const toggleFavorito = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (esFavorito) {
        await fetch(`http://localhost:3000/api/favorites/${gameId}`, {
          method: "DELETE",
          headers,
        });
        setEsFavorito(false);
        toast.success("Eliminado de favoritos");
      } else {
        await fetch("http://localhost:3000/api/favorites", {
          method: "POST",
          headers,
          body: JSON.stringify({
            gameId: String(gameId),
            gameName: gameName?.toString(),
            coverUrl: coverUrl?.toString(),
          }),          
        });
        setEsFavorito(true);
        toast.success("Añadido a favoritos");
      }
    } catch (err) {
      console.error("❌ Error al actualizar favorito:", err.message);
      toast.error("Error al actualizar favorito");
    }
  };

  return (
    <button
      onClick={toggleFavorito}
      title={esFavorito ? "Eliminar de favoritos" : "Añadir a favoritos"}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: esFavorito ? "#ff4d4f" : "#ffffff",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 10,
        transition: "transform 0.2s ease, background-color 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {esFavorito ? "❤️" : "🤍"}
    </button>
  );
};

export default BotonFavoritos;
