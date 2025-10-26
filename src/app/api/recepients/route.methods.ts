import { recipientSchema } from "@/lib/schemas";
import { Method } from "agentpress-nextjs";

export const methods: Method[] = [
  {
    method: "GET",
    name: "getRecipientId",
    description: "Get a recipient's id by their name",
    params: recipientSchema,
    paramsType: "query",
  },
];
