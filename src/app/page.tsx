import { AgentpressChat } from "agentpress-nextjs";
import { PageLayout } from "@/components/layout";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const token = (await (await auth()).getToken()) || "";

  return (
    <PageLayout>
      <AgentpressChat projectId="68fa90f160a0801894e6231c" authToken={token} />
    </PageLayout>
  );
}
