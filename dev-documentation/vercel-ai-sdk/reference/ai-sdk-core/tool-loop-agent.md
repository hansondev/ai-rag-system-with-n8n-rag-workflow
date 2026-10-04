---
title: "ToolLoopAgent"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent
section: reference
crawled: 2026-09-20
---

# ToolLoopAgent

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent

[AI SDK Core](/docs/ai-sdk-core)ToolLoopAgent


[`ToolLoopAgent`](#toolloopagent)
=================================

Creates a reusable AI agent capable of generating text, streaming responses, and using tools over multiple steps (a reasoning-and-acting loop). `ToolLoopAgent` is ideal for building autonomous, multi-step agents that can take actions, call tools, and reason over the results until a stop condition is reached.

Unlike single-step calls like `generateText()`, an agent can iteratively invoke tools, collect tool results, and decide next actions until completion or user approval is required.

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

instructions: 'You are a helpful assistant.',



6

tools: {



7

weather: weatherTool,



8

calculator: calculatorTool,



9

},



10

});



11



12

const result = await agent.generate({



13

prompt: 'What is the weather in NYC?',



14

});



15



16

console.log(result.text);
```

For agents, `runtimeContext` is the shared runtime state that flows through the
loop. For guidance on `runtimeContext`, `toolsContext`, tool `context`, and
sensitive context filtering, see [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context).
Pass `experimental_sandbox` to `generate()` or `stream()` when tools need access to a command
or code execution environment.

To see `ToolLoopAgent` in action, check out [these examples](#examples).

[Import](#import)
-----------------

```
import { ToolLoopAgent } from "ai"
```

[Constructor](#constructor)
---------------------------

### [Parameters](#parameters)

### model:

LanguageModel

### instructions?:

Instructions

### allowSystemInMessages?:

boolean

### tools?:

Record<string, Tool>

### toolChoice?:

ToolChoice

### stopWhen?:

StopCondition | StopCondition[]

### activeTools?:

ActiveTools<TOOLS>

### toolOrder?:

ToolOrder<TOOLS>

### toolApproval?:

ToolApprovalConfiguration<TOOLS, RUNTIME\_CONTEXT>

### experimental\_toolCallers?:

Experimental\_ToolCallers<TOOLS>

### output?:

Output

### prepareStep?:

PrepareStepFunction

### include?:

{ requestBody?: boolean; requestMessages?: boolean; responseBody?: boolean; rawChunks?: boolean }

### repairToolCall?:

ToolCallRepairFunction

### experimental\_refineToolInput?:

ToolInputRefinement<TOOLS>

### onStart?:

GenerateTextOnStartCallback

GenerateTextStartEvent

### provider:

string

### modelId:

string

### instructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### tools:

TOOLS | undefined

### toolChoice:

ToolChoice<TOOLS> | undefined

### activeTools:

ActiveTools<TOOLS>

### toolOrder:

ToolOrder<TOOLS>

### maxOutputTokens:

number | undefined

### temperature:

number | undefined

### topP:

number | undefined

### topK:

number | undefined

### presencePenalty:

number | undefined

### frequencyPenalty:

number | undefined

### stopSequences:

string[] | undefined

### seed:

number | undefined

### maxRetries:

number

### timeout:

number | { totalMs?: number; stepMs?: number; firstChunkMs?: number; chunkMs?: number } | undefined

### headers:

Record<string, string | undefined> | undefined

### providerOptions:

ProviderOptions | undefined

### output:

OUTPUT | undefined

### abortSignal:

AbortSignal | undefined

### include:

{ requestBody?: boolean; requestMessages?: boolean; responseBody?: boolean } | undefined

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### onStepStart?:

GenerateTextOnStepStartCallback

GenerateTextStepStartEvent

### provider:

string

### modelId:

string

### instructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### tools:

TOOLS | undefined

### toolChoice:

LanguageModelV4ToolChoice | undefined

### activeTools:

ActiveTools<TOOLS>

### toolOrder:

ToolOrder<TOOLS>

### steps:

ReadonlyArray<StepResult<TOOLS>>

### providerOptions:

ProviderOptions | undefined

### timeout:

number | { totalMs?: number; stepMs?: number; firstChunkMs?: number; chunkMs?: number } | undefined

### headers:

Record<string, string | undefined> | undefined

### stopWhen:

StopCondition<TOOLS> | Array<StopCondition<TOOLS>> | undefined

### output:

OUTPUT | undefined

### abortSignal:

AbortSignal | undefined

### include:

{ requestBody?: boolean; requestMessages?: boolean; responseBody?: boolean } | undefined

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### onToolExecutionStart?:

OnToolExecutionStartCallback

ToolExecutionStartEvent

### callId:

string

### toolCall:

TypedToolCall<TOOLS>

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[toolName]>

### onToolExecutionEnd?:

OnToolExecutionEndCallback

ToolExecutionEndEvent

### callId:

string

### toolCall:

TypedToolCall<TOOLS>

### toolExecutionMs:

number

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[toolName]>

### toolOutput:

ToolOutput<TOOLS>

### onStepEnd?:

GenerateTextOnStepEndCallback

### onStepFinish?:

GenerateTextOnStepFinishCallback

### onEnd?:

GenerateTextOnEndCallback

### onFinish?:

GenerateTextOnEndCallback

### runtimeContext?:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### telemetry?:

TelemetryOptions

TelemetryOptions

### includeRuntimeContext?:

{ [KEY in keyof CONTEXT]?: boolean }

### includeToolsContext?:

{ [TOOL\_NAME in keyof InferToolSetContext<TOOLS>]?: { [KEY in keyof InferToolSetContext<TOOLS>[TOOL\_NAME]]?: boolean } }

### experimental\_download?:

DownloadFunction | undefined

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

### providerOptions?:

ProviderOptions

### headers?:

Record<string, string | undefined>

### callOptionsSchema?:

FlexibleSchema<CALL\_OPTIONS>

### prepareCall?:

PrepareCallFunction

### id?:

string

[Properties](#properties)
-------------------------

### tools:

Record<string, Tool>

### id:

string | undefined

[Methods](#methods)
-------------------

### [`generate()`](#generate)

Generates a response and triggers tool calls as needed, running the agent loop and returning the final result. Returns a promise resolving to a `GenerateTextResult`.

```
1

