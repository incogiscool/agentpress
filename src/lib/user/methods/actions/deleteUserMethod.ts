"use server";
import { connectToDatabase } from "@/lib/database/database";
import { MethodModel } from "@/lib/database/models";
import { auth } from "@clerk/nextjs/server";
import {
  deleteUserMethodSchema,
  type DeleteUserMethodSchemaType,
} from "../schemas";

/**
 * Deletes an existing method for the authenticated user
 * @param args - Object containing methodId
 * @returns void
 * @throws Error if user is not authenticated, method not found, or deletion fails
 */
export async function deleteUserMethod(
  args: DeleteUserMethodSchemaType
): Promise<void> {
  const { methodId } = deleteUserMethodSchema.parse(args);

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
