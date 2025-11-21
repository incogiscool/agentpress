import { z } from "zod";

export const deleteUserMethodSchema = z.object({
  methodId: z.string().min(1, "Method ID is required"),
});

export type DeleteUserMethodSchemaType = z.infer<typeof deleteUserMethodSchema>;

export const getUserMethodsByProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
});

export type GetUserMethodsByProjectSchemaType = z.infer<
  typeof getUserMethodsByProjectSchema
>;
