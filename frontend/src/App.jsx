import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggleButton from "./components/ThemeToggleButton";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      navigate("/dashboard");
    }
  }, [location.search, navigate]);

  // Detectamos si estamos dentro del dashboard para no mostrar el botón extra
  const estaEnDashboard = location.pathname.startsWith("/dashboard");

  return (
    <ThemeProvider>
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Toaster position="top-center" reverseOrder={false} />

        {/* Mostrar solo si no estás en dashboard */}
        {!estaEnDashboard && (
          <div
            style={{
              position: "fixed",
              top: "1rem",
              right: "1rem",
              zIndex: 1000,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              padding: "0.5rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <ThemeToggleButton />
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
