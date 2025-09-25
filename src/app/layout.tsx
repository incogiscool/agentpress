import type { Metadata } from "next";
import { SUSE } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./providers";
import { Navbar, PageLayout } from "@/components/layout";

const suse = SUSE({
  variable: "--font-suse",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
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
      <html suppressHydrationWarning lang="en">
        <body className={`${suse.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PageLayout>{children}</PageLayout>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
