import type { NextConfig } from "next";
import nextra from "nextra";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./src/mdx-components.ts",
    },
  },
  /* config options here */
};

// Set up Nextra with its configuration
const withNextra = nextra({
  contentDirBasePath: "/docs", // Nextra will only handle routes starting with /docs
});

// Export the final Next.js config with Nextra included
export default withNextra({
  // ... Add regular Next.js options here
  ...nextConfig,
});
