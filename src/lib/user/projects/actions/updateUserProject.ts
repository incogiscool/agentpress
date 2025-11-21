"use server";
import { connectToDatabase } from "@/lib/database/database";
import { ProjectModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";
import {
  updateUserProjectSchema,
  type UpdateUserProjectSchemaType,
} from "../schemas";

/**
 * Updates an existing project for the authenticated user
 * @param args - Object containing projectId, name, and baseUrl
 * @returns void
 * @throws Error if user is not authenticated, project not found, or update fails
 */
export async function updateUserProject(
  args: UpdateUserProjectSchemaType
): Promise<void> {
  const { projectId, name, baseUrl } = updateUserProjectSchema.parse(args);

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
