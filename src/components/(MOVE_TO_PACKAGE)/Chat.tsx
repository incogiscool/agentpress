"use client";
import { MessageSquareCodeIcon, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "../ui/scroll-area";

export const AgentpressChat = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            id,
            messages,
          },
        };
      },
    }),
  });

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

  const handleSubmit = (
    prompt: string,
    selectedTools: string[],
    selectedMode: {
      name: string;
      badge?: string;
      disabled?: boolean;
      disabledReason?: string;
    }
  ) => {
    console.log("Submitting prompt:", prompt);
    sendMessage({
      text: prompt,
      metadata: {
        tools: selectedTools,
        mode: selectedMode.name,
      },
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hasMessages = messages.length > 0;

  console.log("Chat messages:", messages);

  return (
    <Card className="w-96 fixed bottom-4 right-4 flex flex-col">
      {hasMessages && (
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <MessageSquareCodeIcon className="size-5" />
            <h3 className="font-semibold">Chat</h3>
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-1">
        {!hasMessages ? (
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
          </Empty>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <p key={`${message.id}-${i}`} className="text-sm">
                              {part.text}
                            </p>
                          );
                        case "step-start":
                          return null; // Don't render step-start
                        default:
                          // Handle tool calls (type starts with "tool-")
                          if (part.type.startsWith("tool-")) {
                            const toolName = part.type.replace("tool-", "");
                            return (
                              <div key={`${message.id}-${i}`} className="mb-2">
                                <div className="rounded-lg px-3 py-2 bg-blue-50 border border-blue-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <p className="text-xs text-blue-800 font-medium">
                                      {toolName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="text-xs text-muted-foreground italic"
                            >
                              {part.type}
                            </div>
                          );
                      }
                    })}
                  </div>
                </div>
              ))}

              {/* Loading indicator when agent is thinking */}
              {(status === "streaming" || status === "submitted") && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        Agent is thinking...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="w-full border-t pt-4">
        <ChatInput
          onSubmit={handleSubmit}
          tools={tools}
          disabled={status === "streaming" || status === "submitted"}
        />
      </CardFooter>
    </Card>
  );
};
