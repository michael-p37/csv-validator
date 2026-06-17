import {
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  console.log("ERROR PAGE:", error);

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <p>404</p>
        <h1>Página no encontrada</h1>
        <p>No pudimos encontrar la página que estás buscando.</p>
        <button>
          <Link to="/">Regresar al inicio</Link>
        </button>
      </div>
    );
  }

  return (
    <pre>
      {JSON.stringify(error, null, 2)}
    </pre>
  );
}