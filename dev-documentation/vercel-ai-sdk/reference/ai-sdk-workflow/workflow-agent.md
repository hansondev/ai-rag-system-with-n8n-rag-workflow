---
title: "WorkflowAgent"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-workflow/workflow-agent
section: reference
crawled: 2026-09-20
---

# WorkflowAgent

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-workflow/workflow-agent

[AI SDK Workflow](/docs/reference/ai-sdk-workflow)WorkflowAgent


[`WorkflowAgent`](#workflowagent)
=================================

Creates a durable, resumable AI agent for use inside a workflow. `WorkflowAgent` handles the agent loop, tool schema serialization across workflow step boundaries, and built-in tool approval flows.

Unlike [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent) from the `ai` package, `WorkflowAgent` is designed to survive process restarts, pause for human approval, and integrate with the Workflow DevKit's step mechanism.

`WorkflowAgent` supports `runtimeContext` for shared agent state and `toolsContext` for per-tool context. Because these values can cross workflow and step boundaries, keep them serializable durable data. Unlike `ToolLoopAgent`, do not place functions, class instances, symbols, database clients, or SDK clients in context; pass identifiers or configuration and recreate non-serializable resources inside step functions.

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

description: 'Get the weather in a location',



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



21



22

const result = await agent.stream({



23

messages: [



24

{



25

role: 'user',



26

content: [{ type: 'text', text: 'What is the weather in NYC?' }],



27

},



28

],



29

});



30



31

console.log(result.messages);
```

To see `WorkflowAgent` in action, check out [these examples](#examples).

[Import](#import)
-----------------

```
import { WorkflowAgent } from "@ai-sdk/workflow"
```

[Constructor](#constructor)
---------------------------

### [Parameters](#parameters)

### id?:

string

### model:

LanguageModel

### instructions?:

Instructions

### tools?:

Record<string, Tool>

### toolChoice?:

ToolChoice

### stopWhen?:

StopCondition | StopCondition[]

### activeTools?:

ActiveTools<TTools>

### output?:

OutputSpecification

### repairToolCall?:

ToolCallRepairFunction

### experimental\_download?:

DownloadFunction

### experimental\_sandbox?:

Experimental\_SandboxSession

### experimental\_toolApprovalSecret?:

WorkflowToolApprovalSecret

### prepareStep?:

PrepareStepCallback

### prepareCall?:

PrepareCallCallback

### runtimeContext?:

Context

### toolsContext?:

InferToolSetContext<TTools>

### telemetry?:

TelemetryOptions

### onStart?:

WorkflowAgentOnStartCallback

GenerateTextStartEvent

### model:

LanguageModel

### messages:

Array<ModelMessage>

### runtimeContext:

Context

### toolsContext:

InferToolSetContext<Tools>

### experimental\_onStart?:

WorkflowAgentOnStartCallback

### onStepStart?:

WorkflowAgentOnStepStartCallback

GenerateTextStepStartEvent

### model:

LanguageModel

### messages:

Array<ModelMessage>

### steps:

ReadonlyArray<StepResult>

### runtimeContext:

Context

### toolsContext:

InferToolSetContext<Tools>

### experimental\_onStepStart?:

WorkflowAgentOnStepStartCallback

### onToolExecutionStart?:

WorkflowAgentOnToolExecutionStartCallback

WorkflowAgentToolExecutionStartEvent

### toolCall:

{ type: "tool-call"; toolCallId: string; toolName: string; input: unknown }

### stepNumber:

number

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[NAME]> | undefined

### onToolExecutionEnd?:

WorkflowAgentOnToolExecutionEndCallback

WorkflowAgentToolExecutionEndEvent

### toolCall:

{ type: "tool-call"; toolCallId: string; toolName: string; input: unknown }

### stepNumber:

number

### durationMs:

number

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[NAME]> | undefined

### success:

boolean

### output?:

InferToolOutput<TOOLS[NAME]>

### error?:

unknown

### onStepEnd?:

WorkflowAgentOnStepEndCallback

### onStepFinish?:

WorkflowAgentOnStepFinishCallback

### onEnd?:

WorkflowAgentOnEndCallback

### maxOutputTokens?:

number

### temperature?:

number

### topP?:

number

### topK?:

number

### presencePenalty?:

number

### frequencyPenalty?:

number

### stopSequences?:

string[]

### seed?:

number

### maxRetries?:

number

### headers?:

Record<string, string | undefined>

### providerOptions?:

ProviderOptions

[Properties](#properties)
-------------------------

### id:

string | undefined

### tools:

Record<string, Tool>

[Methods](#methods)
-------------------

### [`stream()`](#stream)

Runs the agent loop, streaming responses and executing tool calls as needed. Returns a promise resolving to a `WorkflowAgentStreamResult`.

```
1

const result = await agent.stream({



2

messages: [{ role: 'user', content: [{ type: 'text', text: 'Hello' }] }],



3

});
```

### prompt:

string | Array<ModelMessage>

### messages:

Array<ModelMessage>

### writable?:

WritableStream<ModelCallStreamPart>

### instructions?:

Instructions

### system?:

string

### stopWhen?:

StopCondition | StopCondition[]

### toolChoice?:

ToolChoice

### activeTools?:

ActiveTools<TTools>

### output?:

OutputSpecification

### timeout?:

number

### sendFinish?:

boolean

### preventClose?:

boolean

### includeRawChunks?:

boolean

### repairToolCall?:

ToolCallRepairFunction

### experimental\_transform?:

StreamTextTransform | Array<StreamTextTransform>

### experimental\_download?:

DownloadFunction

### experimental\_sandbox?:

Experimental\_SandboxSession

### experimental\_toolApprovalSecret?:

WorkflowToolApprovalSecret

### telemetry?:

TelemetryOptions

### runtimeContext?:

Context

### toolsContext?:

InferToolSetContext<TTools>

### prepareStep?:

PrepareStepCallback

### onStart?:

WorkflowAgentOnStartCallback

### experimental\_onStart?:

WorkflowAgentOnStartCallback

### onStepStart?:

WorkflowAgentOnStepStartCallback

### experimental\_onStepStart?:

WorkflowAgentOnStepStartCallback

### onToolExecutionStart?:

WorkflowAgentOnToolExecutionStartCallback

### onToolExecutionEnd?:

WorkflowAgentOnToolExecutionEndCallback

### onStepEnd?:

WorkflowAgentOnStepEndCallback

### onStepFinish?:

WorkflowAgentOnStepFinishCallback

### onEnd?:

WorkflowAgentOnEndCallback

### onError?:

WorkflowAgentOnErrorCallback

### onAbort?:

WorkflowAgentOnAbortCallback

#### [Returns](#returns)

Returns a `Promise<WorkflowAgentStreamResult>` with the following properties:

### messages:

Array<ModelMessage>

### steps:

Array<StepResult>

### toolCalls:

Array<ToolCall>

### toolResults:

Array<ToolResult>

### error:

unknown | undefined

### output:

OUTPUT

[Utilities](#utilities)
-----------------------

### [`createModelCallToUIChunkTransform(options?)`](#createmodelcalltouichunktransformoptions)

Creates a `TransformStream` that converts raw `ModelCallStreamPart` chunks (written by the agent to the `writable` stream) into `UIMessageChunk` objects suitable for client consumption.

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2



3

return createUIMessageStreamResponse({



4

stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),



5

});
```

When resuming with a `WorkflowChatTransport` cursor, replay the raw workflow
stream from index `0` and pass the non-negative UI chunk index to the transform:

```
1

const readable = run



2

.getReadable({ startIndex: 0 })



3

.pipeThrough(createModelCallToUIChunkTransform({ uiStartIndex: startIndex }));
```

`uiStartIndex` must be a non-negative safe integer. Raw model stream parts and
UI message chunks are not one-to-one, so do not pass a UI chunk index to
`getReadable`. Negative tail indexes require a durable stream that already
stores `UIMessageChunk` objects.

### [`toUIMessageChunk()`](#touimessagechunk)

Converts a single `ModelCallStreamPart` to a `UIMessageChunk`. Returns `undefined` for parts that don't map to UI chunks.

```
1

import { toUIMessageChunk } from '@ai-sdk/workflow';



2



3

const uiChunk = toUIMessageChunk(modelCallPart);
```

[Types](#types)
---------------

### [`ActiveTools`](#activetools)

```
1

type ActiveTools<TTools extends ToolSet> =



2

| ReadonlyArray<keyof TTools & string>



3

| undefined;
```

Limits a workflow agent call to the listed tool names. `undefined` means no tool restriction is applied.

### [`InferWorkflowAgentUIMessage`](#inferworkflowagentuimessage)

Infers the UI message type for a `WorkflowAgent` instance. Optionally accepts a second type argument for custom message metadata.

```
1

import { WorkflowAgent, InferWorkflowAgentUIMessage } from '@ai-sdk/workflow';



2



3

const agent = new WorkflowAgent({



4

model: 'anthropic/claude-sonnet-4-6',



5

tools: { weather: weatherTool },



6

});



7



8

type MyAgentUIMessage = InferWorkflowAgentUIMessage<typeof agent>;
```

### [`InferWorkflowAgentTools`](#inferworkflowagenttools)

Infers the tool set type of a `WorkflowAgent` instance.

```
1

import { WorkflowAgent, InferWorkflowAgentTools } from '@ai-sdk/workflow';



2



3

type MyTools = InferWorkflowAgentTools<typeof myAgent>;
```

[Examples](#examples)
---------------------

### [Basic Agent with Tools](#basic-agent-with-tools)

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

condition: 'sunny',



18

}),



19

}),



