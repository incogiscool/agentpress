import { ActionMethod } from "agentpress-nextjs/lib/types";
import { getUserProjects } from "./lib/user/projects";
import {
  createUserProject,
  createUserProjectSchema,
  deleteUserProject,
  deleteUserProjectSchema,
  updateUserProject,
  updateUserProjectSchema,
} from "./lib/user/projects/actions";
import { deleteUserMethod, deleteUserMethodSchema } from "./lib/user/methods";
import {
  getUserMethodsByProject,
  getUserMethodsByProjectSchema,
} from "./lib/user/methods";

export const agentpressActions: ActionMethod[] = [
  {
    name: "getUserProjects",
    id: "getUserProjects",
    description: "Retrieve all projects for the authenticated user",
    execute: getUserProjects,
    argumentsSchema: undefined,
  },
  {
    name: "updateUserProject",
    id: "updateUserProject",
    description: "Update an existing project for the authenticated user",
    execute: updateUserProject,
    argumentsSchema: updateUserProjectSchema,
  },
  {
    name: "createUserProject",
    id: "createUserProject",
    description: "Create a new project for the authenticated user",
    execute: createUserProject,
    argumentsSchema: createUserProjectSchema,
  },
  {
    name: "deleteUserProject",
    id: "deleteUserProject",
    description: "Delete an existing project for the authenticated user",
    execute: deleteUserProject,
    argumentsSchema: deleteUserProjectSchema,
  },
  {
    name: "getUserMethodsByProject",
    id: "getUserMethodsByProject",
    description:
      "Retrieve all methods associated with a specific project for the authenticated user",
    execute: getUserMethodsByProject,
    argumentsSchema: getUserMethodsByProjectSchema,
  },
  {
    name: "deleteUserMethod",
    id: "deleteUserMethod",
    description: "Delete an existing method for the authenticated user",
    execute: deleteUserMethod,
    argumentsSchema: deleteUserMethodSchema,
  },
];
