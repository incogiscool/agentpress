import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
});

export const methods = [
  {
    method: "GET",
    name: "getRecipientId",
    description: "Get a recipient's id by their name",
    params: schema,
  },
];

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();

  const nameMap = {
    adam: "1",
    katie: "2",
  };

  if (userId) {
    const { name } = await req.json();

    if (name && typeof name === "string") {
      //@ts-expect-error any
      const recipientId = nameMap[name.toLowerCase()];

      if (recipientId) {
        return NextResponse.json({ id: recipientId });
      }
    }

    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
};
