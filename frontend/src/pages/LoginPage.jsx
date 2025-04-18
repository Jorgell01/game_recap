import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const LoginPage = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

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
        transition: "background-color 0.3s ease, color 0.3s ease"
      }}
    >
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
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => setMostrarRegistro(false)}>Iniciar sesión</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onLogin={() => window.location.reload()} />
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              ¿No tienes cuenta?{" "}
              <button onClick={() => setMostrarRegistro(true)}>Regístrate</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
