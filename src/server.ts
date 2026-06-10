import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import authRoutes from "../src/routes/auth.routes.js";
import appRoutes from "../src/routes/app.routes.js";
import uploadRoutes from "../src/routes/upload.routes.js"
import fs from "fs";
import path from "path";  
import { sessionConfig } from "../src/config/session.js";
import {createServer as createViteServer, type ViteDevServer } from "vite";

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

const app = express();
// Development-friendly Content Security Policy to allow local assets (overrides external CSP)
if (isProduction) {
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
    );
    next();
  });
} else {
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      [
      "default-src 'self'",
      "connect-src 'self' ws: wss: http: https:",
      "img-src 'self' data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "style-src 'self' 'unsafe-inline'",
      "worker-src 'self' blob:"
    ].join("; ")
    );
    next();
  });
}

let vite: ViteDevServer;

if (isProduction) {
  app.use(express.static("dist/client", { index: false }));
} else {
  vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });
  app.use(vite.middlewares);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionConfig)

app.use(authRoutes);
app.use(appRoutes);
app.use(uploadRoutes);

async function renderPageRoute(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId && (req.path === "/" || req.path === "/login")) {
    return res.redirect("/upload");
  }

  let render;
  
  if (isProduction) {
    render = (await import("../src/entry-server.js")).render;
  } else {
    render = (
      await vite.ssrLoadModule(
        "/src/entry-server.tsx"
      )
    ).render;
  }
  
  const result =await render(req.url);
  let template: string;

  if (isProduction) {
    template = fs.readFileSync(
      path.resolve("dist/client/index.html"),
      "utf-8"
    );
  } else {
    template = fs.readFileSync(
      path.resolve("index.html"),
      "utf-8"
    );

    template = await vite.transformIndexHtml(
      req.originalUrl,
      template
    );
  }

  if (result instanceof Response) {
    const location = result.headers.get("Location");
  
    if (location) {
      return res.redirect(location);
    }
  
    return res.status(result.status).end();
  }
  
  const finalHtml = template.replace(
    "<!--app-html-->",
    result
  );

  return res.status(200).send(finalHtml);
}
app.get("/", renderPageRoute);
app.get("/*splat", renderPageRoute);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});