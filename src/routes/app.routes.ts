import { requireAuth } from "@/middlewares/auth.middleware.js";
import { requireRole } from "@/middlewares/role.middleware.js";
import { Router } from "express";

const router = Router();

// 🔓 pública
router.get("/", (req, res) => {
  res.send("index");
});

// 🔒 usuario logueado
router.get("/dashboard", requireAuth, (req, res) => {
  res.send("dashboard");
});

// 👑 solo admin
router.get( "/admin", requireAuth, requireRole("ADMIN"), (req, res) => {
    res.send("admin");
  }
);

export default router;