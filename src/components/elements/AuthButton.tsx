"use client";

import { useAuth } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AuthButton() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    // Return a loading state while the auth is loading
    return null;
  }

  return (
    <Link href={userId ? "/dashboard" : "/sign-in"}>
      <Button>
        {userId ? (
          <span className="flex items-center gap-2">
            Go to Dashboard <ArrowRight />
          </span>
        ) : (
          "Sign In"
        )}
      </Button>
    </Link>
  );
}
