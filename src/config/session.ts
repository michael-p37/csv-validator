import { prisma } from "@/db/prisma";
import env from "@/env.js";
import type { Request } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";


declare module "express-session" {
  interface SessionData {
    userId?: number;
    role?: "ADMIN" | "USER";
  }
}

export const sessionConfig = session({
    secret: env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 1000 * 60 * 60 * 24, // limpia expiradas cada 24 horas
        dbRecordIdIsSessionId: false,
      }
    ),
    cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
 });
 
// Promisified version of req.session.save
export function saveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }
      resolve();
    });
  });
}

// Promisified version of req.session.destroy
export function destroySession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      resolve();
    });
  });
}
