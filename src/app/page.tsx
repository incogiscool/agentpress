"use client";
import { AgentpressChat } from "agentpress-nextjs";
import { PageLayout } from "@/components/layout";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const auth = useAuth();

  // console.log(token);

  if (auth.userId) {
    console.log("Fetching token for authenticated user");
    auth.getToken().then((t) => {
      // console.log("Received token:", t);
      setToken(t);

      console.log(token);
    });
  }

  return (
    <PageLayout>
      {token && (
        <AgentpressChat
          projectId="68fa90f160a0801894e6231c"
          authToken={token}
        />
      )}
    </PageLayout>
  );
}
