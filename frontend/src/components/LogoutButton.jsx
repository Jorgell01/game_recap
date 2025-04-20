// Componente para manejar el cierre de sesión
const LogoutButton = ({ onLogout }) => {
  // Función que se ejecuta al hacer clic en el botón de cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token JWT del almacenamiento local
    if (onLogout) onLogout(); // Llama a la función `onLogout` si está definida
  };

  // Renderiza el botón de cerrar sesión
  return (
    <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
      🚪 Cerrar sesión {/* Texto e ícono del botón */}
    </button>
  );
};

export default LogoutButton; // Exporta el componente para usarlo en otros archivos
