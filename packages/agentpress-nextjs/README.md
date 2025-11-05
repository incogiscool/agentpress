# AgentPress Next.js

A React component library for building AI-powered chat interfaces with Next.js and AgentPress.

## Installation

```bash
# Using bun
bun add agentpress-nextjs

# Using npm
npm install agentpress-nextjs

# Using pnpm
pnpm add agentpress-nextjs
```

### Configure Tailwind CSS

Since `agentpress-nextjs` uses Tailwind CSS for styling, you need to add it to your Tailwind config's `content` array:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/agentpress-nextjs/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
```

This ensures Tailwind generates all the necessary styles for the AgentPress components.

## Quick Start

### 1. Setup AgentPress Project

Create a project at [AgentPress](https://agentpress.netlify.app/) and get your project ID.

### 2. Use the Chat Component

```tsx
import { AgentpressChat } from "agentpress-nextjs";

export default function Page() {
  return (
    <AgentpressChat projectId="your-project-id" authToken="your-auth-token" />
  );
}
```

### 3. Sync Your API Methods

Define your API methods inside of a route.methods.ts file in your route directory:

```typescript
// src/app/api/users/route.methods.ts
import { z } from "zod";

export const methods = [
  {
    method: "GET",
    name: "getUsers",
    description: "Get all users",
    params: undefined,
    paramsType: "query",
  },
  {
    method: "POST",
    name: "createUser",
    description: "Create a new user",
    params: z.object({
      name: z.string(),
      email: z.string().email(),
    }) // Or import your pre-existing zod validator,
    paramsType: "body",
  },
];
```

Sync to AgentPress:

```bash
# Set your secret key in .env.local
AGENTPRESS_SECRET_KEY="your-secret-key"

# Sync methods
bunx agentpress-sync
```

## Components

### AgentpressChat

Main chat component that provides a complete AI chat interface with streaming support.

**Props:**

- `projectId` (string, required): Your AgentPress project ID
- `authToken` (string | AuthTokenObject, optional): Authentication token for your api routes
  - String: Simple token value
  - Object: `{ type: "header" | "query", key: string, value: string }`
- `apiEndpoint` (string, optional): Custom API endpoint (defaults to your Next.js API route)
- `onToolCall` (function, optional): Callback function that runs when streaming completes and a tool/function was called. Useful for refreshing page state or refetching data.

**Example:**

```tsx
<AgentpressChat
  projectId="proj_123"
  authToken={{
    type: "header",
    key: "Authorization",
    value: "Bearer token_here",
  }}
/>
```

### Handling Tool Calls

When the AI calls a function/tool (like creating a user or updating data), you can automatically refresh your UI to reflect those changes:

```tsx
"use client";

import { AgentpressChat } from "agentpress-nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <AgentpressChat
      projectId="proj_123"
      authToken={token}
      onToolCall={() => router.refresh()}
    />
  );
}
```

Or pass the router.refresh directly:

```tsx
<AgentpressChat
  projectId="proj_123"
  authToken={authToken}
  onToolCall={router.refresh}
/>
```

You can also use `onToolCall` for custom logic like refetching specific data:

```tsx
<AgentpressChat
  projectId="proj_123"
  authToken={authToken}
  onToolCall={(tools) => {
    // Refetch users instead of full page refresh
    refreshFrontendOrSomething(tools);

    // Or show a toast notification
    toast.success("Action completed!");
  }}
/>
```

### Setup

1. Create `route.methods.ts` files in your API routes:

```typescript
// src/app/api/products/route.methods.ts
import { productSchema } from "@/lib/schemas";

export const methods = [
  {
    method: "GET",
    name: "getProducts",
    description: "Fetch all products",
    params: undefined,
    paramsType: "query",
  },
  {
    method: "POST",
    name: "createProduct",
    description: "Create a new product",
    params: productSchema,
    paramsType: "body",
  },
];
```

2. Set environment variable:

```bash
AGENTPRESS_SECRET_KEY="your-secret-key"
```

3. Run the sync command:

```bash
bunx agentpress-sync
```

### CLI Output

```
🔍 Scanning API routes for methods...
Found 3 route file(s)
✓ Found 2 method(s) in /api/users
✓ Found 2 method(s) in /api/products
✓ Found 1 method(s) in /api/messages
📤 Uploading 3 route(s) to AgentPress...
✅ Methods uploaded successfully!
```

## API Reference

### Types

```typescript
export type AuthTokenObject = {
  type: "header" | "query";
  key: string;
  value: string;
};

export type Method = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  name: string;
  description: string;
  params?: ZodSchema;
  paramsType: "body" | "query";
};
```

## Requirements

- React 19+
- Next.js 15+
- Tailwind CSS (for styling)
- TypeScript (recommended)
- **Zod v4+** (required for schema validation and JSON Schema conversion)
