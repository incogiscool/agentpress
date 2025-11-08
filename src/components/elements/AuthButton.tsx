"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AuthButtons() {
  const { userId, isLoaded } = useAuth();
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";

  if (!isLoaded) {
    // TODO - Return a loading state while the auth is loading
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {!userId && (
        <Link className="text-sm text-muted-foreground" href={"/signup"}>
          Sign up
        </Link>
      )}
      <Link href={userId ? (isDashboardPage ? "/" : "/dashboard") : "/signin"}>
        <Button>
          {userId ? (
            <span className="flex items-center gap-2">
              {isDashboardPage ? "Go to Home" : "Go to Dashboard"}{" "}
              <ArrowRight />
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </Link>
      <UserButton />
    </div>
  );
}
