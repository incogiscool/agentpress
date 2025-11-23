import type { ZodObject } from "zod";

export type Method = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  name: string;
  description: string;
  params?: ZodObject;
  paramsType?: "query" | "body";
};

export type ActionMethod = {
  name: string;
  id: string;
  description: string;
  argumentsSchema?: ZodObject;
  // TODO: Make this typesafe
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  execute: Function;
};
