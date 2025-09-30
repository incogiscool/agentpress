import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await auth();

  if (!user.userId) {
    redirect("/signin");
  }

  return <main>{children}</main>;
}