const result = await agent.generate({



2

prompt: 'What is the weather like?',



3

});
```

### prompt:

string | Array<ModelMessage>

### messages:

Array<ModelMessage>

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number; stepMs?: number; firstChunkMs?: number; chunkMs?: number }

### experimental\_sandbox?:

Experimental\_SandboxSession

### options?:

CALL\_OPTIONS

### onStart?:

GenerateTextOnStartCallback

### onStepStart?:

GenerateTextOnStepStartCallback

### onToolExecutionStart?:

OnToolExecutionStartCallback

### onToolExecutionEnd?:

OnToolExecutionEndCallback

### onStepEnd?:

GenerateTextOnStepEndCallback

### onStepFinish?:

GenerateTextOnStepFinishCallback

### onEnd?:

GenerateTextOnEndCallback

### onFinish?:

GenerateTextOnEndCallback

#### [Returns](#returns)

The `generate()` method returns a `GenerateTextResult` object (see [`generateText`](/docs/reference/ai-sdk-core/generate-text#returns) for details).

### [`stream()`](#stream)

Streams a response from the agent, including agent reasoning and tool calls, as they occur. Returns a `StreamTextResult`.

```
1

const stream = agent.stream({



2

prompt: 'Tell me a story about a robot.',



3

});



4



5

for await (const chunk of stream.textStream) {



6

console.log(chunk);



7

}
```

### prompt:

string | Array<ModelMessage>

### messages:

Array<ModelMessage>

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number; stepMs?: number; firstChunkMs?: number; chunkMs?: number }

### experimental\_sandbox?:

Experimental\_SandboxSession

### options?:

CALL\_OPTIONS

### experimental\_transform?:

StreamTextTransform | Array<StreamTextTransform>

### onStart?:

GenerateTextOnStartCallback

### onStepStart?:

GenerateTextOnStepStartCallback

### onToolExecutionStart?:

OnToolExecutionStartCallback

### onToolExecutionEnd?:

OnToolExecutionEndCallback

### onStepEnd?:

GenerateTextOnStepEndCallback

### onStepFinish?:

GenerateTextOnStepFinishCallback

### onEnd?:

GenerateTextOnEndCallback

### onFinish?:

GenerateTextOnEndCallback

#### [Returns](#returns-1)

The `stream()` method returns a `StreamTextResult` object (see [`streamText`](/docs/reference/ai-sdk-core/stream-text#returns) for details).

[Types](#types)
---------------

### [`ActiveTools`](#activetools)

```
1

type ActiveTools<TOOLS extends ToolSet> =



