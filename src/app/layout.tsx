import type { Metadata } from "next";
import { Sansation } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const sansation = Sansation({
  variable: "--font-sansation",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Agentpress",
  description: "Add AI agents to your Next.js app in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${sansation.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
