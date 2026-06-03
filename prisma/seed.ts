import "dotenv/config";
import { Role } from "@prisma/client";
import  {prisma} from"../src/db/prisma.js";
import { hashPassword } from "../src/utils/auth.js";

await prisma.user.create({
  data: {
    name: "AdminUser",
    email: "admin@test.com",
    password: await hashPassword("admin123"),
    role: Role.ADMIN,
  }
});