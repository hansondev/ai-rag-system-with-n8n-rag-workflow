---
title: "Getting Started with Coding Agents"
source_url: https://ai-sdk.dev/docs/getting-started/coding-agents
section: getting-started
crawled: 2026-09-20
---

# Getting Started with Coding Agents

> Source: https://ai-sdk.dev/docs/getting-started/coding-agents

[Getting Started](/docs/getting-started)Coding Agents


[Getting Started with Coding Agents](#getting-started-with-coding-agents)
=========================================================================

This page explains how to get the most out of the AI SDK when working inside a coding agent (such as Claude Code, Codex, OpenCode, Cursor, or any other AI-assisted development environment).

[Install the AI SDK Skill](#install-the-ai-sdk-skill)
-----------------------------------------------------

The fastest way to give your coding agent deep knowledge of the AI SDK is to install the official AI SDK skill. Skills are lightweight markdown files that load specialized instructions into your agent's context on demand — so your agent knows exactly how to use the SDK without you needing to explain it.

Install the AI SDK skill using `npx skills add`:

```
1

npx skills add vercel/ai
```

This installs the skill into your agent's specific skills directory (e.g., `.claude/skills`, `.codex/skills`). If you select more than one agent, the CLI creates symlinks so each agent can discover the skill. Use `-a` to specify agents directly — for example, `-a amp` installs into the universal `.agents/skills` directory. Use `-y` for non-interactive installation.

Once installed, any agent that supports the [Agent Skills](https://agentskills.io) format will automatically discover and load the skill when working on AI SDK tasks.

Agent Skills use **progressive disclosure**: your agent loads only the skill's
name and description at startup. The full instructions are only pulled into
context when the task calls for it, keeping your agent fast and focused.

[Docs and Source Code in `node_modules`](#docs-and-source-code-in-node_modules)
-------------------------------------------------------------------------------

Once you've installed the `ai` package, you already have the full AI SDK documentation and source code available locally inside `node_modules`. Your coding agent can read these directly — no internet access required.

Install the `ai` package if you haven't already:

pnpmnpmbunyarn

```
pnpm add ai
```

After installation, your agent can reference the bundled source code and documentation at paths like:

```
1

node_modules/ai/src/              # Full source code organized by module



2

node_modules/ai/docs/             # Official documentation with examples
```

This means your agent can look up accurate API signatures, implementations, and usage examples directly from the installed package — ensuring it always uses the version of the SDK that's actually installed in your project.

[Install DevTools](#install-devtools)
-------------------------------------

AI SDK DevTools gives you full visibility into your AI SDK calls during development. It captures LLM requests, responses, tool calls, token usage, and multi-step interactions, and displays them in a local web UI.

AI SDK DevTools is experimental and intended for local development only. Do
not use in production environments.

Install the DevTools package:

pnpmnpmbunyarn

```
pnpm add @ai-sdk/devtools
```

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

Once an integration is registered, [telemetry](/docs/ai-sdk-core/telemetry) is enabled automatically for all your AI SDK calls:

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

### [Launch the viewer](#launch-the-viewer)

Start the DevTools viewer in a separate terminal:

```
1

npx @ai-sdk/devtools@latest
```

Open <http://localhost:4983> to inspect your AI SDK interactions in real time.

[Inspecting Tool Calls and Outputs](#inspecting-tool-calls-and-outputs)
-----------------------------------------------------------------------

DevTools captures and displays the following for every call:

* **Input parameters and prompts** — the complete input sent to your LLM
* **Output content and tool calls** — generated text and tool invocations
* **Token usage and timing** — resource consumption and latency per step
* **Raw provider data** — complete request and response payloads

For multi-step agent interactions, DevTools groups everything into **runs** (a complete interaction) and **steps** (each individual LLM call within it), making it easy to trace exactly what your agent did and why.

You can also log tool results directly in code during development:

```
1

import { streamText, tool, isStepCount } from 'ai';



2

import { z } from 'zod';



3



4

const result = streamText({



5

model,



6

prompt: "What's the weather in New York in celsius?",



7

tools: {



8

weather: tool({



9

description: 'Get the weather in a location (fahrenheit)',



10

inputSchema: z.object({



11

location: z.string().describe('The location to get the weather for'),



12

}),



13

execute: async ({ location }) => ({



14

location,



15

temperature: Math.round(Math.random() * (90 - 32) + 32),



16

}),



17

}),



18

},



19

stopWhen: isStepCount(5),



20

onStepEnd: async ({ toolResults }) => {



21

if (toolResults.length) {



22

console.log(JSON.stringify(toolResults, null, 2));



23

}



24

},



25

});
```

The `onStepEnd` callback fires after each LLM step and prints any tool results to your terminal — useful for quick debugging without opening the DevTools UI.

DevTools stores all AI interactions in a local `.devtools/generations.json`
file. It automatically adds `.devtools` to your `.gitignore` to prevent
committing sensitive interaction data.

[Where to Next?](#where-to-next)
--------------------------------

* Learn about [Agent Skills](https://agentskills.io/specification) to understand the full skill format.
* Read the [DevTools reference](/docs/ai-sdk-core/devtools) for a complete list of captured data and configuration options.
* Explore [Tools and Tool Calling](/docs/ai-sdk-core/tools-and-tool-calling) to build agents that can take real-world actions.
* Check out the [Add Skills to Your Agent](/cookbook/guides/agent-skills) cookbook guide for a step-by-step integration walkthrough.

[Previous

TanStack Start](/docs/getting-started/tanstack-start)[Next

Agents](/docs/agents)