20

},



21

});



22



23

const result = await agent.stream({



24

messages: [



25

{



26

role: 'user',



27

content: [{ type: 'text', text: 'What is the weather in NYC?' }],



28

},



29

],



30

});



31



32

console.log(result.messages);



33

console.log(result.steps);
```

### [Agent in a Workflow with Durable Tools](#agent-in-a-workflow-with-durable-tools)

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

// Tool execute functions marked with 'use step' become durable workflow steps



7

// with automatic retries and persistence



8

async function searchFlightsStep(input: {



9

origin: string;



10

destination: string;



11

}) {



12

'use step';



13

const response = await fetch(`https://api.flights.example/search?...`);



14

return response.json();



15

}



16



17

export async function chat(messages: UIMessage[]) {



18

'use workflow';



19



20

const modelMessages = await convertToModelMessages(messages);



21



22

const agent = new WorkflowAgent({



23

model: 'anthropic/claude-sonnet-4-6',



24

instructions: 'You are a flight booking assistant.',



25

tools: {



26

searchFlights: tool({



27

description: 'Search for available flights',



28

inputSchema: z.object({



29

origin: z.string(),



30

destination: z.string(),



31

}),



32

execute: searchFlightsStep,



33

}),



34

},



35

});



36



37

const result = await agent.stream({



38

messages: modelMessages,



39

writable: getWritable<ModelCallStreamPart>(),



40

});



41



42

return { messages: result.messages };



43

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

### [Agent with Structured Output](#agent-with-structured-output)

```
1

import { WorkflowAgent, Output } from '@ai-sdk/workflow';



2

import { z } from 'zod';



3



4

const analysisAgent = new WorkflowAgent({



5

model: 'anthropic/claude-sonnet-4-6',



6

});



7



8

const result = await analysisAgent.stream({



9

messages: [



10

{



11

role: 'user',



12

content: [



13

{



14

type: 'text',



15

text: 'Analyze: "The product exceeded my expectations!"',



16

},



17

],



18

},



19

],



20

output: Output.object({



21

schema: z.object({



22

sentiment: z.enum(['positive', 'negative', 'neutral']),



23

score: z.number(),



24

summary: z.string(),



25

}),



26

}),



27

});



28



29

console.log(result.output);



30

// { sentiment: 'positive', score: 9, summary: '...' }
```

### [Agent with Tool Approval](#agent-with-tool-approval)

For `WorkflowAgent`, tool approval is configured on the tool definition with
`needsApproval`. For `generateText`, `streamText`, and `ToolLoopAgent`, use
`toolApproval` instead.

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

experimental_toolApprovalSecret: {



8

environmentVariable: 'TOOL_APPROVAL_SECRET',



9

},



10

tools: {



11

bookFlight: tool({



12

description: 'Book a flight',



13

inputSchema: z.object({



14

flightId: z.string(),



15

passengerName: z.string(),



16

}),



17

needsApproval: true, // Pauses the agent until user approves



18

execute: bookFlightStep,



19

}),



20

},



21

});
```

When `experimental_toolApprovalSecret` is configured, each approval request is
signed over its approval ID, tool call ID, tool name, and validated input.
Replayed approvals with a missing or invalid signature do not execute the tool.
The signature is preserved in the durable stream and UI message history, while
only the environment variable name crosses workflow boundaries. Signing and
verification steps read the raw secret from their local environment and do not
serialize it. A stream-level reference overrides the constructor value.

### [Agent with Lifecycle Callbacks](#agent-with-lifecycle-callbacks)

```
1

import { WorkflowAgent } from '@ai-sdk/workflow';



2



3

const agent = new WorkflowAgent({



4

model: 'anthropic/claude-sonnet-4-6',



5

tools: { weather: weatherTool },



6



7

// Agent-wide callbacks



8

onStepEnd({ usage }) {



9

console.log('Tokens used:', usage.totalTokens);



10

},



11

});



12



13

const result = await agent.stream({



14

messages,



15



16

// Per-call callbacks (both fire)



17

onStepEnd({ usage }) {



18

await trackUsage(usage);



19

},



20



21

onEnd({ steps, totalUsage }) {



22

console.log(



23

`Done in ${steps.length} steps, ${totalUsage.totalTokens} tokens`,



24

);



25

},



26

});
```

[Previous

AI SDK Workflow](/docs/reference/ai-sdk-workflow)[Next

WorkflowChatTransport](/docs/reference/ai-sdk-workflow/workflow-chat-transport)
