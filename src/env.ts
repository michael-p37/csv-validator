import dotenv from "dotenv";

dotenv.config();

interface Env {
  DATABASE_URL: string;
  SESSION_SECRET: string;
  NODE_ENV?: string;
}

const env: Env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
  NODE_ENV: process.env["NODE_ENV"] || "development",
};
if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}
if (!env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}
export default env;