import { ObjectId } from "mongoose";
import flattenObjectId from "./flattenObjectId";

/**
 * Flattens ObjectIds in an array of objects by converting all _id fields to strings
 * @param objects - Array of objects containing _id fields to flatten
 * @returns Array of objects with _id fields converted to string representations
 */
export default function flattenAllObjectIds(
  objects: (object & { _id: ObjectId | unknown })[]
) {
  return objects.map(flattenObjectId);
}
