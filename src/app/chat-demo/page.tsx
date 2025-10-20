"use client";

import { AgentpressChat } from "@/components/(MOVE_TO_PACKAGE)/Chat";

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AgentPress Chat Widget Demo
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A floating chat widget powered by Vercel AI SDK
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold mb-2">Vercel AI SDK</h3>
              <p className="text-sm text-muted-foreground">
                Built with useChat hook and DefaultChatTransport
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="font-semibold mb-2">Unread Counter</h3>
              <p className="text-sm text-muted-foreground">
                Shows number of new messages when closed
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Tool Support</h3>
              <p className="text-sm text-muted-foreground">
                Handles tool calls and multi-part messages
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="p-8 bg-card rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Click the chat button</h3>
                <p className="text-sm text-muted-foreground">
                  Look for the floating button in the bottom-right corner
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Start chatting</h3>
                <p className="text-sm text-muted-foreground">
                  Type your message and press Enter or click Send
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Minimize or close</h3>
                <p className="text-sm text-muted-foreground">
                  Use the minimize button to collapse or X to close
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-md">
              <p className="text-sm font-mono whitespace-pre-wrap">
                {`<AgentpressChat
  project_id="your-project-id"
  auth_token="your-auth-token"
  agentName="AgentPress Assistant"
  position="bottom-right"
  defaultOpen={false}
/>`}
              </p>
            </div>
          </div>

          {/* Scroll Content */}
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold">Scroll to Test Widget</h2>
            <p className="text-muted-foreground">
              The chat widget stays fixed in position as you scroll down the
              page.
            </p>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2">
                  Demo Content Block {i + 1}
                </h3>
                <p className="text-muted-foreground">
                  This is example content to demonstrate how the chat widget
                  remains accessible while scrolling through the page. The
                  widget maintains its position and functionality regardless of
                  where you are on the page.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Widget - This stays fixed on the page */}
      <AgentpressChat />
    </div>
  );
}
