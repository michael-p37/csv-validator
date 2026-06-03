import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth.js";

const prisma = new PrismaClient();

await prisma.user.create({
  data: {
    email: "admin@test.com",
    password: await hashPassword("admin123"),
    role: "ADMIN"
  }
});