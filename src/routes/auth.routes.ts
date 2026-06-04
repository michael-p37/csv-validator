import { authController } from "@/controllers/auth.controllers.js";
import { Router } from "express";

const router = Router();

router.post("/login", authController.login);

router.post("/logout", authController.logout);

export default router;