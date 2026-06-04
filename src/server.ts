import express from "express";
import authRoutes from "./routes/auth.routes.js";
import appRoutes from "./routes/app.routes.js";
import { render } from "./renderApp.js";
import { sessionConfig } from "./config/session.js";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("dist/client"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionConfig)

app.use(authRoutes);
app.use(appRoutes);

app.get("/{*splat}", (req, res) => {
  const html = render(req.url)
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});