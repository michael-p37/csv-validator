import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export function render(reqUrl: string) {
  const html = renderToString(
    <StaticRouter location={reqUrl}>
      <App />
    </StaticRouter>
  );
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CSV Validator</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script type="module" src="/main.js"></script>
      </body>
    </html>
  `;

}