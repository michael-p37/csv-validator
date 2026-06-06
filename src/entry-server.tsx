import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom";
import { routeObjects } from "./router";

export async function render(url: string) {
  const handler = createStaticHandler(routeObjects);

  const request = new Request("http://localhost" + url);

  const context = await handler.query(request);

  if (context instanceof Response) {
    return context;
  }

  const router = createStaticRouter(routeObjects, context);

  return renderToString(
    <StaticRouterProvider router={router} context={context} />
  );
}
