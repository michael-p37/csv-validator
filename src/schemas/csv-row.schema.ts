import { z } from "zod";

export const csvRowSchema = z.object({
  name: z
  .string()
  .min(1, "Nombre requerido")
  .trim()
  .pipe(
    z.string().regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      "El nombre solo puede contener letras"
    )
  ),

  email: z.email("Email inválido"),

  age: z.coerce
    .number("La edad debe ser un dato numérico")
    .int("La edad debe ser un numero entero")
    .min(0)
    .max(120)
    .positive("La edad debe ser un numero entero positivo"),
})
.refine(data => data.age >= 18, 
  { 
    message: "Debe ser mayor de edad",
    path: ["edad"],
  }
);

export type CsvRow = z.infer<typeof csvRowSchema>;

export const uploadErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});
