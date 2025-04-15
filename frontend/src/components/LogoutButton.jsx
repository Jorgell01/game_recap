const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
      🚪 Cerrar sesión
    </button>
  );
};

export default LogoutButton;
