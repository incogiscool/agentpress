import { connectToDatabase } from "@/lib/database/database";
import { MethodModel, ProjectModel } from "@/lib/database/models";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    const data = await request.json();
    const secret_key = request.headers.get("Authorization");

    console.log({ secret_key });

    // Find project by secret_key
    const project = await ProjectModel.findOne({ secret_key });

    if (!project) {
      return new Response(
        JSON.stringify({ error: "Project not found or invalid secret key" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log({ project });

    // Process each object in the data array
    for (const obj of data) {
      const pathname = obj.pathname;
      const methods = obj.methods;

      console.log(obj);
      console.log({ pathname, methods });

      if (methods) {
        for (const method of methods) {
          // Use updateOne with upsert to either update existing or create new
          const result = await MethodModel.updateOne(
            {
              // Find by unique combination of pathname, name, and project_id
              pathname,
              name: method.name,
              project_id: project._id.toString(),
              user_id: project.user_id,
            },
            {
              $set: {
                description: method.description,
                parameters: method.params, // Store params as JSON object
                params_type: method.paramsType || "body", // Store params type, default to "body"
                request_method: method.method,
                updated_at: new Date(),
              },
              $setOnInsert: {
                created_at: new Date(),
              },
            },
            {
              upsert: true, // Create if doesn't exist, update if exists
            }
          );

          console.log(
            result.upsertedCount > 0
              ? `✓ Created method: ${method.name}`
              : `✓ Updated method: ${method.name}`
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Methods received" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing methods:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process methods",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
