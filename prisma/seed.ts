import bcrypt from "bcryptjs";
import { prisma } from "../src/db/prisma.js";
import { hashPassword } from "../src/utils/auth.js";

await prisma.user.create({
  data: {
    email: "admin@test.com",
    password: await hashPassword("admin123"),
    role: "ADMIN"
  }
});