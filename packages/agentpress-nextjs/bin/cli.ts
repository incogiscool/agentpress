#!/usr/bin/env bun
/**
 * AgentPress Method Discovery & Upload CLI
 *
 * This script scans your API routes for exported `methods` arrays,
 * converts Zod schemas to JSON Schema, and uploads them to the AgentPress database.
 *
 * Usage: bunx agentpress-sync
 *        bunx agentpress-sync --legacy-zod  (for Zod v3.x users)
 */

import fs from "fs";
import path from "path";
import { z } from "zod";

// Parse CLI arguments
const args = process.argv.slice(2);
const useLegacyZod = args.includes("--legacy-zod");

// Types
interface Method {
  name: string;
  description: string;
  method: string;
  params?: z.ZodType;
  paramsType?: "body" | "query";
}

interface ProcessedMethod {
  name: string;
  description: string;
  method: string;
  params?: Record<string, unknown>;
  paramsType: "body" | "query";
  actionId?: string;
}

interface RouteResult {
  pathname: string;
  methods: ProcessedMethod[];
}

/**
 * Converts a Zod schema to JSON Schema
 * Uses native z.toJSONSchema() for Zod 4+, or zod-to-json-schema for legacy Zod 3.x
 */
async function zodToJsonSchema(
  schema: z.ZodType
): Promise<Record<string, unknown>> {
  if (useLegacyZod) {
    try {
      const { zodToJsonSchema: legacyZodToJsonSchema } = await import(
        "zod-to-json-schema"
      );

      // @ts-expect-error Types dont match
      return legacyZodToJsonSchema(schema) as Record<string, unknown>;
    } catch {
      console.error(
        "❌ Error: --legacy-zod flag requires zod-to-json-schema package.\n" +
          "Please install it: bun add zod-to-json-schema"
      );
      process.exit(1);
    }
  }

  // Zod 4+ native method
  return z.toJSONSchema(schema) as Record<string, unknown>;
}

// Configuration - Look for API directory in the current working directory (where command is run)
const CWD = process.cwd();

// Try both routing patterns: src/app/api (with src) and app/api (without src)
const API_DIR_WITH_SRC = path.join(CWD, "src/app/api");
const API_DIR_WITHOUT_SRC = path.join(CWD, "app/api");

// Determine which pattern exists
let API_DIR: string;
if (fs.existsSync(API_DIR_WITH_SRC)) {
  API_DIR = API_DIR_WITH_SRC;
} else if (fs.existsSync(API_DIR_WITHOUT_SRC)) {
  API_DIR = API_DIR_WITHOUT_SRC;
} else {
  console.error(
    "❌ Error: API directory not found.\nLooked in:\n  - " +
      API_DIR_WITH_SRC +
      "\n  - " +
      API_DIR_WITHOUT_SRC +
      "\n\nMake sure you're running this command from your Next.js project root."
  );
  process.exit(1);
}

console.log(process.env.AGENTPRESS_SECRET_KEY);

const API_ENDPOINT = process.env.NEXT_PUBLIC_AGENTPRESS_API_BASE_URL
  ? process.env.NEXT_PUBLIC_AGENTPRESS_API_BASE_URL + "/api/methods"
  : "https://agentpress.netlify.app/api/methods";
const SECRET_KEY = process.env.AGENTPRESS_SECRET_KEY;

// Validate required environment variables
if (!SECRET_KEY) {
  console.error(
    "❌ Error: AGENTPRESS_SECRET_KEY environment variable is required"
  );
  process.exit(1);
}

/**
 * Recursively finds all route.methods.ts files in the API directory
 */
