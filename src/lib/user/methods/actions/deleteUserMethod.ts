"use server";
import { connectToDatabase } from "@/lib/database/database";
import { MethodModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";

/**
 * Deletes an existing method for the authenticated user
 * @param methodId - The ID of the method to delete
 * @returns void
 * @throws Error if user is not authenticated, method not found, or deletion fails
 */
export default async function deleteUserMethod(
  methodId: string
): Promise<void> {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not authenticated");
  }

  await connectToDatabase();

  const method = await MethodModel.findOne({
    _id: methodId,
    user_id: user.userId,
  });

  if (!method) {
    throw new Error("Method not found or access denied");
  }

  await MethodModel.deleteOne({
    _id: methodId,
    user_id: user.userId,
  });
}
