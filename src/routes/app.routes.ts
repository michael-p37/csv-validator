import { requireAuth } from "@/middlewares/auth.middleware.js";
import { requireRole } from "@/middlewares/role.middleware.js";
import { Router } from "express";

const router = Router();

//unction renderPage(html: string) {
// const template = fs.readFileSync(path.resolve("dist/client/index.html"), "utf-8");
// return template.replace(`<!--app-html-->`, html);
//

// 🔒 usuario logueado
router.get("/upload", requireAuth, (req, res, next) => {
  next();
});

// 👑 solo admin
router.get("/admin", requireAuth, requireRole("ADMIN"), (req, res, next) => {
  next();
});

export default router;