import express, { type NextFunction, type Request, type Response } from "express";
import authRoutes from "./routes/auth.routes.js";
import appRoutes from "./routes/app.routes.js";
import fs from "fs";
import path from "path";  
import { sessionConfig } from "./config/session.js";
import { render } from "./entry-server.js";
const PORT = process.env.PORT || 3000;

const app = express();

// Development-friendly Content Security Policy to allow local assets (overrides external CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Serve only static assets; disable serving index.html so SSR can inject the page
app.use(express.static("dist/client", { index: false }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionConfig)

app.use(authRoutes);
app.use(appRoutes);

async function renderPageRoute(req: Request, res: Response, next: NextFunction) {
  const result =await render(req.url);

  const template = fs.readFileSync(
    path.resolve("dist/client/index.html"),
    "utf-8"
  );

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