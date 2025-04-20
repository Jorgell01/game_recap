import { useState } from "react"; // Importa el hook useState para manejar el estado
import toast from "react-hot-toast"; // Importa la librería para mostrar notificaciones
import "../components/LoginForm.css"; // Importa los estilos específicos para este componente

// Componente principal para el formulario de inicio de sesión
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState(""); // Estado para almacenar el correo electrónico ingresado
  const [password, setPassword] = useState(""); // Estado para almacenar la contraseña ingresada

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
      // Realiza una solicitud al backend para iniciar sesión
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST", // Método HTTP para enviar datos
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido
        body: JSON.stringify({ email, password }), // Envía el correo y la contraseña en el cuerpo de la solicitud
      });

      const data = await res.json(); // Convierte la respuesta a JSON

      if (!res.ok) {
        // Si la respuesta no es exitosa, muestra un mensaje de error
        toast.error(data.error || "Error al iniciar sesión");
        return;
      }

      // Si el inicio de sesión es exitoso, guarda el token en el almacenamiento local
      localStorage.setItem("token", data.token);
      toast.success("¡Sesión iniciada!"); // Muestra una notificación de éxito
      onLogin?.(); // Llama a la función `onLogin` si está definida
    } catch (err) {
      // Si ocurre un error, muestra un mensaje de error
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  // Renderiza el formulario de inicio de sesión
  return (
    <form className="login-form" onSubmit={handleLogin}>
      {/* Campo para ingresar el correo electrónico */}
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email} // Valor actual del estado `email`
        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado al escribir
        required // Campo obligatorio
      />

      {/* Campo para ingresar la contraseña */}
      <input
        type="password"
        placeholder="Contraseña"
        value={password} // Valor actual del estado `password`
        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado al escribir
        required // Campo obligatorio
      />

      {/* Botón para enviar el formulario */}
      <button type="submit">Iniciar sesión</button>

      {/* Separador visual */}
      <hr style={{ margin: "1rem 0", borderColor: "var(--color-card)" }} />

      {/* Botón para iniciar sesión con Steam */}
      <button
        type="button"
        className="steam-button"
        onClick={() => {
          // Redirige al usuario a la ruta de autenticación con Steam
          window.location.href = "http://localhost:3000/api/auth/steam";
        }}
      >
        🎮 Iniciar sesión con Steam
      </button>
    </form>
  );
};

export default LoginForm; // Exporta el componente para usarlo en otros archivos
