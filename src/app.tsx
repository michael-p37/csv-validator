import express from "express";
import { renderToString } from "react-dom/server";
import {LoginPage} from "./pages/LoginPage.js";
import { sessionConfig } from "./config/session.js";

const app = express();

app.use(express.json());

app.use(sessionConfig)

app.get("/", (req, res) => {
  const html = renderToString(
    <LoginPage />
  );
  res.send(html);
});

export default app;