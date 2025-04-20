import { createContext, useContext, useEffect, useState } from "react"; // Importa funciones necesarias de React

// Crea un contexto para manejar el tema (claro/oscuro)
const ThemeContext = createContext();

// Proveedor del contexto del tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Estado para almacenar el tema actual (por defecto "light")

  // Inicializa el tema desde localStorage en el primer render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme"); // Obtiene el tema guardado en localStorage
    if (savedTheme) {
      setTheme(savedTheme); // Si existe, actualiza el estado con el tema guardado
    }
  }, []);

  // Aplica el tema al DOM y sincroniza con localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // Establece el atributo `data-theme` en el elemento raíz
    document.body.style.backgroundColor = theme === "light" ? "#ffffff" : "#242424"; // Cambia el color de fondo según el tema
    document.body.style.color = theme === "light" ? "#333333" : "#ffffff"; // Cambia el color del texto según el tema
    localStorage.setItem("theme", theme); // Guarda el tema actual en localStorage
  }, [theme]); // Se ejecuta cada vez que cambia el estado `theme`

  // Función para alternar entre temas claro y oscuro
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light")); // Cambia el tema al opuesto
  };

  // Proporciona el contexto del tema a los componentes hijos
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} {/* Renderiza los componentes hijos */}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext);
