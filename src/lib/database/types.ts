import { InferSchemaType } from "mongoose";
import { MethodSchema, ParamSchema, ProjectSchema } from "./schemas";

export type Project = InferSchemaType<typeof ProjectSchema> & { _id: string };
export type Method = InferSchemaType<typeof MethodSchema> & { _id: string };
export type Param = InferSchemaType<typeof ParamSchema> & { _id: string };
