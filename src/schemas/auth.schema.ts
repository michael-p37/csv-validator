import { email, z } from "zod";

export const loginSchema = z.object({
    email: z.email("Email es inválido").min(1, "Email es requerido"),
    password: z.string().min(1, "Password es requerido"),
});