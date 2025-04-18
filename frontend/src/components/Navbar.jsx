import { Link, useNavigate } from "react-router-dom";
import BotonTema from "./BotonTema"; // Asegúrate de tener este componente creado
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">🎮 Game Recap</span>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard/historial">📋 Historial</Link>
        <Link to="/dashboard/estadisticas">📊 Estadísticas</Link>
        <BotonTema /> {/* Botón claro/oscuro */}
        <button onClick={handleLogout}>🚪 Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
