import { requireAuth } from "@/middlewares/auth.middleware.js";
import { requireRole } from "@/middlewares/role.middleware.js";
import { render } from "@/renderApp";
import { Router } from "express";

const router = Router();

// 🔓 pública
router.get("/", (req, res) => {
  const html = render(req.url);
  res.send(html);
});

// 🔒 usuario logueado
router.get("/dashboard", requireAuth, (req, res) => {
  const html = render(req.url);
  res.send(html);
});

// 👑 solo admin
router.get( "/admin", requireAuth, requireRole("ADMIN"), (req, res) => {
    const html = render(req.url);
    res.send(html);
  }
);

export default router;