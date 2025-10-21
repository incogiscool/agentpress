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

  const methods = await MethodModel.find({
    project_id,
    user_id: user.userId,
  });
  const project = await ProjectModel.findOne({
    project_id,
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

  const testTools = {
    weather: tool({
      name: "Weather",
      description: "Get the weather in a location",
      inputSchema: jsonSchema({
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The location to get the weather for",
          },
        },
        required: ["location"],
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    calculator: tool({
      name: "Calculator",
      description: "Perform basic arithmetic operations",
      inputSchema: jsonSchema({
        type: "object",
        properties: {
          operation: {
            type: "string",
            enum: ["add", "subtract", "multiply", "divide"],
            description: "The arithmetic operation to perform",
          },
          a: {
            type: "number",
            description: "First number",
          },
          b: {
            type: "number",
            description: "Second number",
          },
        },
        required: ["operation", "a", "b"],
      }),
      execute: async ({ operation, a, b }) => {
        let result: number;
        switch (operation) {
          case "add":
            result = a + b;
            break;
          case "subtract":
            result = a - b;
            break;
          case "multiply":
            result = a * b;
            break;
          case "divide":
            if (b === 0) throw new Error("Cannot divide by zero");
            result = a / b;
            break;
          default:
            throw new Error("Invalid operation");
        }
        return {
          operation,
          a,
          b,
          result,
          expression: `${a} ${
            operation === "add"
              ? "+"
              : operation === "subtract"
              ? "-"
              : operation === "multiply"
              ? "*"
              : "/"
          } ${b} = ${result}`,
        };
      },
    }),
    textAnalyzer: tool({
      name: "Text Analyzer",
      description:
        "Analyze text content - count words, characters, or find patterns",
      inputSchema: jsonSchema({
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The text to analyze",
          },
          analysis: {
            type: "string",
            enum: ["wordCount", "characterCount", "sentenceCount", "uppercase"],
            description: "Type of analysis to perform",
          },
        },
        required: ["text", "analysis"],
      }),
      execute: async ({ text, analysis }) => {
        switch (analysis) {
          case "wordCount":
            const words = text
              .trim()
              .split(/\s+/)
              .filter((word: string) => word.length > 0);
            return {
              analysis: "wordCount",
              text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
              result: words.length,
              words: words,
            };
          case "characterCount":
            return {
              analysis: "characterCount",
              text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
              result: text.length,
              withSpaces: text.length,
              withoutSpaces: text.replace(/\s/g, "").length,
            };
          case "sentenceCount":
            const sentences = text
              .split(/[.!?]+/)
              .filter((s: string) => s.trim().length > 0);
            return {
              analysis: "sentenceCount",
              text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
              result: sentences.length,
              sentences: sentences,
            };
          case "uppercase":
            return {
              analysis: "uppercase",
              original: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
              result: text.toUpperCase(),
            };
          default:
            throw new Error("Invalid analysis type");
        }
      },
    }),
  };

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are an AI assistant that helps users by utilizing available tools to provide accurate and efficient responses. Return you responses in plain text format only. Do not use markdown formatting.",
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10), // stop after 10 steps if tools were called
    // tools: toolsObj,
    tools: {
      ...toolsObj,
      ...testTools,
    },
  });

  return result.toUIMessageStreamResponse();
}
