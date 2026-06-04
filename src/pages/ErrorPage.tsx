import { Link } from "react-router";

export function ErrorPage() {
  return (
    <div >
      <p >404</p>
      <h1 >Página no encontrada</h1>
      <p >
        No pudimos encontrar la página que estás buscando.
      </p>
      <button>
        <Link to="/">Regresar al inicio</Link>
      </button>
    </div>
  );
}
