import {z} from "zod"
export const uploadResponseSchema = z.object({
  ok: z.boolean(),
  uploadJobId: z.string(),
  totalRows: z.number(),
  validRows: z.number(),
  invalidRows: z.number(),
  duplicateRows: z.number(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;

export const bulkUpdateRowSchema = z.object({
  id: z.string(),
  uploadJobId: z.string(),
  name: z.string(),
  email: z.string().email(),
  age:  z.coerce.number(),
  isValid: z.boolean()
});

export const bulkUpdateRowsSchema = z.array(
  bulkUpdateRowSchema
);
