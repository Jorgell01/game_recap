import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Si usas Lucide

const BotonTema = () => {
  const [modoOscuro, setModoOscuro] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", modoOscuro ? "dark" : "light");
    localStorage.setItem("theme", modoOscuro ? "dark" : "light");
  }, [modoOscuro]);

  return (
    <button
      onClick={() => setModoOscuro((prev) => !prev)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        marginRight: "1rem",
      }}
      aria-label="Cambiar tema"
    >
      {modoOscuro ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default BotonTema;
