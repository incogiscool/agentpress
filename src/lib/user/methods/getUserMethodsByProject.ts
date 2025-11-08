"use server";
import { connectToDatabase } from "@/lib/database/database";
import { flattenAllObjectIds } from "@/lib/database/helpers";
import { MethodModel } from "@/lib/database/models";
import { Method } from "@/lib/database/types";
import { auth } from "@clerk/nextjs/server";

/**
 * Gets all methods for the currently authenticated user given a project ID
 * @param projectId - The ID of the project to fetch methods for
 * @returns Array of user's methods for the specified project or empty array if no methods found
 * @throws Error if user is not authenticated
 */
export default async function getUserMethodsByProject(
  projectId: string
): Promise<Method[]> {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not authenticated");
  }

  // Connect to database
  await connectToDatabase();

  // Fetch all methods for the user and project
  const methods = await MethodModel.find({
    user_id: user.userId,
    project_id: projectId,
  })
    .sort({ created_at: -1 }) // Sort by newest first
    .lean() // Return plain JavaScript objects instead of Mongoose documents
    .exec();

  return flattenAllObjectIds(methods) as Method[];
}
