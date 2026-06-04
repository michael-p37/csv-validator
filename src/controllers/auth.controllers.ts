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
        return res.sendStatus(401).send("Correo electrónico o contraseña inválidos");
      }

      if (!user.password) {
        return res.sendStatus(401).send("Correo electrónico o contraseña inválidos");
      }

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        return res.sendStatus(401).send("Correo electrónico o contraseña inválidos");
      }

      // guardando datos en sesión
      req.session.userId = user.id;
      req.session.role = user.role;

      await saveSession(req);

      return res.status(200).json({ ok: true, redirect: "/dashboard" });

    } catch (error) {
      return next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err instanceof Error ? err : new Error(String(err)));
        }
      })

      res.clearCookie("connect.sid");

      return res.status(200).json({ ok: true, redirect: "/login" });
    } catch (error) {
      return next(error);
    }
  },
}