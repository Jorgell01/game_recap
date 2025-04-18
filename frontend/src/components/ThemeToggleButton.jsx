import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.05)", // transparente sutil
        border: "1px solid var(--color-card)",
        borderRadius: "12px",
        padding: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Cambiar tema"
    >
      {theme === "light" ? <Moon size={20} color="#333" /> : <Sun size={20} color="#fff" />}
    </button>
  );
};

export default ThemeToggleButton;
