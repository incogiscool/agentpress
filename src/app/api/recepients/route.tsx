import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();

  const nameMap = {
    adam: "1",
    katie: "2",
  };

  if (userId) {
    // Get name from query parameters
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

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
