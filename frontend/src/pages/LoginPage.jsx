import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const location = useLocation();

  // Detectar si venimos de un login con token y mostrar toast
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("token")) {
      toast.success("✅ Inicio de sesión exitoso");
    }
  }, [location]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        padding: "2rem",
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
        transition: "background-color 0.3s ease, color 0.3s ease",
        position: "relative"
      }}
    >
      {/* Botón de tema visible solo aquí */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <ThemeToggleButton />
      </div>

      {/* Logo con animación */}
      <img
        src="/logo_web.png"
        alt="Logo Game Recap"
        style={{
          width: "100px",
          marginBottom: "1.5rem",
          transition: "transform 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />

      <div
        style={{
          backgroundColor: "var(--color-card)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "420px",
          transition: "background-color 0.3s ease"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "var(--color-primary)",
            fontFamily: "var(--font-title)",
            marginBottom: "1.5rem",
          }}
        >
          {mostrarRegistro ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        {mostrarRegistro ? (
          <>
            <RegisterForm onRegister={() => window.location.reload()} />
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--color-text)" }}>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setMostrarRegistro(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-primary)",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Iniciar sesión
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm />
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--color-text)" }}>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setMostrarRegistro(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-primary)",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Regístrate
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
