import { Schema } from "mongoose";

export const MethodSchema = new Schema({
  id: String,
  name: String,
  description: String,
  created_at: Date,
  updated_at: Date,
  pathname: String,
  project_id: String,
  parameters: Object,
  request_method: String,
});

export const ParamSchema = new Schema({
  id: String,
  name: String,
  description: String,
  required: Boolean,
  type: String,
  method_id: String,
  created_at: Date,
  updated_at: Date,
});

export const ProjectSchema = new Schema({
  id: String,
  name: String,
  description: String,
  project_id: String,
  base_url: String,
  secret_key: String,
  created_at: Date,
  updated_at: Date,
});
