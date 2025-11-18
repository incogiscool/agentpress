import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  className?: string;
  children: ReactNode;
}

export default function PageLayout({ className, children }: PageLayoutProps) {
  return (
    <div className={"min-h-screen"}>
      <Navbar className="px-6 py-4" />
      <main className={cn("px-6 py-6", className)}>{children}</main>
    </div>
  );
}
