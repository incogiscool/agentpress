/**
 * AgentPress Method Discovery & Upload Script
 *
 * This script scans your API routes for exported `methods` arrays,
 * converts Zod schemas to JSON Schema, and uploads them to the AgentPress database.
 *
 * Usage: bun run run.ts
 */

import fs from "fs";
import path from "path";
import { z } from "zod";

// Types
interface Method {
  name: string;
  description: string;
  method: string;
  params?: z.ZodType;
}

interface ProcessedMethod {
  name: string;
  description: string;
  method: string;
  params?: Record<string, unknown>;
}

interface RouteResult {
  pathname: string;
  methods: ProcessedMethod[];
}

// Configuration
const API_DIR = path.join(__dirname, "src/app/api");
const API_ENDPOINT = "http://localhost:3000/api/methods";
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
 * Main execution function
 */
async function main() {
  console.log("🔍 Scanning API routes for methods...\n");

  const routeFiles = findRouteFiles(API_DIR);
  console.log(`Found ${routeFiles.length} route file(s)\n`);

  const results: RouteResult[] = [];

  for (const file of routeFiles) {
    try {
      const routeModule = await import(file);

      // Skip if no methods exported
      if (!routeModule.methods || !Array.isArray(routeModule.methods)) {
        continue;
      }

      // Process each method
      const methods: ProcessedMethod[] = routeModule.methods.map(
        (method: Method) => {
          const processed: ProcessedMethod = {
            name: method.name,
            description: method.description,
            method: method.method,
          };

          // Convert Zod schema to JSON Schema if present
          if (method.params) {
            try {
              processed.params = z.toJSONSchema(method.params) as Record<
                string,
                unknown
              >;
            } catch (error) {
              console.warn(
                `⚠️  Warning: Could not convert Zod schema for ${method.name}:`,
                error
              );
            }
          }

          return processed;
        }
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
