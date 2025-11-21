import { z } from "zod";

export const createUserProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  baseUrl: z.string().url("Invalid URL format"),
});

export type CreateUserProjectSchemaType = z.infer<
  typeof createUserProjectSchema
>;

export const updateUserProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  name: z.string().min(1, "Project name is required"),
  baseUrl: z.string().url("Invalid URL format"),
});

export type UpdateUserProjectSchemaType = z.infer<
  typeof updateUserProjectSchema
>;

export const deleteUserProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
});

export type DeleteUserProjectSchemaType = z.infer<
  typeof deleteUserProjectSchema
>;

export const getUserProjectsSchema = z.object({});

export type GetUserProjectsSchemaType = z.infer<typeof getUserProjectsSchema>;
