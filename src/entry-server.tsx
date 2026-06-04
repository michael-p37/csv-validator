import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, RouterProvider, StaticRouter, StaticRouterProvider } from "react-router-dom";
import { url } from "inspector/promises";
import { routes } from "./router";

export async function render(url: string) {
  const handler = createStaticHandler(routes);

  const request = new Request("http://localhost" + url);

  const result = await handler.query(request);

  // CASO 1: redirect o response
  if (result instanceof Response) {
    return result;
  }
  // CASO 2: SSR normal
  const staticRouter = createStaticRouter(routes, result);

  const html = renderToString(
    <StaticRouterProvider router={staticRouter} context={result} />
  );

    return html
}