function findRouteFiles(dir: string): string[] {
  let results: string[] = [];

  try {
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        // Skip certain directories
        if (file === "node_modules" || file === ".next") continue;
        results = results.concat(findRouteFiles(filePath));
      } else if (file === "route.methods.ts") {
        results.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return results;
}

/**
 * Loads agentpressActions from actions.agentpress.ts file
 */
async function loadAgentpressActions(): Promise<RouteResult | null> {
  try {
    const actionsFilePath = path.join(CWD, "src/actions.agentpress.ts");
    const actionsFilePathNoSrc = path.join(CWD, "actions.agentpress.ts");

    let filePath: string;
    if (fs.existsSync(actionsFilePath)) {
      filePath = actionsFilePath;
    } else if (fs.existsSync(actionsFilePathNoSrc)) {
      filePath = actionsFilePathNoSrc;
    } else {
      // File doesn't exist, skip silently
      return null;
    }

    const actionsModule = await import(filePath);

    // Skip if no agentpressActions exported
    if (
      !actionsModule.agentpressActions ||
      !Array.isArray(actionsModule.agentpressActions)
    ) {
      return null;
    }

    const methods: ProcessedMethod[] = await Promise.all(
      actionsModule.agentpressActions.map(
        async (action: Record<string, unknown>) => {
          const processed: ProcessedMethod = {
            name: action.name as string,
            description: action.description as string,
            actionId: action.id as string,
            method: "ACTION",
            paramsType: "body",
          };

          // Convert Zod schema to JSON Schema if present
          if (action.argumentsSchema) {
            try {
              processed.params = await zodToJsonSchema(
                action.argumentsSchema as z.ZodType
              );
            } catch (error) {
              console.warn(
                `⚠️  Warning: Could not convert Zod schema for ${action.name}:`,
                error
              );
            }
          }

          return processed;
        }
      )
    );

    return {
      pathname: "ACTIONS",
      methods,
    };
  } catch (error) {
    console.error("❌ Error loading agentpressActions:", error);
    return null;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🔍 Scanning API routes for methods...");
  console.log(`📁 Using API directory: ${API_DIR}`);
  if (useLegacyZod) {
    console.log("📦 Using legacy Zod mode (zod-to-json-schema)");
  }
  console.log();

  // Check if Zod is available
  try {
    await import("zod");
  } catch {
    console.error(
      "❌ Error: Zod is required but not found in your project.\nPlease install Zod v4+: bun add zod@^4.0.0"
    );
    process.exit(1);
  }

  const results: RouteResult[] = [];

  // Load API route methods
  const routeFiles = findRouteFiles(API_DIR);
  console.log(`Found ${routeFiles.length} route file(s)\n`);

  for (const file of routeFiles) {
    try {
      const routeModule = await import(file);

      // Skip if no methods exported
      if (!routeModule.methods || !Array.isArray(routeModule.methods)) {
        continue;
      }

      // Process each method
      const methods: ProcessedMethod[] = await Promise.all(
        routeModule.methods.map(async (method: Method) => {
          const processed: ProcessedMethod = {
            name: method.name,
            description: method.description,
            method: method.method,
            paramsType: method.paramsType || "body", // Default to "body"
          };

          // Convert Zod schema to JSON Schema if present
          if (method.params) {
            try {
              processed.params = await zodToJsonSchema(method.params);
            } catch (error) {
              console.warn(
                `⚠️  Warning: Could not convert Zod schema for ${method.name}:`,
                error
              );
            }
          }

          return processed;
        })
      );

      // Get the relative path from API_DIR and convert to web path
      const relativePath = path.relative(API_DIR, file);
      const webPath =
        "/api/" +
        relativePath.replace(/\/?route\.methods\.ts$/, "").replace(/\\/g, "/");

      results.push({
        pathname: webPath === "/api/" ? "/api" : webPath,
        methods,
      });

      console.log(`✓ Found ${methods.length} method(s) in ${webPath}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  // Load agentpressActions
  const actionsResult = await loadAgentpressActions();
  if (actionsResult) {
    results.push(actionsResult);
    console.log(`✓ Found ${actionsResult.methods.length} action(s) in ACTIONS`);
  }

  if (results.length === 0) {
    console.log("\n⚠️  No methods found to upload");
    return;
  }

  console.log(
    `\n📤 Uploading ${results.length} route(s) to ${API_ENDPOINT}...\n`
  );

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(results),
      headers: {
        "Content-Type": "application/json",
        Authorization: SECRET_KEY || "",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Methods uploaded successfully!");
    console.log(result);
  } catch (error) {
    console.error("❌ Error uploading methods:");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
