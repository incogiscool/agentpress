# AgentPress CLI

Command-line tool for syncing your API methods to AgentPress.

## Installation

When published to npm, install globally:

```bash
bunx agentpress-sync
# or
npx agentpress-sync
```

## Development Usage

From your Next.js project root:

```bash
# Using bun
bun packages/agentpress-nextjs/bin/cli.ts

# Or add to package.json scripts
{
  "scripts": {
    "sync": "bun packages/agentpress-nextjs/bin/cli.ts"
  }
}
```

Then run:

```bash
bun run sync
```

## Requirements

- Have `route.methods.ts` files in your `src/app/api` directory

## Configuration

The CLI looks for:

- API routes in `src/app/api/**/*.methods.ts`
- Uploads to `NEXT_PUBLIC_AGENTPRESS_API_BASE_URL` or defaults to production

## Method Definition Example

```typescript
// src/app/api/users/route.methods.ts
import { userSchema } from "@/lib/schemas";

export const methods = [
  {
    method: "GET",
    name: "getUsers",
    description: "Get all users",
    params: undefined,
    paramsType: "query", // or "body"
  },
  {
    method: "POST",
    name: "createUser",
    description: "Create a new user",
    params: userSchema, // ZOD Schema
    paramsType: "body",
  },
];
```
