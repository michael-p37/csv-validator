import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-group">
          <h1 className="site-brand">
            CSV Validator
          </h1>
          <span className="site-description">Validación y carga de archivos CSV</span>
        </div>
      </div>
    </header>
  );
}
