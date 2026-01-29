"use client";
import { agentpressActions } from "@/actions.agentpress";
import { AgentpressChat } from "agentpress-nextjs";
import { useRouter } from "next/navigation";

export const ChatComponentAgent = () => {
  const router = useRouter();

  return (
    <AgentpressChat
      projectId={"697a9d5b068e86e66f409f51"}
      apiEndpoint="http://localhost:3000/api/chat"
      actions={agentpressActions}
      onToolCall={router.refresh}
    />
  );
};
