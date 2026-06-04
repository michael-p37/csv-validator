import type { NextFunction, Request, Response } from "express";

export function requireRole(role: "ADMIN") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.redirect("/login");
    }
    
    if (req.session.role !== role) {
      return res.status(403).json({ message: "Restricted" });
    }
    next();
  };
}