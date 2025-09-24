import mongoose from "mongoose";
import { MethodSchema, ParamSchema, ProjectSchema } from "./schemas";

export const MethodModel = mongoose.model("Method", MethodSchema);
export const ParamModel = mongoose.model("Param", ParamSchema);
export const ProjectModel = mongoose.model("Project", ProjectSchema);
