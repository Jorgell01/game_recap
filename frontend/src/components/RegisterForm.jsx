import { useState } from "react";
import toast from "react-hot-toast";
import "../components/RegisterForm.css"; // <-- nuevo

const RegisterForm = ({ onRegister }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al crear cuenta");
        return;
      }

      toast.success("¡Cuenta creada! Inicia sesión");
      onRegister?.();
    } catch (err) {
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default RegisterForm;
