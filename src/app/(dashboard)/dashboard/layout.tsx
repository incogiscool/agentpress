import PageLayout from "@/components/layout/PageLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ChatComponentAgent } from "./chatcomponentagent";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await auth();

  if (!user.userId) {
    redirect("/signin");
  }

  return (
    <PageLayout>
      <ChatComponentAgent />
      {children}
    </PageLayout>
  );
}
