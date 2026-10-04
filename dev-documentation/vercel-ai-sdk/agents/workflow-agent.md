---
title: "WorkflowAgent"
source_url: https://ai-sdk.dev/docs/agents/workflow-agent
section: agents
crawled: 2026-09-20
---

# WorkflowAgent

> Source: https://ai-sdk.dev/docs/agents/workflow-agent

[Agents](/docs/agents)WorkflowAgent


[WorkflowAgent](#workflowagent)
===============================

The `WorkflowAgent` from `@ai-sdk/workflow` is designed for building **durable, resumable agents** that run inside a [workflow](https://vercel.com/docs/workflow). It provides the same agent loop as the [`ToolLoopAgent`](/docs/agents/building-agents), but adds automatic state persistence, tool schema serialization, and built-in tool approval flows that survive workflow step boundaries.

[Why Durable Agents?](#why-durable-agents)
------------------------------------------

A standard `ToolLoopAgent` runs entirely in memory — if the process crashes, all progress is lost. For production agents that make multiple tool calls, this creates problems:

* **Statefulness** — Long-running agent loops need to persist state across process boundaries
* **Resumability** — If a step fails, you want to retry from the last checkpoint, not restart from scratch
* **Human-in-the-loop** — Tools that require user approval need to pause the agent and resume later
* **Observability** — Each tool call runs as a discrete workflow step, visible in dashboards

`WorkflowAgent` solves these by running inside a workflow, where each tool execution is a durable step with automatic retries.

[When to Use WorkflowAgent vs ToolLoopAgent](#when-to-use-workflowagent-vs-toolloopagent)
-----------------------------------------------------------------------------------------

|  | ToolLoopAgent | WorkflowAgent |
| --- | --- | --- |
| **Package** | `ai` | `@ai-sdk/workflow` |
| **Runtime** | In-memory | Workflow |
| **Durability** | Lost on crash | Survives restarts |
| **Tool retries** | Manual | Automatic (via workflow steps) |
| **Human approval** | Built-in | Built-in + survives suspension |
| **`generate()` method** | Available | Not available |
| **`stream()` method** | Available | Primary API |
| **Stream output** | `streamText` return value | `writable` parameter with `ModelCallStreamPart` |

For simpler use cases that don't need durability, use [`ToolLoopAgent`](/docs/agents/building-agents) from the `ai` package.

[Installation](#installation)
-----------------------------

```
1

npm install @ai-sdk/workflow workflow@beta
```

`@ai-sdk/workflow` requires Workflow 5, which is currently available under the `beta` tag, as well as the `ai` package and `zod` peer dependencies. The `workflow` package provides the Workflow DevKit runtime (`getWritable`, `'use workflow'`, `'use step'`).

[Creating a WorkflowAgent](#creating-a-workflowagent)
-----------------------------------------------------

Define an agent by instantiating the `WorkflowAgent` class with a model, instructions, and tools:

```
1

import { WorkflowAgent } from '@ai-sdk/workflow';



2

import { tool } from 'ai';



3

import { z } from 'zod';



4



5

const agent = new WorkflowAgent({



6

model: 'anthropic/claude-sonnet-4-6',



7

instructions: 'You are a helpful assistant.',



8

tools: {



9

weather: tool({



10

description: 'Get weather for a location',



11

inputSchema: z.object({



12

location: z.string(),



13

}),



14

execute: async ({ location }) => ({



15

location,



16

temperature: 72,



17

}),



18

}),



19

},



20

});
```

### [Model Resolution](#model-resolution)

The `model` parameter accepts two forms:

```
1

// String — AI Gateway model ID



2

new WorkflowAgent({ model: 'anthropic/claude-sonnet-4-6' });



3



4

// Provider instance



5

import { openai } from '@ai-sdk/openai';



6

new WorkflowAgent({ model: openai('gpt-4o') });
```

[Using the Agent in a Workflow](#using-the-agent-in-a-workflow)
---------------------------------------------------------------

`WorkflowAgent` is designed to run inside a workflow function. The key integration points are:

1. Mark your function with `'use workflow'`
2. Pass `getWritable()` to the agent's `stream()` method
3. Start the workflow from your API route

### [End-to-End Example](#end-to-end-example)

workflow/agent-chat.ts

```
1

import { WorkflowAgent, type ModelCallStreamPart } from '@ai-sdk/workflow';



2

import { convertToModelMessages, tool, type UIMessage } from 'ai';



3

import { getWritable } from 'workflow';



4

import { z } from 'zod';



5



6

export async function chat(messages: UIMessage[]) {



7

'use workflow';



8



9

const modelMessages = await convertToModelMessages(messages);



10



11

const agent = new WorkflowAgent({



12

model: 'anthropic/claude-sonnet-4-6',



13

instructions: 'You are a flight booking assistant.',



14

tools: {



15

searchFlights: tool({



16

description: 'Search for available flights',



17

inputSchema: z.object({



18

origin: z.string(),



19

destination: z.string(),



20

date: z.string(),



21

}),



22

execute: searchFlightsStep,



23

}),



24

bookFlight: tool({



25

description: 'Book a specific flight',



26

inputSchema: z.object({



27

flightId: z.string(),



28

passengerName: z.string(),



29

}),



30

execute: bookFlightStep,



31

}),



32

},



33

});



34



35

const result = await agent.stream({



36

messages: modelMessages,



37

writable: getWritable<ModelCallStreamPart>(),



38

});



39



40

return { messages: result.messages };



41

}
```

app/api/chat/route.ts

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2

import { createUIMessageStreamResponse, type UIMessage } from 'ai';



3

import { start } from 'workflow/api';



4

import { chat } from '@/workflow/agent-chat';



5



6

export async function POST(request: Request) {



7

const { messages }: { messages: UIMessage[] } = await request.json();



8



9

const run = await start(chat, [messages]);



10



11

return createUIMessageStreamResponse({



12

stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),



13

});



14

}
```

### [Message Conversion](#message-conversion)

`WorkflowAgent.stream()` expects `ModelMessage[]`, not `UIMessage[]`. When receiving messages from the client (via `useChat`), convert them first:

```
1

import { convertToModelMessages, type UIMessage } from 'ai';



2



3

export async function chat(messages: UIMessage[]) {



4

'use workflow';



5



6

const modelMessages = await convertToModelMessages(messages);



7



8

const result = await agent.stream({



9

messages: modelMessages,



10

// ...



11

});



12

}
```

### [Writable Streams](#writable-streams)

Unlike `ToolLoopAgent` where you consume the returned stream, `WorkflowAgent` writes raw `ModelCallStreamPart` chunks to a `writable` stream provided by the workflow runtime via `getWritable()`. At the response boundary, use `createModelCallToUIChunkTransform()` to convert these into `UIMessageChunk` objects for the client:

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2

import { createUIMessageStreamResponse } from 'ai';



3



4

// Convert raw model stream parts → UI message chunks



5

return createUIMessageStreamResponse({



6

stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),



7

});
```

The transform also forwards `reset-step` events emitted by `WorkflowAgent` on
retries.
Clients remove partial parts from the failed model-call step before processing
the retried output.

[Resumable Streaming with WorkflowChatTransport](#resumable-streaming-with-workflowchattransport)
-------------------------------------------------------------------------------------------------

Workflow functions can time out or be interrupted by network failures. `WorkflowChatTransport` is a [`ChatTransport`](/docs/ai-sdk-ui/transport) implementation that handles these interruptions automatically — it detects when a stream ends without a `finish` event and reconnects to resume from where it left off.

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { WorkflowChatTransport } from '@ai-sdk/workflow/client';



5

import { useMemo } from 'react';



6



7

export default function Chat() {



8

const transport = useMemo(



9

() =>



10

new WorkflowChatTransport({



11

api: '/api/chat',



12

maxConsecutiveErrors: 5,



13

}),



14

[],



15

);



16



17

const { messages, sendMessage } = useChat({ transport });



18



19

// ... render chat UI



20

}
```

The transport requires your POST endpoint to return an `x-workflow-run-id` response header, and a GET endpoint at `{api}/{runId}/stream` for reconnection:

app/api/chat/route.ts

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2

import { createUIMessageStreamResponse, type UIMessage } from 'ai';



3

import { start } from 'workflow/api';



4

import { chat } from '@/workflow/agent-chat';



5



6

export async function POST(request: Request) {



7

const { messages }: { messages: UIMessage[] } = await request.json();



8

const run = await start(chat, [messages]);



9



10

return createUIMessageStreamResponse({



11

stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),



12

headers: {



13

'x-workflow-run-id': run.runId,



14

},



15

});



16

}
```

app/api/chat/[runId]/stream/route.ts

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2

import { createUIMessageStreamResponse } from 'ai';



3

import type { NextRequest } from 'next/server';



4

import { getRun } from 'workflow/api';



5



6

export async function GET(



7

request: NextRequest,



8

{ params }: { params: Promise<{ runId: string }> },



9

) {



10

const { runId } = await params;



11

const startIndex = Number(



12

new URL(request.url).searchParams.get('startIndex') ?? '0',



13

);



14

if (!Number.isSafeInteger(startIndex) || startIndex < 0) {



15

return Response.json(



16

{ error: 'startIndex must be a non-negative safe integer' },



17

{ status: 400 },



18

);



19

}



20



21

const run = await getRun(runId);



22

const readable = run



23

.getReadable({ startIndex: 0 })



24

.pipeThrough(



25

createModelCallToUIChunkTransform({ uiStartIndex: startIndex }),



26

);



27



28

return createUIMessageStreamResponse({



29

stream: readable,



30

headers: {



31

'x-workflow-run-id': runId,



32

},



33

});



34

}
```

`WorkflowChatTransport` counts `UIMessageChunk` objects, while the durable
`WorkflowAgent` stream stores raw `ModelCallStreamPart` objects. Replay the raw
stream from index `0` and apply the non-negative UI cursor in
`createModelCallToUIChunkTransform()` as shown above. Negative start indexes
require a durable stream that already stores `UIMessageChunk` objects and
cannot be used with this raw-to-UI conversion.

For the full API reference, see [`WorkflowChatTransport`](/docs/reference/ai-sdk-workflow/workflow-chat-transport).

[Tools as Workflow Steps](#tools-as-workflow-steps)
---------------------------------------------------

Mark tool execute functions with `'use step'` to make them durable workflow steps. This gives each tool call:

* **Automatic retries** — Failed tool calls are retried automatically (default: 3 attempts)
* **Persistence** — Results survive process restarts
* **Observability** — Each tool call appears as a discrete step in the workflow dashboard

```
1

async function searchFlightsStep(input: {



2

origin: string;



3

destination: string;



4

date: string;



5

}) {



6

'use step';



7

const response = await fetch(`https://api.flights.example/search?...`);



8

return response.json();



9

}



10



11

async function bookFlightStep(input: {



12

flightId: string;



13

passengerName: string;



14

}) {



15

'use step';



16

const response = await fetch('https://api.flights.example/book', {



17

method: 'POST',



18

body: JSON.stringify(input),



19

});



20

return response.json();



21

}
```

Tools without `'use step'` still work but run as regular in-memory functions without durability guarantees.

[Tool Approval](#tool-approval)
-------------------------------

For `WorkflowAgent`, human approval is configured on the tool definition with
`needsApproval`. This is specific to `WorkflowAgent`; for `generateText`,
`streamText`, and `ToolLoopAgent`, use `toolApproval` instead. When a workflow
tool has `needsApproval` set, the agent pauses and emits an approval request to
the writable stream. The workflow suspends until the user approves or denies:

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3

tools: {



4

bookFlight: tool({



5

description: 'Book a flight',



6

inputSchema: z.object({



7

flightId: z.string(),



8

passengerName: z.string(),



9

}),



10

needsApproval: true, // Always require approval



11

execute: bookFlightStep,



12

}),



13

cancelBooking: tool({



14

description: 'Cancel a booking',



15

inputSchema: z.object({ bookingId: z.string() }),



16

// Conditional approval based on input



17

needsApproval: async input => {



18

return input.bookingId.startsWith('VIP-');



19

},



20

execute: cancelBookingStep,



21

}),



22

},



23

});
```

Because the workflow is durable, the approval request survives process restarts — the user can approve hours later and the agent will resume.

### [Signed Tool Approvals](#signed-tool-approvals)

Client-supplied message history can be modified before it is replayed to the
workflow. For tools that perform sensitive operations, configure
`experimental_toolApprovalSecret` to authenticate approval requests:

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3

experimental_toolApprovalSecret: {



4

environmentVariable: 'TOOL_APPROVAL_SECRET',



5

},



6

tools: {



7

bookFlight: tool({



8

description: 'Book a flight',



9

inputSchema: z.object({ flightId: z.string() }),



10

needsApproval: true,



11

execute: bookFlightStep,



12

}),



13

},



14

});
```

The agent HMAC-signs the approval ID, tool call ID, tool name, and validated
input. When approved message history is replayed, a missing or invalid
signature prevents the tool from executing. The signature is preserved through
the durable model-call stream, `createModelCallToUIChunkTransform()`,
`addToolApprovalResponse()`, and `convertToModelMessages()`.

Use a high-entropy secret of at least 32 bytes and make the same secret
available to every worker that can issue or resume an approval. Keep old keys
available while approvals signed with them are pending; changing the secret
invalidates those pending approvals.

`WorkflowAgent` passes only the environment variable name into signing and
verification steps. Each step reads the secret from its local environment, and
the raw value is never included in step arguments, durable stream parts,
callbacks, or telemetry events. Configure the environment variable on every
worker, and do not put the secret value in `runtimeContext` or `toolsContext`.

You can also provide `experimental_toolApprovalSecret` to `agent.stream()`.
The stream-level value overrides the constructor default.

[Loop Control](#loop-control)
-----------------------------

Unlike `ToolLoopAgent`, `WorkflowAgent` does not apply a default step limit.
When `stopWhen` is omitted, it continues until the model stops calling tools or
another natural termination condition is met.

A model that repeatedly calls tools can make an unlimited number of model
calls. Configure an explicit stop condition when you need to bound execution
time and cost.

Control how many steps the agent can take:

```
1

import { isStepCount } from 'ai';



2



3

const result = await agent.stream({



4

messages,



5

stopWhen: isStepCount(10), // Stop after 10 LLM calls



6

});
```

Omitting `stopWhen` already lets `WorkflowAgent` continue until it has finished
calling tools. You can make that intent explicit with `isLoopFinished()`:

```
1

import { isLoopFinished } from 'ai';



2



3

const result = await agent.stream({



4

messages,



5

stopWhen: isLoopFinished(),



6

});
```

`isLoopFinished()` is equivalent to omitting `stopWhen` for `WorkflowAgent`.
Use it with caution because a model that keeps calling tools can run
indefinitely and incur significant costs. See
[`isLoopFinished()`](/docs/reference/ai-sdk-core/loop-finished).

[Structured Output](#structured-output)
---------------------------------------

Parse agent responses into typed objects using `Output`:

```
1

import { Output } from '@ai-sdk/workflow';



2

import { z } from 'zod';



3



4

const result = await agent.stream({



5

messages,



6

output: Output.object({



7

schema: z.object({



8

sentiment: z.enum(['positive', 'neutral', 'negative']),



9

summary: z.string(),



10

}),



11

}),



12

});



13



14

console.log(result.output); // { sentiment: 'positive', summary: '...' }
```

[Configuration Options](#configuration-options)
-----------------------------------------------

`WorkflowAgent` accepts the same generation settings as `ToolLoopAgent` (`temperature`, `maxOutputTokens`, `topP`, etc.) plus workflow-specific options.

### [runtimeContext and toolsContext](#runtimecontext-and-toolscontext)

Pass server-side state through the agent loop without putting it into the prompt. Use these instead of the previous `experimental_context` option.

* `runtimeContext` is shared agent state that flows through `prepareStep`, lifecycle callbacks, and `onEnd`. Treat it as immutable; return a new value from `prepareStep` to update it for the current and subsequent steps.
* `toolsContext` is a per-tool map keyed by tool name. Each tool's `execute` only sees its own validated entry as `context`. Tools that declare a `contextSchema` validate their entry against the schema before execution.

workflow/agent-chat.ts

```
1

import { WorkflowAgent } from '@ai-sdk/workflow';



2

import { tool } from 'ai';



3

import { z } from 'zod';



4



5

const agent = new WorkflowAgent({



6

model: 'anthropic/claude-sonnet-4-6',



7

tools: {



8

weather: tool({



9

description: 'Get the weather for a city.',



10

inputSchema: z.object({ city: z.string() }),



11

contextSchema: z.object({



12

defaultUnit: z.enum(['celsius', 'fahrenheit']),



13

}),



14

execute: async ({ city }, { context }) => ({



15

city,



16

unit: context.defaultUnit,



17

}),



18

}),



19

},



20



21

// Shared agent state — available in `prepareStep`, lifecycle callbacks, and `onEnd`.



22

runtimeContext: {



23

tenantId: 'tenant_123',



24

requestId: 'req_abc',



25

plan: 'enterprise',



26

},



27



28

// Per-tool context — each tool sees only its own validated entry.



29

toolsContext: {



30

weather: { defaultUnit: 'celsius' },



31

},



32



33

prepareStep: ({ runtimeContext }) => {



34

if (runtimeContext.plan === 'enterprise') {



35

return { temperature: 0.2 };



36

}



37

return {};



38

},



39

});
```

`runtimeContext` and `toolsContext` can also be passed per-call to `stream()`, where they override the constructor-level defaults.

Because `WorkflowAgent` runs inside the Workflow runtime, context values may be persisted and replayed across workflow and step boundaries. Keep `runtimeContext`, `toolsContext`, and any context values returned from `prepareStep` serializable. Use plain data such as strings, numbers, booleans, arrays, plain objects, dates, URLs, maps, sets, and other Workflow-supported structured data. Do not put functions, class instances, symbols, `WeakMap`, `WeakSet`, database clients, or SDK clients in context. Pass identifiers or configuration data instead, and recreate non-serializable resources inside step functions.

This differs from `ToolLoopAgent`, which runs in memory and can carry richer JavaScript values for the lifetime of a single process. With `WorkflowAgent`, treating context as durable data keeps workflow replay and step execution reliable.

### [experimental\_sandbox](#experimental_sandbox)

Pass a sandbox session when tools need an execution environment. The sandbox is
available to tool descriptions and `execute` functions as
`experimental_sandbox`, and to `prepareStep`, where you can override it for the
current step:

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3

tools: {



4

shell: tool({



5

description: 'Run a shell command in the sandbox.',



6

inputSchema: z.object({ command: z.string() }),



7

execute: async ({ command }, { experimental_sandbox }) => {



8

if (!experimental_sandbox) {



9

throw new Error('Sandbox is not available');



10

}



11



12

return experimental_sandbox.run({ command });



13

},



14

}),



15

},



16

experimental_sandbox: sandbox,



17

});



18



19

await agent.stream({



20

messages,



21

writable: getWritable(),



22

experimental_sandbox: requestSandbox, // Overrides the constructor default.



23

});
```

`experimental_sandbox` is a live runtime handle, not durable context. Do not
store it in `runtimeContext` or `toolsContext`. If a tool runs as a separate
workflow step, pass serializable sandbox identifiers or configuration and
reattach inside that step.

### [prepareCall](#preparecall)

Called once before the agent loop starts. Use it to transform model, instructions, or other settings based on runtime context:

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3

prepareCall: async ({ model, tools, messages }) => {



4

return {



5

instructions: `Current time: ${new Date().toISOString()}`,



6

};



7

},



8

});
```

### [prepareStep](#preparestep)

Called before each step (LLM call). Use it to modify settings, manage context, or inject messages dynamically:

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3

prepareStep: async ({ stepNumber, experimental_sandbox }) => {



4

if (stepNumber > 5) {



5

return { toolChoice: 'none' }; // Force text response after 5 steps



6

}



7

if (experimental_sandbox) {



8

return { temperature: 0.2 };



9

}



10

return {};



11

},



12

});
```

Both `prepareCall` and `prepareStep` can also be passed per-call in `stream()`.

[Lifecycle Callbacks](#lifecycle-callbacks)
-------------------------------------------

Agents provide lifecycle callbacks for logging, observability, and custom telemetry. All callbacks can be defined in the constructor (agent-wide) or in `stream()` (per-call). When both are provided, both fire (constructor first):

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3



4

onStart({ messages }) {



5

console.log(`Agent started with ${messages.length} messages`);



6

},



7



8

onStepStart({ stepNumber }) {



9

console.log(`Step ${stepNumber} starting`);



10

},



11



12

onToolExecutionStart({ toolCall }) {



13

console.log(`Calling tool: ${toolCall.toolName}`);



14

},



15



16

onToolExecutionEnd({ toolCall, success, durationMs }) {



17

console.log(`Tool finished: ${toolCall.toolName}`, {



18

success,



19

durationMs,



20

});



21

},



22



23

onStepEnd({ usage, finishReason }) {



24

console.log('Step done:', { finishReason });



25

},



26



27

onEnd({ steps, totalUsage }) {



28

console.log(`Completed in ${steps.length} steps`);



29

},



30

});
```

For concrete tool sets, `WorkflowAgentToolExecutionStartEvent` and
`WorkflowAgentToolExecutionEndEvent` preserve the relationship between each
tool name and its input, context, and output types. TypeScript narrows the
nested `toolCall` directly, but use `Extract` or a user-defined type guard when
you need to narrow the correlated `toolContext` or `output` fields by tool name.

Tool input callbacks (`onInputStart`, `onInputDelta`, and
`onInputAvailable`) are also preserved by `WorkflowAgent`. The model call runs
inside a durable step, while callback functions remain in the workflow
context because arbitrary functions cannot cross the step boundary. As a
result, `WorkflowAgent` records the callback events during the model step and
replays them in order immediately after that step completes, before tool
execution and step lifecycle callbacks. They do not run concurrently with
model generation and cannot provide in-flight cancellation or backpressure.
Each callback receives its tool's `toolsContext` entry after
`contextSchema` validation.

For highly fragmented tool inputs, `onInputDelta` replay data is part of the
durable model-step result. Only configure `onInputDelta` when each generated
delta is needed; omit it to avoid retaining delta replay data.

The deprecated `experimental_onStart` and `experimental_onStepStart` names
remain available for backwards compatibility. When both the stable and
experimental name are provided in the same constructor or `stream()` call, the
stable callback is used.

[Type Inference](#type-inference)
---------------------------------

Infer the UI message type for type-safe client components:

```
1

import { WorkflowAgent, InferWorkflowAgentUIMessage } from '@ai-sdk/workflow';



2



3

const myAgent = new WorkflowAgent({



4

// ... configuration



5

});



6



7

export type MyAgentUIMessage = InferWorkflowAgentUIMessage<typeof myAgent>;
```

[Migrating from `DurableAgent`](#migrating-from-durableagent)
-------------------------------------------------------------

`WorkflowAgent` replaces the Workflow DevKit's [`DurableAgent`](https://workflow-sdk.dev/docs/api-reference/workflow-ai/durable-agent). The two share the same core idea — a durable agent loop that runs inside a workflow — but `WorkflowAgent` moves the class into the AI SDK, tightens typing, and introduces first-class tool approval. If you are using `DurableAgent` today, follow the steps below to switch.

### [Change the import and class name](#change-the-import-and-class-name)

`DurableAgent` was exported from `workflow/ai`. `WorkflowAgent` is exported from `@ai-sdk/workflow`, alongside its helpers.

```
1

- import { DurableAgent } from 'workflow/ai';



2

+ import { WorkflowAgent, type ModelCallStreamPart } from '@ai-sdk/workflow';



3



4

- const agent = new DurableAgent({



5

+ const agent = new WorkflowAgent({



6

model: 'anthropic/claude-sonnet-4-6',



7

instructions: 'You are a helpful assistant.',



8

tools: { /* ... */ },



9

});
```

Install the new package alongside `workflow`:

```
1

npm install @ai-sdk/workflow workflow@beta
```

### [Write `ModelCallStreamPart`, not `UIMessageChunk`](#write-modelcallstreampart-not-uimessagechunk)

`DurableAgent` wrote `UIMessageChunk` objects directly to the writable returned by `getWritable()`. `WorkflowAgent` writes the lower-level `ModelCallStreamPart` shape and leaves the conversion to a transform at the response boundary. This keeps the durable stream provider-shaped and avoids baking a UI protocol into the workflow payload.

```
1

// Inside the workflow



2

await agent.stream({



3

messages,



4

-   writable: getWritable<UIMessageChunk>(),



5

+   writable: getWritable<ModelCallStreamPart>(),



6

});
```

```
1

// Inside the route handler



2

+ import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



3



4

return createUIMessageStreamResponse({



5

-   stream: run.readable,



6

+   stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),



7

});
```

### [Replace `maxSteps` with `stopWhen`](#replace-maxsteps-with-stopwhen)

`DurableAgent` accepted `maxSteps` directly. `WorkflowAgent` uses the AI SDK's shared `stopWhen` conditions so the same stop logic works across `ToolLoopAgent`, `generateText`, and `streamText`.

```
1

+ import { isStepCount } from 'ai';



2



3

await agent.stream({



4

messages,



5

-   maxSteps: 10,



6

+   stopWhen: isStepCount(10),



7

});
```

See [Loop Control](/docs/agents/loop-control) for the full list of stop conditions.

### [Replace `experimental_output` with `output`](#replace-experimental_output-with-output)

```
1

+ import { Output } from '@ai-sdk/workflow';



2



3

await agent.stream({



4

messages,



5

-   experimental_output: Output.object({ schema }),



6

+   output: Output.object({ schema }),



7

});
```

The returned value is now on `result.output` (previously `result.experimental_output`).

### [WorkflowAgent: Use `needsApproval` for human-in-the-loop tools](#workflowagent-use-needsapproval-for-human-in-the-loop-tools)

With `DurableAgent`, tool approval was implemented by calling a Hook from inside the tool's `execute` function. `WorkflowAgent` makes approval a first-class tool property — the agent emits the approval request, suspends the workflow, and resumes automatically when the user responds.

```
1

bookFlight: tool({



2

description: 'Book a flight',



3

inputSchema: z.object({ flightId: z.string() }),



4

+   needsApproval: true,



5

-   execute: async (input) => {



6

-     const approved = await waitForApprovalHook(input);



7

-     if (!approved) throw new Error('Denied');



8

-     return bookFlightStep(input);



9

-   },



10

+   execute: bookFlightStep,



11

}),
```

`needsApproval` also accepts an async function so you can decide per-input
whether approval is required (see [Tool Approval](#tool-approval) above).

### [`uiMessages` / `collectUIMessages` is gone](#uimessages--collectuimessages-is-gone)

`DurableAgent.stream()` returned accumulated `uiMessages` when `collectUIMessages: true` was set. `WorkflowAgent.stream()` returns `ModelMessage[]` on `result.messages` instead.

For persistence, store `UIMessage[]` as your source of truth and call [`convertToModelMessages`](/docs/reference/ai-sdk-ui/convert-to-model-messages) before passing them to the agent — this is the pattern described in [Chatbot Message Persistence](/docs/ai-sdk-ui/chatbot-message-persistence). There is no built-in `ModelMessage` → `UIMessage` conversion, so avoid persisting `result.messages` as your only copy if you need to render the conversation in the UI later.

```
1

const result = await agent.stream({



2

messages,



3

writable: getWritable<ModelCallStreamPart>(),



4

-   collectUIMessages: true,



5

});



6



7

- return { uiMessages: result.uiMessages };



8

+ return { messages: result.messages };
```

### [No `generate()` method](#no-generate-method)

`WorkflowAgent` only exposes `stream()`. If you were calling `agent.generate()`, switch to `stream()` and read `result.messages` / `result.output` once the promise resolves.

### [Replace `experimental_context` with `runtimeContext` and `toolsContext`](#replace-experimental_context-with-runtimecontext-and-toolscontext)

`WorkflowAgent` no longer accepts `experimental_context`. Split the value into shared agent state (`runtimeContext`) and per-tool state (`toolsContext`); each tool's `execute` then receives only its own validated entry as `context`. See [runtimeContext and toolsContext](#runtimecontext-and-toolscontext) for the full shape.

```
1

const agent = new WorkflowAgent({



2

model: 'anthropic/claude-sonnet-4-6',



3

tools: { weather: weatherTool },



4

-   experimental_context: { tenantId: 'tenant_123', apiKey: 'sk-...' },



5

+   runtimeContext: { tenantId: 'tenant_123' },



6

+   toolsContext: { weather: { apiKey: 'sk-...' } },



7

});
```

### [Everything else](#everything-else)

Other options carry over with the same names: `prepareStep`, `onStart`, `onStepStart`, `onStepEnd`, `onEnd`, `onError`, `toolChoice`, `activeTools`, `timeout`, `repairToolCall`, `experimental_sandbox`, and the usual generation settings (`temperature`, `maxOutputTokens`, `topP`, …). `WorkflowAgent` additionally adds `prepareCall` (runs once before the loop) and the `onToolExecutionStart` / `onToolExecutionEnd` lifecycle callbacks documented above. The deprecated `experimental_onStart` and `experimental_onStepStart` aliases remain available for backwards compatibility.

[Next Steps](#next-steps)
-------------------------

* [WorkflowAgent API Reference](/docs/reference/ai-sdk-workflow/workflow-agent) for detailed parameter documentation
* [WorkflowChatTransport API Reference](/docs/reference/ai-sdk-workflow/workflow-chat-transport) for stream reconnection options
* [Building Agents](/docs/agents/building-agents) for the in-memory `ToolLoopAgent` alternative
* [Loop Control](/docs/agents/loop-control) for advanced stop conditions

[Previous

Tool Approvals](/docs/agents/tool-approvals)[Next

Terminal UI](/docs/agents/terminal-ui)
