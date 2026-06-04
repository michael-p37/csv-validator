import express from "express";
import authRoutes from "./routes/auth.routes.js";
import appRoutes from "./routes/app.routes.js";
import fs from "fs";
import path from "path";  
import { sessionConfig } from "./config/session.js";
import { render } from "./entry-server.js";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("dist/client"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionConfig)

app.use(authRoutes);
app.use(appRoutes);

app.get("/{*splat}", async (req, res) => {
   const html = await render(req.url);

  // si es Response (redirect, etc)
  if (html instanceof Response) {
    res.status(html.status);

    const location = html.headers.get("Location");
    if (location) {
      return res.redirect(location);
    }

    return res.end();
  }

  // aquí ya es string seguro
  const template = fs.readFileSync( path.resolve("index.html"), "utf-8" );

  const finalHtml = template.replace(`<!--app-html-->`, html);
  
  res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});