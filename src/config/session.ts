import env from "@/env.js";
import session from "express-session";
 export const sessionConfig = session({
    secret: env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
 })