2

| ReadonlyArray<keyof TOOLS & string>



3

| undefined;
```

Limits an agent step to the listed tool names. `undefined` means no tool restriction is applied.

### [`InferAgentUIMessage`](#inferagentuimessage)

Infers the UI message type for the given agent instance. Useful for type-safe UI and message exchanges.

#### [Basic Example](#basic-example)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, InferAgentUIMessage } from 'ai';



2



3

const weatherAgent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: { weather: weatherTool },



6

});



7



8

type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
```

#### [Example with Message Metadata](#example-with-message-metadata)

You can provide a second type argument to customize the metadata for each message. This is useful for tracking rich metadata returned by the agent (such as createdAt, tokens, finish reason, etc.).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, InferAgentUIMessage } from 'ai';



2

import { z } from 'zod';



3



4

// Example schema for message metadata



5

const exampleMetadataSchema = z.object({



6

createdAt: z.number().optional(),



7

model: z.string().optional(),



8

totalTokens: z.number().optional(),



9

finishReason: z.string().optional(),



10

});



11

type ExampleMetadata = z.infer<typeof exampleMetadataSchema>;



12



13

// Define agent as usual



14

const metadataAgent = new ToolLoopAgent({



15

model: "xai/grok-4.6",



16

// ...other options



17

});



18



19

// Type-safe UI message type with custom metadata



20

type MetadataAgentUIMessage = InferAgentUIMessage<



21

typeof metadataAgent,



22

ExampleMetadata



23

>;
```

[Examples](#examples)
---------------------

### [Basic Agent with Tools](#basic-agent-with-tools)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isStepCount } from 'ai';



2

import { weatherTool, calculatorTool } from './tools';



3



4

const assistant = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

instructions: 'You are a helpful assistant.',



7

tools: {



8

weather: weatherTool,



9

calculator: calculatorTool,



10

},



11

stopWhen: isStepCount(3),



12

});



13



14

const result = await assistant.generate({



15

prompt: 'What is the weather in NYC and what is 100 * 25?',



16

});



17



18

console.log(result.text);



19

console.log(result.steps); // Array of all steps taken by the agent
```

### [Streaming Agent Response](#streaming-agent-response)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: 'You are a creative storyteller.',



4

});



5



6

const stream = agent.stream({



7

prompt: 'Tell me a short story about a time traveler.',



8

});



9



10

for await (const chunk of stream.textStream) {



11

process.stdout.write(chunk);



12

}
```

### [Agent with Output Parsing](#agent-with-output-parsing)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { z } from 'zod';



2



3

const analysisAgent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

output: {



6

schema: z.object({



7

sentiment: z.enum(['positive', 'negative', 'neutral']),



8

score: z.number(),



9

summary: z.string(),



10

}),



11

},



12

});



13



14

const result = await analysisAgent.generate({



15

prompt: 'Analyze this review: "The product exceeded my expectations!"',



16

});



17



18

console.log(result.output);



19

// Typed as { sentiment: 'positive' | 'negative' | 'neutral', score: number, summary: string }
```

### [Example: Approved Tool Execution](#example-approved-tool-execution)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, ModelMessage, ToolApprovalResponse, tool } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

instructions: 'You are an agent with access to a weather API.',



7

tools: {



8

weather: tool({



9

description: 'Get the weather in a location',



10

inputSchema: z.object({



11

location: z.string(),



12

}),



13

execute: async ({ location }) => ({



14

location,



15

temperature: 72,



16

}),



17

}),



18

},



19

toolApproval: {



20

weather: 'user-approval',



21

},



22

});



23



24

const messages: ModelMessage[] = [



25

{ role: 'user', content: 'Is it raining in Paris today?' },



26

];



27



28

const result = await agent.generate({ messages });



29

const approvals: ToolApprovalResponse[] = [];



30



31

for (const part of result.content) {



32

if (part.type === 'tool-approval-request') {



33

approvals.push({



34

type: 'tool-approval-response',



35

approvalId: part.approvalId,



36

approved: true,



37

});



38

}



39

}



40



41

messages.push(...result.responseMessages);



42

messages.push({ role: 'tool', content: approvals });



43



44

const approvedResult = await agent.generate({ messages });



45

console.log(approvedResult.text);
```

[Previous

Agent (Interface)](/docs/reference/ai-sdk-core/agent)[Next

createAgentUIStream](/docs/reference/ai-sdk-core/create-agent-ui-stream)
