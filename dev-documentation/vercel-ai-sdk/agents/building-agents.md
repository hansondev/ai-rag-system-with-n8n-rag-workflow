---
title: "Building Agents"
source_url: https://ai-sdk.dev/docs/agents/building-agents
section: agents
crawled: 2026-09-20
---

# Building Agents

> Source: https://ai-sdk.dev/docs/agents/building-agents

[Agents](/docs/agents)Building Agents


[Building Agents](#building-agents)
===================================

The ToolLoopAgent provides a structured way to encapsulate LLM configuration, tools, and behavior into reusable components. It handles the agent loop for you, allowing the LLM to call tools multiple times in sequence to accomplish complex tasks. Define agents once and use them across your application.

[Why Use the ToolLoopAgent Class?](#why-use-the-toolloopagent-class)
--------------------------------------------------------------------

When building AI applications, you often need to:

* **Reuse configurations** - Same model settings, tools, and prompts across different parts of your application
* **Maintain consistency** - Ensure the same behavior and capabilities throughout your codebase
* **Simplify API routes** - Reduce boilerplate in your endpoints
* **Type safety** - Get full TypeScript support for your agent's tools and outputs

The ToolLoopAgent class provides a single place to define your agent's behavior.

[Creating an Agent](#creating-an-agent)
---------------------------------------

Define an agent by instantiating the ToolLoopAgent class with your desired configuration:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const myAgent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

instructions: 'You are a helpful assistant.',



6

tools: {



7

// Your tools here



8

},



9

});
```

[Configuration Options](#configuration-options)
-----------------------------------------------

The ToolLoopAgent accepts all the same settings as `generateText` and `streamText`. Configure:

### [Model and System Instructions](#model-and-system-instructions)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

instructions: 'You are an expert software engineer.',



6

});
```

### [Tools](#tools)

Provide tools that the agent can use to accomplish tasks:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const codeAgent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: {



7

runCode: tool({



8

description: 'Execute Python code',



9

inputSchema: z.object({



10

code: z.string(),



11

}),



12

execute: async ({ code }) => {



13

// Execute code and return result



14

return { output: 'Code executed successfully' };



15

},



16

}),



17

},



18

});
```

### [Context and Agent State](#context-and-agent-state)

Use `runtimeContext` as the agent's shared runtime state. It flows through the
agent loop and is available in `prepareStep`, lifecycle callbacks, and final
results. If a tool needs server-side values such as credentials, scoped
permissions, or default settings, pass them through `toolsContext` and declare
them with the tool's `contextSchema`.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: {



7

searchTickets: tool({



8

description: 'Search support tickets',



9

inputSchema: z.object({



10

query: z.string(),



11

}),



12

contextSchema: z.object({



13

apiKey: z.string(),



14

accountId: z.string(),



15

}),



16

execute: async ({ query }, { context }) =>



17

searchTickets(query, context.accountId, context.apiKey),



18

}),



19

},



20

prepareStep: async ({ runtimeContext }) => {



21

if (runtimeContext.escalated) {



22

return { temperature: 0.1 };



23

}



24



25

return {};



26

},



27

});



28



29

const result = await agent.generate({



30

prompt: 'Find open billing tickets for this account.',



31

runtimeContext: {



32

requestId: 'req_abc',



33

escalated: false,



34

},



35

toolsContext: {



36

searchTickets: {



37

apiKey: process.env.SUPPORT_API_KEY!,



38

accountId: 'acct_123',



39

},



40

},



41

});
```

Model call settings returned from `prepareStep`, such as `temperature`, apply
only to the current step. Later steps use the agent's top-level setting unless
they return another override.

For the full model, including sensitive context filtering and where each context
value is available, see [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context).

### [Tools That Use Experimental Sandboxes](#tools-that-use-experimental-sandboxes)

Pass `experimental_sandbox` when an agent tool needs a command or code execution
environment. The experimental sandbox is a per-call value, so provide it to `generate()`,
`stream()`, or the agent UI stream helper that invokes the agent.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: 'You are a coding assistant. Use the shell tool when needed.',



