import { ReactNode } from "react";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar className="px-6 py-4" />
      <main className="px-6 py-6">{children}</main>
    </div>
  );
}
