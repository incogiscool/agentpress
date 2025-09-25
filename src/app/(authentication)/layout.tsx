import { AuthPageLayout } from "@/components/layout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthPageLayout>{children}</AuthPageLayout>;
}