4

tools: {



5

shell: tool({



6

description: 'Execute shell commands in the experimental sandbox.',



7

inputSchema: z.object({



8

command: z.string(),



9

workingDirectory: z.string().optional(),



10

}),



11

execute: async (



12

{ command, workingDirectory },



13

{ abortSignal, experimental_sandbox },



14

) => {



15

if (!experimental_sandbox) {



16

throw new Error('Experimental sandbox is not available');



17

}



18



19

return experimental_sandbox.run({



20

command,



21

workingDirectory,



22

abortSignal,



23

});



24

},



25

}),



26

},



27

});



28



29

const result = await agent.generate({



30

prompt: `Run the tests.\n\nSandbox:\n${experimental_sandbox.description}`,



31

experimental_sandbox,



32

});
```

The experimental sandbox description is not added to the model prompt automatically. Include
it in the prompt or instructions when the model needs to know environment
details. Passing an experimental sandbox does not sandbox the tool itself; the tool must
explicitly delegate operations to the experimental sandbox. See the
[Experimental Sandbox section in Tool Calling](/docs/ai-sdk-core/tools-and-tool-calling#experimental-sandbox)
for more details.

You can also require approval before a tool executes. Configure approval on the
`ToolLoopAgent` with `toolApproval`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

tools: {



4

runCode: tool({



5

description: 'Execute Python code',



6

inputSchema: z.object({



7

code: z.string(),



8

}),



9

execute: async ({ code }) => ({ output: code }),



10

}),



11

},



12

toolApproval: {



13

runCode: 'user-approval',



14

},



15

});
```

For manual approvals, automatic approvals and denials, dynamic policy functions,
and `useChat` integration, see [Tool
Approvals](/docs/agents/tool-approvals).

### [Loop Control](#loop-control)

By default, agents run for 20 steps (`stopWhen: isStepCount(20)`). In each step, the model either generates text or calls a tool. If it generates text, the agent completes. If it calls a tool, the AI SDK executes that tool.

You can configure `stopWhen` differently to allow more steps. After each tool execution, the agent triggers a new generation where the model can call another tool or generate text:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isStepCount } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

stopWhen: isStepCount(50), // Increase default from 20 to 50.



6

});
```

Each step represents one generation (which results in either text or a tool call). The loop continues until:

* A finish reasoning other than tool-calls is returned, or
* A tool that is invoked does not have an execute function, or
* A tool call needs approval, or
* A stop condition is met

You can combine multiple conditions:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isStepCount } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

stopWhen: [



6

isStepCount(20), // Maximum 20 steps



7

yourCustomCondition(), // Custom logic for when to stop



8

],



9

});
```

Learn more about [loop control and stop conditions](/docs/agents/loop-control).

### [Tool Choice](#tool-choice)

Control how the agent uses tools:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools here



7

},



8

toolChoice: 'required', // Force tool use



9

// or toolChoice: 'none' to disable tools



10

// or toolChoice: 'auto' (default) to let the model decide



11

});
```

You can also force the use of a specific tool:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

weather: weatherTool,



7

cityAttractions: attractionsTool,



8

},



9

toolChoice: {



10

type: 'tool',



11

toolName: 'weather', // Force the weather tool to be used



12

},



13

});
```

### [Structured Output](#structured-output)

Define structured output schemas:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, Output } from 'ai';



2

import { z } from 'zod';



3



4

const analysisAgent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

output: Output.object({



7

schema: z.object({



8

sentiment: z.enum(['positive', 'neutral', 'negative']),



9

summary: z.string(),



10

keyPoints: z.array(z.string()),



11

}),



12

}),



13

});



14



15

const { output } = await analysisAgent.generate({



16

prompt: 'Analyze customer feedback from the last quarter',



17

});
```

[Define Agent Behavior with System Instructions](#define-agent-behavior-with-system-instructions)
-------------------------------------------------------------------------------------------------

System instructions define your agent's behavior, personality, and constraints. They set the context for all interactions and guide how the agent responds to user queries and uses tools.

### [Basic System Instructions](#basic-system-instructions)

Set the agent's role and expertise:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions:



4

'You are an expert data analyst. You provide clear insights from complex data.',



5

});
```

