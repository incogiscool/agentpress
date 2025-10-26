import type { ZodObject } from "zod";

export type Method = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  name: string;
  description: string;
  params?: ZodObject;
  paramsType?: "query" | "body";
};
