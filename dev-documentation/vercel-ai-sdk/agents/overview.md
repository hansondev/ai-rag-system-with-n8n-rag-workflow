---
title: "Agents"
source_url: https://ai-sdk.dev/docs/agents/overview
section: agents
crawled: 2026-09-20
---

# Agents

> Source: https://ai-sdk.dev/docs/agents/overview

[Agents](/docs/agents)Overview


[Agents](#agents)
=================

Agents are **large language models (LLMs)** that use **tools** in a **loop** to accomplish tasks.

These components work together:

* **LLMs** process input and decide the next action
* **Tools** extend capabilities beyond text generation (reading files, calling APIs, writing to databases)
* **Loop** orchestrates execution through:
  + **Context management** - Maintaining conversation history and deciding what the model sees (input) at each step
  + **Stopping conditions** - Determining when the loop (task) is complete

[Agent State and Context](#agent-state-and-context)
---------------------------------------------------

Agents often need server-side state that should not be placed directly in the
prompt, such as tenant settings, request IDs, feature flags, credentials, or
progress through a task.

Use `runtimeContext` as the agent's shared runtime state. It flows through the
agent loop, is available in `prepareStep` and lifecycle callbacks, and can be
updated between steps. Use `toolsContext` for per-tool values such as API keys
or scoped permissions; each tool receives only its own typed `context` based on
its `contextSchema`.

Learn more in [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context).

[ToolLoopAgent Class](#toolloopagent-class)
-------------------------------------------

The ToolLoopAgent class handles these three components. Here's an agent that uses multiple tools in a loop to accomplish a task:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const weatherAgent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: {



7

weather: tool({



8

description: 'Get the weather in a location (in Fahrenheit)',



9

inputSchema: z.object({



10

location: z.string().describe('The location to get the weather for'),



11

}),



12

execute: async ({ location }) => ({



13

location,



14

temperature: 72 + Math.floor(Math.random() * 21) - 10,



15

}),



16

}),



17

convertFahrenheitToCelsius: tool({



18

description: 'Convert temperature from Fahrenheit to Celsius',



19

inputSchema: z.object({



20

temperature: z.number().describe('Temperature in Fahrenheit'),



21

}),



22

execute: async ({ temperature }) => {



23

const celsius = Math.round((temperature - 32) * (5 / 9));



24

return { celsius };



25

},



26

}),



27

},



28

});



29



30

const result = await weatherAgent.generate({



31

prompt: 'What is the weather in San Francisco in celsius?',



32

});



33



34

console.log(result.text); // agent's final answer



35

console.log(result.steps); // steps taken by the agent
```

The agent automatically:

1. Calls the `weather` tool to get the temperature in Fahrenheit
2. Calls `convertFahrenheitToCelsius` to convert it
3. Generates a final text response with the result

The ToolLoopAgent handles the loop, context management, and stopping conditions.

[Why Use the ToolLoopAgent?](#why-use-the-toolloopagent)
--------------------------------------------------------

The ToolLoopAgent is the recommended approach for building agents with the AI SDK because it:

* **Reduces boilerplate** - Manages loops and message arrays
* **Improves reusability** - Define once, use throughout your application
* **Simplifies maintenance** - Single place to update agent configuration

For most use cases, start with the ToolLoopAgent. Use core functions (`generateText`, `streamText`) when you need explicit control over each step for complex structured workflows.

[HarnessAgent Class](#harnessagent-class)
-----------------------------------------

Use `HarnessAgent` when you want to run a preconfigured established harness,
such as Claude Code, Codex, or Pi, instead of building the loop yourself around
a language model. Harnesses are a separate abstraction from providers and
models, but stream into AI SDK-compatible result and UI primitives.

Learn more in [Harnesses](/docs/ai-sdk-harnesses) and
[HarnessAgent](/docs/ai-sdk-harnesses/harness-agent).

The rest of this section focuses on `ToolLoopAgent`, which is the AI SDK agent
class for building your own model-and-tools loop.

[Terminal UI](#terminal-ui)
---------------------------

Use `@ai-sdk/tui` to run a `ToolLoopAgent` in an interactive terminal UI. It is
useful for local agent development, demos, and internal tools where you want
prompt input, streamed responses, tool cards, reasoning sections, scrolling, and
tool approval prompts without building a custom interface.

```
1

import { runAgentTUI } from '@ai-sdk/tui';



2



3

await runAgentTUI({



4

title: 'Weather Agent',



5

agent: weatherAgent,



6

});
```

Learn more in [Terminal UI](/docs/agents/terminal-ui).

[Structured Workflows](#structured-workflows)
---------------------------------------------

Agents are flexible and powerful, but non-deterministic. When you need reliable, repeatable outcomes with explicit control flow, use core functions with structured workflow patterns combining:

* Conditional statements for explicit branching
* Standard functions for reusable logic
* Error handling for robustness
* Explicit control flow for predictability

[Explore workflow patterns](/docs/agents/workflows) to learn more about building structured, reliable systems.

[Next Steps](#next-steps)
-------------------------

* **[Building Agents](/docs/agents/building-agents)** - Guide to creating agents with the ToolLoopAgent
* **[Runtime and Tool Context](/docs/ai-sdk-core/runtime-and-tool-context)** - How to pass shared agent state and per-tool context
* **[Workflow Patterns](/docs/agents/workflows)** - Structured patterns using core functions for complex workflows
* **[Loop Control](/docs/agents/loop-control)** - Execution control with stopWhen and prepareStep

[Previous

Agents](/docs/agents)[Next

Building Agents](/docs/agents/building-agents)