### [Detailed Behavioral Instructions](#detailed-behavioral-instructions)

Provide specific guidelines for agent behavior:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const codeReviewAgent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: `You are a senior software engineer conducting code reviews.



4



5

Your approach:



6

- Focus on security vulnerabilities first



7

- Identify performance bottlenecks



8

- Suggest improvements for readability and maintainability



9

- Be constructive and educational in your feedback



10

- Always explain why something is an issue and how to fix it`,



11

});
```

### [Constrain Agent Behavior](#constrain-agent-behavior)

Set boundaries and ensure consistent behavior:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const customerSupportAgent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: `You are a customer support specialist for an e-commerce platform.



4



5

Rules:



6

- Never make promises about refunds without checking the policy



7

- Always be empathetic and professional



8

- If you don't know something, say so and offer to escalate



9

- Keep responses concise and actionable



10

- Never share internal company information`,



11

tools: {



12

checkOrderStatus,



13

lookupPolicy,



14

createTicket,



15

},



16

});
```

### [Tool Usage Instructions](#tool-usage-instructions)

Guide how the agent should use available tools:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const researchAgent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: `You are a research assistant with access to search and document tools.



4



5

When researching:



6

1. Always start with a broad search to understand the topic



7

2. Use document analysis for detailed information



8

3. Cross-reference multiple sources before drawing conclusions



9

4. Cite your sources when presenting information



10

5. If information conflicts, present both viewpoints`,



11

tools: {



12

webSearch,



13

analyzeDocument,



14

extractQuotes,



15

},



16

});
```

### [Format and Style Instructions](#format-and-style-instructions)

Control the output format and communication style:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const technicalWriterAgent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: `You are a technical documentation writer.



4



5

Writing style:



6

- Use clear, simple language



7

- Avoid jargon unless necessary



8

- Structure information with headers and bullet points



9

- Include code examples where relevant



10

- Write in second person ("you" instead of "the user")



11



12

Always format responses in Markdown.`,



13

});
```

