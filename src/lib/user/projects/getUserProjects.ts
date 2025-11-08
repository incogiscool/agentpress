"use server";
import { connectToDatabase } from "@/lib/database/database";
import { flattenAllObjectIds } from "@/lib/database/helpers";
import { ProjectModel } from "@/lib/database/models";
import { Project } from "@/lib/database/types";
import { auth } from "@clerk/nextjs/server";

/**
 * Gets all projects for the currently authenticated user
 * @returns Array of user's projects or empty array if no projects found
 * @throws Error if user is not authenticated
 */
export default async function getUserProjects(): Promise<Project[]> {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not authenticated");
  }

  // Connect to database
  await connectToDatabase();

  // Fetch all projects for the user
  const projects = await ProjectModel.find({
    user_id: user.userId,
  })
    .sort({ created_at: -1 }) // Sort by newest first
    .lean() // Return plain JavaScript objects instead of Mongoose documents
    .exec();

  return flattenAllObjectIds(projects) as Project[];
}
