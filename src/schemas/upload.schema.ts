import {z} from "zod"
export const uploadResponseSchema = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  errors: z.array(
    z.object({
      row: z.number(),
      issues: z.array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string(),
        })
      ),
    })
  ).optional(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;