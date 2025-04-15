import { useState } from "react";

const AddSessionForm = ({ onSessionAdded }) => {
  const [gameName, setGameName] = useState("");
  const [playTime, setPlayTime] = useState("");
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validaciones
    if (gameName.trim() === "") {
      return setMessage("❌ El nombre del juego es obligatorio.");
    }

    const playTimeInt = parseInt(playTime);
    if (isNaN(playTimeInt) || playTimeInt <= 0) {
      return setMessage("❌ El tiempo debe ser un número mayor que 0.");
    }

    setSending(true);

    try {
      const res = await fetch("http://localhost:3000/api/game/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gameName, playTime: playTimeInt }),
      });

      if (!res.ok) throw new Error("Error al guardar la partida");

      setGameName("");
      setPlayTime("");
      setMessage("✅ ¡Partida guardada!");
      if (onSessionAdded) onSessionAdded();
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>🎮 Añadir nueva partida</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del juego"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        /><br /><br />

        <input
          type="number"
          placeholder="Minutos jugados"
          value={playTime}
          onChange={(e) => setPlayTime(e.target.value)}
        /><br /><br />

        <button type="submit" disabled={sending}>
          {sending ? "Guardando..." : "Guardar partida"}
        </button>
      </form>

      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddSessionForm;
