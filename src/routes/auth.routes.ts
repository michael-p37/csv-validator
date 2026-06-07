import { authController } from "@/controllers/auth.controllers.js";
import { requireAuth, resdirectIfAuthenticated } from "@/middlewares/auth.middleware";
import { Router, type NextFunction, type Request, type Response } from "express";

const router = Router();

router.get("/", resdirectIfAuthenticated, (req, res, next) => {
  next();
})

router.post("/login", resdirectIfAuthenticated, authController.login);

router.post("/logout", requireAuth, authController.logout);

//router.get("/correction", requireAuth, renderApp);

// Devuelve la sesión actual (usada por los loaders del cliente)
router.get("/session", (req, res) => {
  if (req.session?.userId) {
    return res.json({ userId: req.session.userId, role: req.session.role || null });
  }
  return res.status(401).end();
});

export default router;