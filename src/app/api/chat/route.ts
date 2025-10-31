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
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const baseUrl = project.base_url;
  let allowedOrigin = origin || "";

  // Validate request origin matches the project's base URL
  if (baseUrl) {
    try {
      const projectUrl = new URL(baseUrl);
      const projectOrigin = `${projectUrl.protocol}//${projectUrl.host}`;

      // Check if request origin or referer matches the project's base URL
      const isValidOrigin = origin === projectOrigin;
      const isValidReferer = referer?.startsWith(projectOrigin);

      if (!isValidOrigin && !isValidReferer) {
        return new Response(
          JSON.stringify({
            error: `Request rejected: Origin must be from ${projectOrigin}`,
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      allowedOrigin = projectOrigin;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Request rejected")
      ) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      console.warn("Failed to parse base URL for origin validation:", error);
    }
  }

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
          if (!baseUrl) {
            throw new Error("Project base URL is not defined");
          }

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          if (auth_token) {
            if (typeof auth_token === "string") {
              headers.Authorization = `Bearer ${auth_token}`;
            } else if (auth_token.type === "header") {
              headers[auth_token.key] = auth_token.value;
            }
          }

          let url = `${baseUrl}${method.pathname}`;
          const urlParams = new URLSearchParams();

          if (
            auth_token &&
            typeof auth_token === "object" &&
            auth_token.type === "query"
          ) {
            urlParams.append(auth_token.key, auth_token.value);
          }

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

          if (urlParams.toString()) {
            url += `?${urlParams.toString()}`;
          }

          const shouldSendBody =
            method.request_method !== "GET" && method.params_type !== "query";

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
    stopWhen: stepCountIs(10),
    tools: {
      ...toolsObj,
    },
  });

  // Get the response and add CORS headers
  const response = result.toUIMessageStreamResponse();

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
