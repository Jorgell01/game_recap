import React from "react";

const HistorialPartidas = ({ historial }) => {
  if (!historial || historial.length === 0) {
    return <p className="text-center text-gray-500">No hay partidas registradas.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">🕹️ Historial de Partidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {historial.map((juego) => (
          <div key={juego.steamAppId} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{juego.gameName}</h3>
            <p><strong>Tiempo jugado:</strong> {(juego.playTime / 60).toFixed(1)} horas</p>
            <p>
              <strong>Última sesión:</strong>{" "}
              {juego.lastPlayed
                ? new Date(juego.lastPlayed).toLocaleDateString()
                : "No jugado"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialPartidas;
