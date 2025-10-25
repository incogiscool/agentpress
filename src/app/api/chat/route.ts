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
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database/database";

export async function POST(request: NextRequest) {
  // Connect to database first
  await connectToDatabase();

  const user = await auth();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const {
    messages,
    project_id,
    auth_token,
  }: { messages: UIMessage[]; project_id: string; auth_token?: string } =
    await request.json();

  // console.log({ project_id, auth_token });
  const methods = await MethodModel.find({
    project_id,
    user_id: user.userId,
  });
  const project = await ProjectModel.findOne({
    _id: project_id,
    user_id: user.userId,
  });

  const baseUrl = project?.base_url;

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

          // Call the external API endpoint
          const response = await fetch(`${baseUrl}${method.pathname}`, {
            method: method.request_method || "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth_token || ""}`,
            },
            body:
              method.request_method === "GET"
                ? undefined
                : JSON.stringify(input),
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
