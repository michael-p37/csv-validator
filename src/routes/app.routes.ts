import fs from "fs";
import path from "path";
import { render } from "@/entry-server";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { requireRole } from "@/middlewares/role.middleware.js";
import { Router, type Request, type Response } from "express";

const router = Router();

function renderPage(html: string) {
  const template = fs.readFileSync(path.resolve("dist/client/index.html"), "utf-8");
  return template.replace(`<!--app-html-->`, html);
}

// 🔒 usuario logueado
router.get("/upload", requireAuth, async (req: Request, res: Response) => {
  const appHtml = await render(req.url);
  res.send(renderPage(typeof appHtml === "string" ? appHtml : ""));
});

// 👑 solo admin
router.get("/admin", requireAuth, requireRole("ADMIN"), async (req: Request, res: Response) => {
  const appHtml = await render(req.url);
  res.send(renderPage(typeof appHtml === "string" ? appHtml : ""));
});

export default router;