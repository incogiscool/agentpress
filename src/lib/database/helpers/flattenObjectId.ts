import { ObjectId } from "mongoose";

/**
 * Flattens a single ObjectId in an object by converting the _id field to a string
 * @param obj - The object containing an _id field to flatten
 * @returns The object with _id converted to a string representation
 */
export default function flattenObjectId(
  obj: object & { _id: ObjectId | unknown }
) {
  const { _id, ...rest } = obj;

  return {
    ...rest,
    _id: _id?.toString(), // Convert ObjectId to string
  };
}
