import { useEffect, useState } from "react"; // Importa hooks de React para manejar estado y efectos
import LoginForm from "../components/LoginForm"; // Importa el formulario de inicio de sesión
import RegisterForm from "../components/RegisterForm"; // Importa el formulario de registro
import ThemeToggleButton from "../components/ThemeToggleButton"; // Importa el botón para alternar entre temas
import { useLocation } from "react-router-dom"; // Importa el hook para obtener la ubicación actual
import toast from "react-hot-toast"; // Importa la librería para mostrar notificaciones

// Componente principal para la página de inicio de sesión y registro
const LoginPage = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false); // Estado para alternar entre el formulario de inicio de sesión y registro
  const location = useLocation(); // Obtiene la ubicación actual de la URL

  // Efecto que detecta si venimos de un login exitoso con token y muestra un mensaje
  useEffect(() => {
    const params = new URLSearchParams(location.search); // Obtiene los parámetros de la URL
    if (params.get("token")) {
      toast.success("✅ Inicio de sesión exitoso"); // Muestra una notificación de éxito
    }
  }, [location]);

  // Renderiza la página
  return (
    <div
      style={{
        display: "flex", // Usa flexbox para organizar los elementos
        flexDirection: "column", // Organiza los elementos en una columna
        alignItems: "center", // Centra los elementos horizontalmente
        justifyContent: "center", // Centra los elementos verticalmente
        height: "100vh", // Altura completa de la ventana
        width: "100vw", // Ancho completo de la ventana
        padding: "2rem", // Espaciado interno
        fontFamily: "var(--font-body)", // Fuente principal
        backgroundColor: "var(--color-background)", // Fondo según el tema
        color: "var(--color-text)", // Color del texto según el tema
        transition: "background-color 0.3s ease, color 0.3s ease", // Transiciones suaves para cambios de estilo
        position: "relative", // Posicionamiento relativo para el botón de tema
      }}
    >
      {/* Botón para alternar entre temas */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <ThemeToggleButton />
      </div>

      {/* Logo con animación */}
      <img
        src="/logo_web.png" // Ruta del logo
        alt="Logo Game Recap" // Texto alternativo para accesibilidad
        style={{
          width: "100px", // Ancho del logo
          marginBottom: "1.5rem", // Espaciado inferior
          transition: "transform 0.3s ease", // Transición suave para la animación
          cursor: "pointer", // Cambia el cursor al pasar el mouse
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")} // Aumenta el tamaño al pasar el mouse
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Restaura el tamaño al quitar el mouse
      />

      {/* Contenedor del formulario */}
      <div
        style={{
          backgroundColor: "var(--color-card)", // Fondo del contenedor según el tema
          padding: "2rem", // Espaciado interno
          borderRadius: "12px", // Bordes redondeados
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Sombra del contenedor
          width: "100%", // Ancho completo
          maxWidth: "420px", // Ancho máximo
          transition: "background-color 0.3s ease", // Transición suave para cambios de estilo
        }}
      >
        {/* Título dinámico según el formulario mostrado */}
        <h2
          style={{
            textAlign: "center", // Centra el texto
            color: "var(--color-primary)", // Color principal según el tema
            fontFamily: "var(--font-title)", // Fuente del título
            marginBottom: "1.5rem", // Espaciado inferior
          }}
        >
          {mostrarRegistro ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        {/* Muestra el formulario de registro o inicio de sesión según el estado */}
        {mostrarRegistro ? (
          <>
            {/* Formulario de registro */}
            <RegisterForm onRegister={() => window.location.reload()} />
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--color-text)" }}>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setMostrarRegistro(false)} // Cambia al formulario de inicio de sesión
                style={{
                  background: "transparent", // Fondo transparente
                  border: "none", // Sin borde
                  color: "var(--color-primary)", // Color principal
                  fontWeight: "bold", // Texto en negrita
                  cursor: "pointer", // Cambia el cursor al pasar el mouse
                }}
              >
                Iniciar sesión
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Formulario de inicio de sesión */}
            <LoginForm />
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--color-text)" }}>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setMostrarRegistro(true)} // Cambia al formulario de registro
                style={{
                  background: "transparent", // Fondo transparente
                  border: "none", // Sin borde
                  color: "var(--color-primary)", // Color principal
                  fontWeight: "bold", // Texto en negrita
                  cursor: "pointer", // Cambia el cursor al pasar el mouse
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

export default LoginPage; // Exporta el componente para usarlo en otros archivos
