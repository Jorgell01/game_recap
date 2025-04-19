// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo_web.png"
          alt="Game Recap Logo"
          className="navbar-logo"
          onClick={() => navigate("/dashboard")}
        />
        <NavLink to="/dashboard/historial">📜 Historial</NavLink>
        <NavLink to="/dashboard/estadisticas">📊 Estadísticas</NavLink>
        <NavLink to="/dashboard/community">🎮 Community Hub</NavLink>
        <NavLink to="/dashboard/favoritos">⭐ Favoritos</NavLink>
      </div>

      <div className="navbar-right">
        <ThemeToggleButton />
        <button onClick={handleLogout} className="logout-btn">
          📕 Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
