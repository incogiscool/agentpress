import z from "zod";

const postSchema = z.object({
  id: z.string().min(2).max(100).describe("The ID of the test"),
});

export const methods = [
  {
    method: "GET",
    name: "getTest",
    description: "Get all tests",
    params: undefined,
  },
  {
    method: "POST",
    name: "createTest",
    description: "Create a new test",
    params: postSchema,
  },
];

export async function GET(request: Request) {
  return new Response("Hello, world! <GET>");
}

export async function POST(request: Request) {
  const result = postSchema.safeParse(await request.json());
  if (!result.success) {
    return new Response("Invalid request body", { status: 400 });
  }
  return new Response("Hello, world! <POST>");
}
