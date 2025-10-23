import { AgentpressChat } from "@/components/(MOVE_TO_PACKAGE)/Chat";
import { ProjectCard } from "@/components/features/dashboard";
import { PageLayout } from "@/components/layout";
import { Header } from "@/components/typography";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const token = (await (await auth()).getToken()) || "";

  return (
    <PageLayout>
      <p>asdasd</p>
      <AgentpressChat projectId="68fa90f160a0801894e6231c" authToken={token} />
    </PageLayout>
  );
}
