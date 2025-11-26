"use client";
import { agentpressActions } from "@/actions.agentpress";
import { AgentpressChat } from "agentpress-nextjs";
import { useRouter } from "next/navigation";

export const ChatComponentAgent = () => {
  const router = useRouter();

  return (
    <AgentpressChat
      projectId={"69228fd1e17ebdfb058867fb"}
      apiEndpoint="http://localhost:3000/api/chat"
      actions={agentpressActions}
      onToolCall={router.refresh}
    />
  );
};
