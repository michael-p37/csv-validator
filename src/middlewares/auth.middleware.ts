import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.redirect("/login");
  }
  next();
}
export function resdirectIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return res.redirect("/upload");
  }
  next();
}