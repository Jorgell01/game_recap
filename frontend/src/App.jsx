import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"; // Importa herramientas para manejar rutas
import LoginPage from "./pages/LoginPage"; // Importa la página de inicio de sesión
import DashboardPage from "./pages/DashboardPage"; // Importa la página del dashboard
import { Toaster } from "react-hot-toast"; // Importa el componente para mostrar notificaciones
import { ThemeProvider } from "./context/ThemeContext"; // Importa el proveedor del contexto del tema
import ThemeToggleButton from "./components/ThemeToggleButton"; // Importa el botón para alternar entre temas

// Componente principal de la aplicación
function App() {
  const [token, setToken] = useState(localStorage.getItem("token")); // Estado para almacenar el token JWT
  const location = useLocation(); // Obtiene la ubicación actual de la URL
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Efecto que se ejecuta al montar el componente o cuando cambia la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search); // Obtiene los parámetros de la URL
    const tokenFromUrl = params.get("token"); // Extrae el token de los parámetros

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl); // Guarda el token en el almacenamiento local
      setToken(tokenFromUrl); // Actualiza el estado con el token
      navigate("/dashboard"); // Redirige al usuario al dashboard
    }
  }, [location.search, navigate]);

  // Detecta si el usuario está en el dashboard
  const estaEnDashboard = location.pathname.startsWith("/dashboard");

  return (
    <ThemeProvider> {/* Proveedor del contexto del tema */}
      <div
        style={{
          width: "100%", // Ancho completo de la ventana
          height: "100%", // Altura completa de la ventana
          display: "flex", // Usa flexbox para organizar los elementos
          flexDirection: "column", // Organiza los elementos en una columna
        }}
      >
        <Toaster position="top-center" reverseOrder={false} /> {/* Componente para mostrar notificaciones */}

        {/* Muestra el botón de alternar tema solo si no estás en el dashboard */}
        {!estaEnDashboard && (
          <div
            style={{
              position: "fixed", // Posiciona el botón de forma fija
              top: "1rem", // Margen superior
              right: "1rem", // Margen derecho
              zIndex: 1000, // Asegura que el botón esté por encima de otros elementos
              backgroundColor: "rgba(0, 0, 0, 0.05)", // Fondo semitransparente
              borderRadius: "12px", // Bordes redondeados
              padding: "0.5rem", // Espaciado interno
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)", // Sombra del botón
            }}
          >
            <ThemeToggleButton /> {/* Botón para alternar entre temas claro y oscuro */}
          </div>
        )}

        {/* Configuración de las rutas de la aplicación */}
        <Routes>
          {/* Redirige a la página de login o al dashboard según si hay un token */}
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" element={<LoginPage />} />
          {/* Ruta para el dashboard, solo accesible si hay un token */}
          <Route
            path="/dashboard/*"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App; // Exporta el componente para usarlo en otros archivos
