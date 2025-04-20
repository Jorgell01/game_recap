import { NavLink, useNavigate } from "react-router-dom"; // Importa NavLink para enlaces de navegación y useNavigate para redirecciones
import ThemeToggleButton from "./ThemeToggleButton"; // Importa el componente para alternar entre temas (claro/oscuro)
import "./Navbar.css"; // Importa los estilos específicos para la barra de navegación

// Componente principal para la barra de navegación
const Navbar = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token JWT del almacenamiento local
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión
  };

  // Renderiza la barra de navegación
  return (
    <nav className="navbar">
      {/* Sección izquierda de la barra de navegación */}
      <div className="navbar-left">
        {/* Logo de la aplicación */}
        <img
          src="/logo_web.png" // Ruta de la imagen del logo
          alt="Game Recap Logo" // Texto alternativo para accesibilidad
          className="navbar-logo" // Clase CSS para el logo
          onClick={() => navigate("/dashboard")} // Navega al dashboard al hacer clic en el logo
        />
        {/* Enlaces de navegación */}
        <NavLink to="/dashboard/historial">📜 Historial</NavLink> {/* Enlace al historial de partidas */}
        <NavLink to="/dashboard/estadisticas">📊 Estadísticas</NavLink> {/* Enlace a las estadísticas */}
        <NavLink to="/dashboard/community">🎮 Community Hub</NavLink> {/* Enlace al Community Hub */}
        <NavLink to="/dashboard/favoritos">⭐ Favoritos</NavLink> {/* Enlace a los favoritos */}
      </div>

      {/* Sección derecha de la barra de navegación */}
      <div className="navbar-right">
        <ThemeToggleButton /> {/* Botón para alternar entre temas claro y oscuro */}
        <button onClick={handleLogout} className="logout-btn">
          📕 Cerrar sesión {/* Botón para cerrar sesión */}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; // Exporta el componente para usarlo en otros archivos
