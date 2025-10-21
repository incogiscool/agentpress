"use client";
import { MessageSquareCodeIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChatInput } from "./ChatInput";

export const AgentpressChat = () => {
  const tools = [
    {
      id: "database",
      title: "Database Query",
      description: "Query and manipulate database records",
    },
    {
      id: "email",
      title: "Send Email",
      description: "Send emails to users or teams",
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "Schedule and manage events",
    },
    {
      id: "documents",
      title: "Document Generator",
      description: "Create and edit documents",
    },
    {
      id: "code",
      title: "Code Executor",
      description: "Run code snippets and scripts",
    },
    {
      id: "search",
      title: "Web Search",
      description: "Search the web for information",
    },
    {
      id: "calculator",
      title: "Calculator",
      description: "Perform mathematical calculations",
    },
  ];

  return (
    <Card className="w-96 fixed bottom-4 right-4">
      {/* <CardHeader><CardTitle>New Chat</CardTitle></CardHeader> */}

      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareCodeIcon />
            </EmptyMedia>
            <EmptyTitle>What can I help you with?</EmptyTitle>
            <EmptyDescription>
              Perform tasks and functions on the website, just by chatting!
            </EmptyDescription>
          </EmptyHeader>
          {/* <EmptyContent>
            <Button>Start Chat</Button>
          </EmptyContent> */}
        </Empty>
      </CardContent>

      <CardFooter className="w-full">
        <ChatInput onSubmit={console.log} tools={tools} />
      </CardFooter>
    </Card>
  );
};
