import { InferSchemaType } from "mongoose";
import { MethodSchema, ParamSchema, ProjectSchema } from "./schemas";

export type Project = InferSchemaType<typeof ProjectSchema>;
export type Method = InferSchemaType<typeof MethodSchema>;
export type Param = InferSchemaType<typeof ParamSchema>;
