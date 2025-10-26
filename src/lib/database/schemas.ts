import { Schema } from "mongoose";

export const MethodSchema = new Schema(
  {
    name: String,
    user_id: String,
    description: String,
    created_at: Date,
    updated_at: Date,
    pathname: String,
    project_id: String,
    parameters: Object,
    request_method: String,
    params_type: String,
  },
  { _id: true }
);

export const ParamSchema = new Schema(
  {
    name: String,
    user_id: String,
    description: String,
    required: Boolean,
    type: String,
    method_id: String,
    created_at: Date,
    updated_at: Date,
  },
  { _id: true }
);

export const ProjectSchema = new Schema(
  {
    name: String,
    user_id: String,
    description: String,
    base_url: String,
    secret_key: String,
    created_at: Date,
    updated_at: Date,
  },
  { _id: true }
);
