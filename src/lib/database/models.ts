import mongoose from "mongoose";
import { MethodSchema, ParamSchema, ProjectSchema } from "./schemas";

export const MethodModel =
  mongoose.models.Methods || mongoose.model("Methods", MethodSchema);

// Note: The param model might not be needed right now since we are embedding parameters in methods.
export const ParamModel =
  mongoose.models.Params || mongoose.model("Params", ParamSchema);

export const ProjectModel =
  mongoose.models.Projects || mongoose.model("Projects", ProjectSchema);
