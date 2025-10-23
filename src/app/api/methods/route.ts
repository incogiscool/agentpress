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
          // const newMethod = {
          //   name: method.name,
          //   description: method.description,
          //   pathname,
          //   project_id: project._id.toString(),
          //   parameters: method.params, // Store params as JSON object
          //   request_method: method.method,
          //   user_id: project.user_id, // Associate with the project's user
          //   created_at: new Date(),
          //   updated_at: new Date(),
          // };
          // Create new method document
          const newMethod = await MethodModel.create({
            name: method.name,
            description: method.description,
            pathname,
            project_id: project._id.toString(),
            parameters: method.params, // Store params as JSON object
            request_method: method.method,
            user_id: project.user_id, // Associate with the project's user
            created_at: new Date(),
            updated_at: new Date(),
          });

          console.log("inserted method ", newMethod);
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
