import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema (claro/oscuro)
import { Sun, Moon } from "lucide-react"; // Importa los íconos de sol y luna desde la librería Lucide

// Componente para alternar entre temas claro y oscuro
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme(); // Obtiene el tema actual y la función para alternar el tema desde el contexto

  // Renderiza el botón para alternar el tema
  return (
    <button
      onClick={toggleTheme} // Cambia el tema al hacer clic
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.05)", // Fondo semitransparente
        border: "1px solid var(--color-card)", // Borde con el color de la tarjeta
        borderRadius: "12px", // Bordes redondeados
        padding: "8px", // Espaciado interno
        cursor: "pointer", // Cambia el cursor a puntero
        transition: "all 0.3s ease-in-out", // Transición suave para cambios de estilo
        display: "flex", // Flexbox para centrar el contenido
        alignItems: "center", // Centra verticalmente el contenido
        justifyContent: "center", // Centra horizontalmente el contenido
      }}
      aria-label="Cambiar tema" // Etiqueta accesible para describir la acción del botón
    >
      {/* Muestra el ícono de la luna si el tema es claro, o el ícono del sol si el tema es oscuro */}
      {theme === "light" ? <Moon size={20} color="#333" /> : <Sun size={20} color="#fff" />}
    </button>
  );
};

export default ThemeToggleButton; // Exporta el componente para usarlo en otros archivos
