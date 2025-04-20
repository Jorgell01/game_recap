import React from "react"; // Importa React para crear componentes
import ReactDOM from "react-dom/client"; // Importa ReactDOM para renderizar la aplicación en el DOM
import App from "./App"; // Importa el componente principal de la aplicación
import { ThemeProvider } from "./context/ThemeContext"; // Importa el proveedor del contexto del tema (claro/oscuro)
import { BrowserRouter } from "react-router-dom"; // Importa el componente para manejar rutas en la aplicación
import "./index.css"; // Importa los estilos globales de la aplicación

// Renderiza la aplicación en el elemento con el ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> {/* Activa comprobaciones adicionales en desarrollo */}
    <ThemeProvider> {/* Proveedor del contexto del tema para toda la aplicación */}
      <BrowserRouter> {/* Habilita el manejo de rutas en la aplicación */}
        <App /> {/* Componente principal de la aplicación */}
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
