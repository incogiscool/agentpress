"use client";
import { AgentpressChat } from "agentpress-nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const auth = useAuth();

  // console.log(token);

  useEffect(() => {
    if (auth.userId) {
      console.log("Fetching token for authenticated user");
      auth.getToken().then((t) => {
        setToken(t);

        // console.log("Token fetched:", t);
      });
    }
  }, [auth, auth.userId, auth.getToken]);

  return (
    <PageLayout>
      {token && (
        <AgentpressChat
          projectId="68fa90f160a0801894e6231c"
          authToken={token}
          apiEndpoint={
            process.env.NEXT_PUBLIC_AGENTPRESS_API_BASE_URL
              ? process.env.NEXT_PUBLIC_AGENTPRESS_API_BASE_URL + "/chat"
              : undefined
          }
        />
      )}
    </PageLayout>
  );
}
