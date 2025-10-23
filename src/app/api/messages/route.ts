import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import twilio from "twilio";

const sendMessageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1).max(1000),
});

export const methods = [
  {
    method: "GET",
    name: "getMessages",
    description: "Get all the message chains I have with other users.",
    params: undefined,
  },
  {
    method: "POST",
    name: "sendMessage",
    description: "Send a message to another user.",
    params: sendMessageSchema,
  },
];

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export const GET = async () => {
  const { userId } = await auth();

  if (userId) {
    const messages = [
      {
        name: "Adam",
        id: "1",
      },
      {
        name: "Katie",
        id: "2",
      },
    ];

    return NextResponse.json({ messages });
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
};

export const POST = async (req: NextRequest) => {
  const data = await auth();

  console.log(data);

  if (data.userId) {
    const result = sendMessageSchema.safeParse(await req.json());

    if (result.success) {
      const { recipientId, content } = result.data;
      const map = {
        "1": "16138518814",
      };

      try {
        const message = await client.messages.create({
          body: content,
          from: process.env.TWILIO_PHONE_NUMBER,
          // @ts-expect-error any
          to: map[recipientId],
        });
        return NextResponse.json({ success: true, message: message.sid });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false }, { status: 500 });
      }

      // Here you would add the message to the database or any other storage
      //   return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
};
