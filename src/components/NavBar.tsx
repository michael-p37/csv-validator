import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function NavBar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-group">
          <h1 className="site-brand">
            Sistema de carga de datos
          </h1>
          <span className="site-description">Validación y carga de datos personales</span>
        </div>
        <Button
          onClick={handleLogout}
          className="btn-secondary w-auto px-4"
        >
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
