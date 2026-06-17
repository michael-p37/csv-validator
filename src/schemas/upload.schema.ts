import {z} from "zod"
export const uploadResponseSchema = z.object({
  ok: z.boolean(),
  uploadJobId: z.string(),
  totalRows: z.number(),
  validRows: z.number(),
  invalidRows: z.number(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;