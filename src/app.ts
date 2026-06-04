import express from "express";
import { sessionConfig } from "./config/session.js";
import appRoutes from "./routes/app.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { render } from "./renderApp.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionConfig)

app.use(authRoutes);
app.use(appRoutes);

app.get("/{*splat}", (req, res) => {
  const html = render(req.url)
  res.send(html);
});

export default app;