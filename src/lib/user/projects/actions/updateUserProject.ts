"use server";
import { connectToDatabase } from "@/lib/database/database";
import { ProjectModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";

/**
 * Updates an existing project for the authenticated user
 * @param projectId - The ID of the project to update
 * @param name - The new name of the project
 * @param baseUrl - The new base URL for the project
 * @returns void
 * @throws Error if user is not authenticated, project not found, or update fails
 */
export default async function updateUserProject(
  projectId: string,
  name: string,
  baseUrl: string
): Promise<void> {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not authenticated");
  }

  await connectToDatabase();

  const project = await ProjectModel.findOne({
    _id: projectId,
    user_id: user.userId,
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  await ProjectModel.updateOne(
    { _id: projectId, user_id: user.userId },
    {
      name,
      base_url: baseUrl,
      updated_at: new Date(),
    }
  );
}
