"use server";
import { connectToDatabase } from "@/lib/database/database";
import { ProjectModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

/**
 * Creates a new project for the authenticated user
 * @param name - The name of the project
 * @param baseUrl - The base URL for the project
 * @returns The created project
 * @throws Error if user is not authenticated or if creation fails
 */
export default async function createUserProject(
  name: string,
  baseUrl: string
): Promise<void> {
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
