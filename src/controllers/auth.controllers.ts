import { saveSession } from "@/config/session.js";
import { loginSchema } from "@/schemas/auth.schema.js";
import { userService } from "@/services/user.service.js";
import { comparePassword } from "@/utils/auth.js";
import type { NextFunction, Request, Response } from "express";
import { ca, tr } from "zod/locales";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await userService.findUserByEmail(email);

      if (!user) {
        throw new Error(
          "Correo electrónico o contraseña inválidos"
        );
      }

      if (!user.password) {
        throw new Error(
          "Correo electrónico o contraseña inválidos"
        );
      }

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new Error(
          "Correo electrónico o contraseña inválidos"
        );
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      await saveSession(req);

      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  
    res.redirect("/dashboard");
  }
}