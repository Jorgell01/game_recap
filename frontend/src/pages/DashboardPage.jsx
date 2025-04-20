import { useTheme } from "../context/ThemeContext"; // Importa el contexto del tema (claro/oscuro)
import Navbar from "../components/Navbar"; // Importa el componente de la barra de navegación
import HistorialPartidas from "../components/HistorialPartidas"; // Importa el componente para mostrar el historial de partidas
import Estadisticas from "../components/Estadisticas"; // Importa el componente para mostrar estadísticas
import ExploradorJuegos from "../components/ExploradorJuegos"; // Importa el componente para explorar juegos
import Favoritos from "../components/Favoritos"; // Importa el componente para mostrar los juegos favoritos
import GameDetail from "../components/GameDetail"; // Importa el componente para mostrar los detalles de un juego

import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Importa herramientas para manejar rutas
import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos

// Componente principal para la página del dashboard
const DashboardPage = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const { theme } = useTheme(); // Obtiene el tema actual (claro u oscuro) desde el contexto
  const [token, setToken] = useState(localStorage.getItem("token")); // Estado para almacenar el token JWT
  const [historial, setHistorial] = useState([]); // Estado para almacenar el historial de partidas
  const [usuarioStats, setUsuarioStats] = useState(null); // Estado para almacenar las estadísticas del usuario

  // Función para cargar los datos del usuario desde el backend
  const cargarDatosUsuario = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }; // Encabezados con el token JWT

      // Realiza solicitudes paralelas para obtener el historial y las estadísticas del usuario
      const [resHistorial, resStats] = await Promise.all([
        fetch("http://localhost:3000/api/user/history", { headers }), // Solicita el historial de partidas
        fetch("http://localhost:3000/api/user/stats", { headers }), // Solicita las estadísticas del usuario
      ]);

      // Si alguna de las respuestas no es exitosa, lanza un error
      if (!resHistorial.ok || !resStats.ok) throw new Error("Error cargando datos");

      // Actualiza los estados con los datos obtenidos
      setHistorial(await resHistorial.json());
      setUsuarioStats(await resStats.json());
    } catch (err) {
      console.error("❌ Error al cargar datos:", err.message); // Muestra un error en la consola si falla
    }
  };

  // Efecto que se ejecuta al montar el componente o cuando cambia el token
  useEffect(() => {
    if (token) cargarDatosUsuario(); // Si hay un token, carga los datos del usuario
  }, [token]);

  // Renderiza la página del dashboard
  return (
    <div
      style={{
        ...styles.wrapper, // Estilos generales del contenedor
        backgroundColor: theme === "light" ? "var(--color-background)" : "#242424", // Cambia el fondo según el tema
        color: theme === "light" ? "var(--color-text)" : "#ffffff", // Cambia el color del texto según el tema
      }}
    >
      <Navbar onLogout={() => navigate("/login")} /> {/* Barra de navegación con función de cierre de sesión */}
      <main style={styles.main}>
        <Routes>
          {/* Redirige a la ruta del historial por defecto */}
          <Route path="/" element={<Navigate to="/dashboard/historial" />} />
          {/* Ruta para el historial de partidas */}
          <Route path="/historial" element={<HistorialPartidas historial={historial} />} />
          {/* Ruta para las estadísticas del usuario */}
          <Route path="/estadisticas" element={<Estadisticas usuarioStats={usuarioStats} />} />
          {/* Ruta para explorar juegos */}
          <Route path="/community" element={<ExploradorJuegos />} />
          {/* Ruta para los detalles de un juego específico */}
          <Route path="/community/:id" element={<GameDetail />} />
          {/* Ruta para los juegos favoritos */}
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </main>
    </div>
  );
};

// Estilos en línea para el contenedor principal y el contenido
const styles = {
  wrapper: {
    display: "flex", // Usa flexbox para organizar los elementos
    flexDirection: "column", // Organiza los elementos en una columna
    height: "100vh", // Altura completa de la ventana
    width: "100vw", // Ancho completo de la ventana
  },
  main: {
    flex: 1, // Ocupa todo el espacio disponible
    width: "100%", // Ancho completo
    padding: "2rem 3rem", // Espaciado interno
    boxSizing: "border-box", // Incluye el padding en el tamaño total
    overflowY: "auto", // Permite el desplazamiento vertical si el contenido es demasiado grande
  },
};

export default DashboardPage; // Exporta el componente para usarlo en otros archivos