[Using an Agent](#using-an-agent)
---------------------------------

Once defined, you can use your agent in three ways:

### [Generate Text](#generate-text)

Use `generate()` for one-time text generation:

```
1

const result = await myAgent.generate({



2

prompt: 'What is the weather like?',



3

});



4



5

console.log(result.text);
```

### [Stream Text](#stream-text)

Use `stream()` for streaming responses:

```
1

const result = await myAgent.stream({



2

prompt: 'Tell me a story',



3

});



4



5

for await (const chunk of result.textStream) {



6

console.log(chunk);



7

}
```

### [Respond to UI Messages](#respond-to-ui-messages)

Use `createAgentUIStreamResponse()` to create API responses for client applications:

```
1

// In your API route (e.g., app/api/chat/route.ts)



2

import { createAgentUIStreamResponse } from 'ai';



3



4

export async function POST(request: Request) {



5

const { messages } = await request.json();



6



7

return createAgentUIStreamResponse({



8

agent: myAgent,



9

uiMessages: messages,



10

});



11

}
```

### [Lifecycle Callbacks](#lifecycle-callbacks)

Agents provide lifecycle callbacks that let you hook into different phases of the agent execution.
These are useful for logging, observability, debugging, and custom telemetry.

```
1

const result = await myAgent.generate({



2

prompt: 'Research and summarize the latest AI trends',



3



4

onStart({ modelId }) {



5

console.log('Agent started', { modelId });



6

},



7



8

onStepStart({ stepNumber, modelId }) {



9

console.log(`Step ${stepNumber} starting`, { modelId });



10

},



11



12

onToolExecutionStart({ toolCall }) {



13

console.log(`Tool call starting: ${toolCall.toolName}`);



14

},



15



16

onToolExecutionEnd({ toolCall, toolExecutionMs, toolOutput }) {



17

console.log(



18

`Tool call finished: ${toolCall.toolName} (${toolExecutionMs}ms)`,



19

{



20

success: toolOutput.type === 'tool-result',



21

},



22

);



23

},



24



25

onStepEnd({ stepNumber, usage, performance, finishReason, toolCalls }) {



26

console.log(`Step ${stepNumber} completed:`, {



27

inputTokens: usage.inputTokens,



28

outputTokens: usage.outputTokens,



29

outputTokensPerSecond: performance.effectiveOutputTokensPerSecond,



30

stepTimeMs: performance.stepTimeMs,



31

finishReason,



32

toolsUsed: toolCalls?.map(tc => tc.toolName),



33

});



34

},



35



36

onEnd({ usage, steps }) {



37

console.log('Agent finished:', {



38

totalSteps: steps.length,



39

totalTokens: usage.totalTokens,



40

});



41

},



42

});
```

The available lifecycle callbacks are:

* **`onStart`**: Called once when the agent operation begins, before any LLM calls. Receives model info, messages, settings, and `runtimeContext`.
* **`onStepStart`**: Called before each step (LLM call). Receives the step number, model, messages being sent, tools, and prior steps.
* **`onToolExecutionStart`**: Called right before a tool's `execute` function runs. Receives the tool call object, messages, and `toolContext`.
* **`onToolExecutionEnd`**: Called right after a tool's `execute` function completes or errors. Receives the tool call, `toolExecutionMs`, and a `toolOutput` discriminated union (`type: 'tool-result'` with `output`, or `type: 'tool-error'` with `error`).
* **`onStepEnd`**: Called after each step finishes. Receives step results including usage, performance, finish reason, and tool calls.
* **`onEnd`**: Called when all steps are finished and the response is complete. Receives all step results, total usage, and `runtimeContext`.

For the full event data reference, see [Lifecycle Callbacks](/docs/ai-sdk-core/lifecycle-callbacks). `ToolLoopAgent` uses the same generation lifecycle event types for `onStart`, `onStepStart`, `onToolExecutionStart`, `onToolExecutionEnd`, `onStepEnd`, and `onEnd`.

#### [Constructor vs. Method Callbacks](#constructor-vs-method-callbacks)

All lifecycle callbacks can be defined in the constructor for agent-wide tracking, in the `generate()`/`stream()` call for per-call tracking, or both. When both are provided, both are called (constructor first, then the method callback):

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

onStepEnd: async ({ stepNumber, usage }) => {



4

// Agent-wide logging



5

console.log(`Agent step ${stepNumber}:`, usage.totalTokens);



6

},



7

});



8



9

// Method-level callback runs after constructor callback



10

const result = await agent.generate({



11

prompt: 'Hello',



12

onStepEnd: async ({ stepNumber, usage }) => {



13

// Per-call tracking (e.g., for billing)



14

await trackUsage(stepNumber, usage);



15

},



16

});
```

[End-to-end Type Safety](#end-to-end-type-safety)
-------------------------------------------------

You can infer types for your agent's `UIMessage`s:

```
1

import { ToolLoopAgent, InferAgentUIMessage } from 'ai';



2



3

const myAgent = new ToolLoopAgent({



4

// ... configuration



5

});



6



7

// Infer the UIMessage type for UI components or persistence



8

export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use this type in your client components with `useChat`:

components/chat.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import type { MyAgentUIMessage } from '@/agent/my-agent';



5



6

export function Chat() {



7

const { messages } = useChat<MyAgentUIMessage>();



8

// Full type safety for your messages and tools



9

}
```

[Next Steps](#next-steps)
-------------------------

Now that you understand building agents, you can:

* Explore [workflow patterns](/docs/agents/workflows) for structured patterns using core functions
* Learn about [loop control](/docs/agents/loop-control) for advanced execution control
* See [manual loop examples](/cookbook/node/manual-agent-loop) for custom workflow implementations

[Previous

Overview](/docs/agents/overview)[Next

Workflow Patterns](/docs/agents/workflows)
