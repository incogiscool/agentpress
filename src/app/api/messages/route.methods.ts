import { sendMessageSchema } from "@/lib/schemas";
import { Method } from "agentpress-nextjs";

export const methods: Method[] = [
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
