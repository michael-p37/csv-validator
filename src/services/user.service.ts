import { userRepository } from "@/repositories/user.repository.js";
import { comparePassword } from "@/utils/auth.js";
export const userService = {
  async findUserByEmail(email: string, ) {
    const user = await userRepository.findByEmail(email);
  
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return user;
  },

}