import { prisma } from "@/db/prisma.js";
export const userRepository =  {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
 }
}
    