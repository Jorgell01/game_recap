import Navbar from "../components/Navbar";
import HistorialPartidas from "../components/HistorialPartidas";
import Estadisticas from "../components/Estadisticas";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [historial, setHistorial] = useState([]);
  const [usuarioStats, setUsuarioStats] = useState(null);

  const cargarDatosUsuario = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resHistorial, resStats] = await Promise.all([
        fetch("http://localhost:3000/api/user/history", { headers }),
        fetch("http://localhost:3000/api/user/stats", { headers }),
      ]);

      if (!resHistorial.ok || !resStats.ok) throw new Error("Error cargando datos");

      setHistorial(await resHistorial.json());
      setUsuarioStats(await resStats.json());
    } catch (err) {
      console.error("❌ Error al cargar datos:", err.message);
    }
  };

  useEffect(() => {
    if (token) cargarDatosUsuario();
  }, [token]);

  return (
    <div style={styles.wrapper}>
      <Navbar onLogout={() => navigate("/login")} />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/historial" />} />
          <Route path="/historial" element={<HistorialPartidas historial={historial} />} />
          <Route path="/estadisticas" element={<Estadisticas usuarioStats={usuarioStats} />} />
        </Routes>
      </main>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  },
  main: {
    flex: 1,
    width: "100%",
    padding: "2rem 3rem",
    boxSizing: "border-box",
    overflowY: "auto",
  },
};

export default DashboardPage;
