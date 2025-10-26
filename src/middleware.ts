import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit } from "@/lib/upstash/ratelimit";

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Apply rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const result = await ratelimit.limit(ip);

  if (!result.success) {
    return new NextResponse("Too many requests", { status: 429 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
