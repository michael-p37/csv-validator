import { authController } from "@/controllers/auth.controllers.js";
import { render } from "@/entry-server";
import fs from "fs"
import { requireAuth, resdirectIfAuthenticated } from "@/middlewares/auth.middleware";
import { Router, type Request, type Response } from "express";
import path from "path";

const router = Router();

router.get("/", resdirectIfAuthenticated, async (req: Request, res: Response) => {
  const appHtml = await render(req.url);
  const template = fs.readFileSync(
    path.resolve("dist/client/index.html"),
    "utf-8"
  );

  const finalHtml = template.replace(
    "<!--app-html-->",
    typeof appHtml === "string" ? appHtml : ""
  );

  res.send(finalHtml)
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