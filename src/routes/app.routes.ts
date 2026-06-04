import { render } from "@/entry-server";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { requireRole } from "@/middlewares/role.middleware.js";
import { Router } from "express";

const router = Router();

// 🔒 usuario logueado
router.get("/dashboard", requireAuth, async (req, res) => {
  const html = render(req.url);
  res.send(html);
});

// 👑 solo admin
router.get( "/admin", requireAuth, requireRole("ADMIN"), async (req, res) => {
    const html = render(req.url);
    res.send(html);
  }
);

export default router;