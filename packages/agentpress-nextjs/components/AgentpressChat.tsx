"use client";
import { MessageSquareCodeIcon, Loader2, X } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { DefaultChatTransport } from "ai";

type AgentpressChatPrompt = {
  projectId: string;
  authToken?:
    | string
    | {
        type: "header" | "query";
        key: string;
        value: string;
      };
  apiEndpoint?: string;
  onToolCall?: () => void;
};

/**
 * @param projectId - The ID of the project to associate the chat with.
 * @param authToken - The auth token that will be sent to your API routes from the user (for protected features). Can be:
 *   - a raw token string (passed to the api as Authorization: "Bearer <token>")
 *   - an object describing transport: { type: "header" | "query", key: string, value: string }. Adjust this to the format your routes expect.
 * @param apiEndpoint - Optional custom API endpoint.
 * @param onToolCall - Optional callback function that runs when streaming completes and a tool/function was called.
 */
export const AgentpressChat = ({
  projectId,
  authToken,
  apiEndpoint = "https://agentpress.netlify.app/api/chat",
  onToolCall,
}: AgentpressChatPrompt) => {
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const previousStatusRef = useRef<string | null>(null);

  // Use a ref to store the latest authToken so the transport always has access to it
  const authTokenRef = useRef(authToken);

  // Update the ref whenever authToken changes
  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: apiEndpoint,
      body: () => ({
        project_id: projectId,
        /* The reason we are sending the auth_token in a with a ref here is because as of now (25/10/2025), useChat caches the transport
        and has no way to invalidate - meaning if the token changes, the old token will still be sent to the backend.
        
        This is a very janky fix but works for now

        From https://github.com/vercel/ai/issues/7819
        */
        auth_token: authTokenRef.current,
      }),
    }),
  });

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

  // Watch for streaming to stop and check if any tools were called
  useEffect(() => {
    // If we just stopped streaming (previous status was streaming, now it's not)
    if (previousStatusRef.current === "streaming" && status !== "streaming") {
      // Check if any message has tool calls
      const hasToolCalls = messages.some((message) =>
        message.parts.some((part) => part.type.startsWith("tool-"))
      );

      if (hasToolCalls) {
        console.log("Tool was called, running callback...");

        // If user provided a callback, use it; otherwise default to router.refresh()
        if (onToolCall) {
          onToolCall();
        } else {
          router.refresh();
        }
      }
    }

    // Update the previous status
    previousStatusRef.current = status;
  }, [status, messages, router, onToolCall]);

  const hasMessages = messages.length > 0;

  return (
    <>
      {isOpen ? (
        <Card className="w-96 fixed bottom-4 right-4 flex flex-col">
          {hasMessages && (
            <CardHeader className="border-b">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquareCodeIcon className="size-4" />
                  <h3 className="font-semibold">Chat</h3>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant={"ghost"}
                  size={"icon"}
                >
                  <X className="size-4" />
                </Button>
              </CardTitle>
            </CardHeader>
          )}

          {!hasMessages && (
            <CardHeader className="flex justify-end">
              <Button
                onClick={() => setIsOpen(false)}
                variant={"ghost"}
                size={"icon"}
              >
                <X className="size-4" />
              </Button>
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
                    Perform tasks and functions on the website, just by
                    chatting!
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
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
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
                                <p
                                  key={`${message.id}-${i}`}
                                  className="text-sm"
                                >
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
                                  <div
                                    key={`${message.id}-${i}`}
                                    className="mb-2"
                                  >
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
              onStop={stop}
              disabled={status === "streaming" || status === "submitted"}
              isStreaming={status === "streaming" || status === "submitted"}
            />
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="fixed bottom-4 right-4"
          onClick={() => setIsOpen(true)}
        >
          Open Agent
        </Button>
      )}
    </>
  );
};
