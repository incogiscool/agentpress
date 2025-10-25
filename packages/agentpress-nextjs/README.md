# AgentPress Next.js

A React component library for building AI-powered chat interfaces with Next.js.

## Installation

```bash
bun add agentpress-nextjs
```

## Usage

```tsx
import { AgentpressChat } from "agentpress-nextjs";

export default function Page() {
  return (
    <AgentpressChat projectId="your-project-id" authToken="your-auth-token" />
  );
}
```

## Components

### AgentpressChat

Main chat component that provides a complete AI chat interface.

**Props:**

- `projectId` (string, required): Your AgentPress project ID
- `authToken` (string, optional): Authentication token for secure requests

### ChatInput

Input component for the chat interface.

## Requirements

- React 19+
- Next.js 15+
- Tailwind CSS (for styling)

## License

MIT
