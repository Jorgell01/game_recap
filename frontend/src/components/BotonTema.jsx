import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { Sun, Moon } from "lucide-react"; // Importa los íconos de sol y luna desde la librería Lucide

// Componente para alternar entre modo claro y oscuro
const BotonTema = () => {
  // Estado para determinar si el modo oscuro está activado
  const [modoOscuro, setModoOscuro] = useState(
    localStorage.getItem("theme") === "dark" // Inicializa el estado según el valor almacenado en localStorage
  );

  // Efecto que se ejecuta cuando cambia el estado `modoOscuro`
  useEffect(() => {
    // Cambia el atributo `data-theme` del cuerpo del documento según el estado
    document.body.setAttribute("data-theme", modoOscuro ? "dark" : "light");
    // Guarda el tema actual en localStorage
    localStorage.setItem("theme", modoOscuro ? "dark" : "light");
  }, [modoOscuro]);

  // Renderiza el botón
  return (
    <button
      onClick={() => setModoOscuro((prev) => !prev)} // Alterna el estado `modoOscuro` al hacer clic
      style={{
        background: "none", // Sin fondo
        border: "none", // Sin borde
        cursor: "pointer", // Cambia el cursor a puntero
        marginRight: "1rem", // Margen derecho
      }}
      aria-label="Cambiar tema" // Etiqueta accesible para describir la acción del botón
    >
      {/* Muestra el ícono del sol si está en modo oscuro, o el ícono de la luna si está en modo claro */}
      {modoOscuro ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default BotonTema; // Exporta el componente para usarlo en otros archivos
