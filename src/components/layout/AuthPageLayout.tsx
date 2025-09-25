import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-2">
        <Link
          href={"/"}
          className="flex text-sm items-center space-x-2 hover:text-foreground/80 transition cursor-pointer w-fit"
        >
          <ArrowLeft size={18} /> <span>Back to home</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
