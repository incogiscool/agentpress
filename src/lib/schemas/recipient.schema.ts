import { z } from "zod";

export const recipientSchema = z.object({
  name: z.string().min(2).max(100),
});

export type RecipientInput = z.infer<typeof recipientSchema>;
