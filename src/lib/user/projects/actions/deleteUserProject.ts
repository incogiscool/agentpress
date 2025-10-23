"use server";
import { connectToDatabase } from "@/lib/database/database";
import { ProjectModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";

/**
 * Deletes an existing project for the authenticated user
 * @param projectId - The ID of the project to delete
 * @returns void
 * @throws Error if user is not authenticated, project not found, or deletion fails
 */
export default async function deleteUserProject(
  projectId: string
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

  await ProjectModel.deleteOne({
    _id: projectId,
    user_id: user.userId,
  });
}
