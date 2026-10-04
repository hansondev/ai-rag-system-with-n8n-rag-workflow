---
title: "DevTools"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/devtools
section: ai-sdk-core
crawled: 2026-09-20
---

# DevTools

> Source: https://ai-sdk.dev/docs/ai-sdk-core/devtools

[AI SDK Core](/docs/ai-sdk-core)DevTools


[DevTools](#devtools)
=====================

AI SDK DevTools is intended for local development only. Do not use in
production environments.

AI SDK DevTools gives you full visibility over your AI SDK calls with [`generateText`](/docs/reference/ai-sdk-core/generate-text), [`streamText`](/docs/reference/ai-sdk-core/stream-text), and [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent). It helps you debug and inspect LLM requests, responses, tool calls, and multi-step interactions through a web-based UI.

DevTools is composed of two parts:

1. **Telemetry Integration**: Captures runs and steps from your AI SDK calls via the [telemetry](/docs/ai-sdk-core/telemetry) system
2. **Viewer**: A web UI to inspect the captured data

[Installation](#installation)
-----------------------------

Install the DevTools package:

```
1

pnpm add @ai-sdk/devtools
```

[Requirements](#requirements)
-----------------------------

* AI SDK v7 (`ai@latest`)
* Node.js compatible runtime

[Using DevTools](#using-devtools)
---------------------------------

### [Register the integration](#register-the-integration)

Register `DevToolsTelemetry` globally so it captures all AI SDK calls:

```
1

import { registerTelemetry } from 'ai';



2

import { DevToolsTelemetry } from '@ai-sdk/devtools';



3



4

registerTelemetry(DevToolsTelemetry());
```

Telemetry is enabled automatically once an integration is registered — no per-call configuration is needed:

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: openai('gpt-4o'),



5

prompt: 'What cities are in the United States?',



6

});
```

You can also pass the integration to individual calls instead of registering it globally:

```
1

import { streamText } from 'ai';



2

import { DevToolsTelemetry } from '@ai-sdk/devtools';



3



4

const result = streamText({



5

model: openai('gpt-4o'),



6

prompt: 'Hello!',



7

telemetry: {



8

integrations: [DevToolsTelemetry()],



9

},



10

});
```

### [Launch the viewer](#launch-the-viewer)

Start the DevTools viewer:

```
1

npx @ai-sdk/devtools@latest
```

Open <http://localhost:4983> to view your AI SDK interactions.

### [Choose a viewer theme](#choose-a-viewer-theme)

The viewer uses the dark theme by default. Use the theme button in the viewer
header to switch between dark and light themes. Your selection is stored in
your browser and restored the next time you open the viewer at the same origin.

### [Monorepo usage](#monorepo-usage)

If you are using a monorepo setup (e.g. Turborepo, Nx), start DevTools from the same workspace where your AI SDK code runs.

For example, if your API is in `apps/api`, run:

```
1

cd apps/api



2

npx @ai-sdk/devtools@latest
```

The explicit `@latest` tag ensures that `npx` installs an executable copy
instead of selecting a transitive dependency whose binary is not linked into
the workspace.

[Captured data](#captured-data)
-------------------------------

DevTools captures the following information from your AI SDK calls:

* **Input parameters and prompts**: View the complete input sent to your LLM
* **Output content and tool calls**: Inspect generated text, tool invocations, and tool results
* **Media previews**: View images, audio, and video included in prompts, tool inputs, and tool outputs
* **Token usage and timing**: Monitor resource consumption and performance
* **Raw provider data**: Access provider request and response payloads when body retention is enabled

### [Media previews](#media-previews)

DevTools recognizes current `file` content parts as well as the deprecated
`image-*`, `file-*`, and `media` tool-result aliases. Inline image, audio, and
video data is previewed directly, while the captured JSON shape and metadata
remain available for inspection. The viewer displays at most 8 previews per
value, traverses at most 12 nested levels, and embeds inline previews up to 5
MiB. Longer JSON strings are truncated in the viewer to avoid duplicating large
base64 payloads. Binary values in recognized media-bearing fields are persisted
as base64 so they remain previewable; unrelated binary values retain their
normal JSON representation.

For example, a tool can return media through `toModelOutput`:

```
1

import { tool } from 'ai';



2

import { z } from 'zod';



3



4

const captureScreenshot = tool({



5

inputSchema: z.object({}),



6

execute: async () => ({



7

base64: await captureScreenshotAsBase64(),



8

}),



9

toModelOutput: ({ output }) => ({



10

type: 'content',



11

value: [



12

{



13

type: 'file',



14

filename: 'screenshot.png',



15

mediaType: 'image/png',



16

data: { type: 'data', data: output.base64 },



17

},



18

],



19

}),



20

});
```

Remote `http` and `https` media is not loaded automatically. Select **Load
preview** in the viewer to fetch it with anonymous CORS and no referrer.
Cross-origin browser credentials are omitted, but same-origin browser
credentials may still be included by the browser. URLs containing embedded
usernames or passwords are rejected. Unsupported media, provider references,
malformed values, unsafe URL schemes, and inline values over the preview limit
retain their JSON and metadata fallback without an embedded preview.

Telemetry is enabled automatically, but AI SDK 7 excludes raw request and response bodies from step results by default. To make them available to DevTools for `generateText`, enable body retention on the call:

```
1

const result = await generateText({



2

model: openai('gpt-4o'),



3

prompt: 'Hello!',



4

include: {



5

requestBody: true,



6

responseBody: true,



7

},



8

});
```

`ToolLoopAgent` accepts the same `include` setting in its constructor. For `streamText` and `ToolLoopAgent.stream()`, only the request body can be retained; use `include: { requestBody: true }`.

### [Runs and steps](#runs-and-steps)

DevTools organizes captured data into runs and steps:

* **Run**: A complete multi-step AI interaction, grouped by the initial prompt
* **Step**: A single LLM call within a run (e.g., one `generateText` or `streamText` call)

Multi-step interactions, such as those created by tool calling or agent loops, are grouped together as a single run with multiple steps. Nested sub-agent calls are linked to their parent run, making it easy to trace the full execution tree.

[How it works](#how-it-works)
-----------------------------

The `DevToolsTelemetry` integration hooks into the AI SDK [telemetry](/docs/ai-sdk-core/telemetry) lifecycle to capture all `generateText`, `streamText`, `generateObject`, and `streamObject` calls. Captured data is stored locally in a JSON file (`.devtools/generations.json`) and served through a web UI built with Hono and React.

The integration automatically adds `.devtools` to your `.gitignore` file.
Verify that `.devtools` is in your `.gitignore` to ensure you don't commit
sensitive AI interaction data to your repository.

[Security considerations](#security-considerations)
---------------------------------------------------

DevTools stores all AI interactions locally in plain text files, including:

* User prompts and messages
* LLM responses
* Tool call arguments and results
* API request and response data when body retention is enabled

**Only use DevTools in local development environments.** Do not enable DevTools in production or when handling sensitive data.

[Previous

Telemetry](/docs/ai-sdk-core/telemetry)[Next

Lifecycle Callbacks](/docs/ai-sdk-core/lifecycle-callbacks)
