import { useState } from "react"; // Importa el hook useState para manejar el estado
import toast from "react-hot-toast"; // Importa la librería para mostrar notificaciones
import "../components/RegisterForm.css"; // Importa los estilos específicos para este componente

// Componente principal para el formulario de registro
const RegisterForm = ({ onRegister }) => {
  // Estados para almacenar los valores ingresados por el usuario
  const [nombre, setNombre] = useState(""); // Estado para el nombre de usuario
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
      // Realiza una solicitud al backend para registrar al usuario
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST", // Método HTTP para enviar datos
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido
        body: JSON.stringify({ nombre, email, password }), // Envía los datos del formulario en el cuerpo de la solicitud
      });

      const data = await res.json(); // Convierte la respuesta a JSON

      if (!res.ok) {
        // Si la respuesta no es exitosa, muestra un mensaje de error
        toast.error(data.error || "Error al crear cuenta");
        return;
      }

      // Si el registro es exitoso, muestra una notificación de éxito
      toast.success("¡Cuenta creada! Inicia sesión");
      onRegister?.(); // Llama a la función `onRegister` si está definida
    } catch (err) {
      // Si ocurre un error, muestra un mensaje de error
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  // Renderiza el formulario de registro
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {/* Campo para ingresar el nombre de usuario */}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={nombre} // Valor actual del estado `nombre`
        onChange={(e) => setNombre(e.target.value)} // Actualiza el estado al escribir
        required // Campo obligatorio
      />

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
      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default RegisterForm; // Exporta el componente para usarlo en otros archivos
