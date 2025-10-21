import mongoose from "mongoose";
import { MethodSchema, ParamSchema, ProjectSchema } from "./schemas";

export const MethodModel =
  mongoose.models.Methods || mongoose.model("Methods", MethodSchema);
export const ParamModel =
  mongoose.models.Params || mongoose.model("Params", ParamSchema);
export const ProjectModel =
  mongoose.models.Projects || mongoose.model("Projects", ProjectSchema);
