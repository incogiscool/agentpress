import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  jsonSchema,
  stepCountIs,
  Tool,
} from "ai";
import { MethodModel, ProjectModel } from "@/lib/database/models";
import { connectToDatabase } from "@/lib/database/database";
import { Method, Project } from "@/lib/database/types";

export async function POST(request: NextRequest) {
  // Connect to database first
  await connectToDatabase();

  const {
    messages,
    project_id,
    auth_token,
  }: {
    messages: UIMessage[];
    project_id: string;
    auth_token?:
      | string
      | {
          type: "header" | "query";
          key: string;
          value: string;
        };
  } = await request.json();

  // Validate that the request is coming from an accepted origin
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const project = await ProjectModel.findOne<Project>({
    _id: project_id,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const baseUrl = project.base_url;

  // Validate request origin matches the project's base URL
  if (baseUrl) {
    try {
      const projectUrl = new URL(baseUrl);
      const projectOrigin = `${projectUrl.protocol}//${projectUrl.host}`;

      // Check if request origin or referer matches the project's base URL
      const isValidOrigin = origin === projectOrigin;
      const isValidReferer = referer?.startsWith(projectOrigin);

      if (!isValidOrigin && !isValidReferer) {
        throw new Error(
          `Request rejected: Origin must be from ${projectOrigin}`
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Request rejected")
      ) {
        throw error;
      }
      // If URL parsing fails, log but continue (for backwards compatibility)
      console.warn("Failed to parse base URL for origin validation:", error);
    }
  }

  // console.log({ project_id, auth_token });
  const methods = await MethodModel.find<Method>({
    project_id,
    user_id: project.user_id,
  });

  const toolsObj: Record<string, Tool> = {};

  if (methods) {
    methods.forEach((method) => {
      toolsObj[method.name || "Unnamed Tool"] = tool({
        name: method.name || "Unnamed Tool",
        description: method.description || "No description provided",
        inputSchema: jsonSchema(method.parameters || {}),
        execute: async (input: unknown) => {
          // console.log(`Executing tool: ${method.name}`, input);

          // console.log(baseUrl + method.pathname);

          if (!baseUrl) {
            throw new Error("Project base URL is not defined");
          }

          // Build headers based on auth_token format
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          // Handle auth_token - can be string or object
          if (auth_token) {
            if (typeof auth_token === "string") {
              // String format - use as Bearer token
              headers.Authorization = `Bearer ${auth_token}`;
            } else if (auth_token.type === "header") {
              // Object format with header type
              headers[auth_token.key] = auth_token.value;
            }
            // Note: query params will be handled in the URL construction
          }

          // Build URL with query params if needed
          let url = `${baseUrl}${method.pathname}`;

          // Handle query params based on paramsType
          const urlParams = new URLSearchParams();

          // Add auth token if it's a query type
          if (
            auth_token &&
            typeof auth_token === "object" &&
            auth_token.type === "query"
          ) {
            urlParams.append(auth_token.key, auth_token.value);
          }

          // Add method parameters if paramsType is "query"
          if (
            method.params_type === "query" &&
            input &&
            typeof input === "object"
          ) {
            Object.entries(input).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                urlParams.append(key, String(value));
              }
            });
          }

          // Append query params to URL if any exist
          if (urlParams.toString()) {
            url += `?${urlParams.toString()}`;
          }

          // Determine body based on paramsType
          const shouldSendBody =
            method.request_method !== "GET" && method.params_type !== "query";

          // Call the external API endpoint
          const response = await fetch(url, {
            method: method.request_method || "POST",
            headers,
            body: shouldSendBody ? JSON.stringify(input) : undefined,
          });

          if (!response.ok) {
            throw new Error(
              `Error calling ${method.name}: ${response.statusText}`
            );
          }

          const data = await response.json();
          return data;
        },
      });
    });
  }

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are an AI assistant that helps users by utilizing available tools to provide accurate and efficient responses. Use the tools when necessary to gather information or perform actions on behalf of the user.",
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10), // stop after 10 steps if tools were called
    // tools: toolsObj,
    tools: {
      ...toolsObj,
    },
  });

  return result.toUIMessageStreamResponse();
}
