"use server";
import { connectToDatabase } from "@/lib/database/database";
import { ProjectModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import {
  createUserProjectSchema,
  type CreateUserProjectSchemaType,
} from "../schemas";

/**
 * Creates a new project for the authenticated user
 * @param args - Object containing name and baseUrl
 * @returns void
 * @throws Error if user is not authenticated or if creation fails
 */
export async function createUserProject(
  args: CreateUserProjectSchemaType
): Promise<void> {
  const { name, baseUrl } = createUserProjectSchema.parse(args);

  const user = await auth();

  if (!user.userId) {
    throw new Error("User not authenticated");
  }

  await connectToDatabase();

  const secretKey = randomUUID();

  const now = new Date();

  const newProject = {
    name,
    user_id: user.userId,
    description: "", // Optional, can be updated later
    base_url: baseUrl,
    secret_key: secretKey,
    created_at: now,
    updated_at: now,
  };

  await ProjectModel.create(newProject);
}
