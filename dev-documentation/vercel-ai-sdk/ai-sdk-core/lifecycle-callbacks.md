---
title: "Lifecycle Callbacks"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/lifecycle-callbacks
section: ai-sdk-core
crawled: 2026-09-20
---

# Lifecycle Callbacks

> Source: https://ai-sdk.dev/docs/ai-sdk-core/lifecycle-callbacks

[AI SDK Core](/docs/ai-sdk-core)Lifecycle Callbacks


[Lifecycle Callbacks](#lifecycle-callbacks)
===========================================

Event callbacks let you run your own code at important points in an AI SDK call.
You can attach them directly to `generateText`, `streamText`, `embed`, `embedMany`, and `rerank` calls to observe what happened, record usage, debug multi-step generations, and monitor tool execution.

They are especially useful when you want application-specific logic close to the call site:

* Log which model, prompt shape, and settings were used for a request.
* Record token usage, latency, finish reasons, and warnings for analytics or billing.
* Understand how a multi-step tool call moved from model response to tool execution to final answer.
* Track tool inputs, tool outputs, execution time, and errors.
* Attach your own request, user, tenant, or workflow identifiers through `runtimeContext` and `toolsContext`.

For automatic OpenTelemetry instrumentation across your application, use [Telemetry](/docs/ai-sdk-core/telemetry).
Use event callbacks when you want to run custom code for a specific AI SDK call.

[Basic Usage](#basic-usage)
---------------------------

Pass callbacks as options to the AI SDK function you are calling:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'What is the weather in San Francisco?',



6



7

onStart({ callId, modelId }) {



8

console.log('Generation started', { callId, modelId });



9

},



10



11

onEnd({ callId, usage, finishReason }) {



12

console.log('Generation finished', {



13

callId,



14

finishReason,



15

totalTokens: usage.totalTokens,



16

});



17

},



18

});
```

Callbacks can be synchronous or asynchronous. If a callback throws, the error is caught internally and the AI SDK call continues.
Because callbacks run as part of the lifecycle, keep them fast or enqueue expensive work in a background system.

[Use Cases](#use-cases)
-----------------------

### [Request Logging](#request-logging)

Use `onStart` and `onEnd` to record one application log for the beginning and end of a call.
The `callId` is available across lifecycle events, so you can correlate logs from the same request.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'Write a short product description for a camping mug.',



6



7

onStart({ callId, provider, modelId }) {



8

logger.info('ai.request.started', {



9

callId,



10

provider,



11

modelId,



12

});



13

},



14



15

onEnd({ callId, finishReason, usage, warnings }) {



16

logger.info('ai.request.finished', {



17

callId,



18

finishReason,



19

usage,



20

warningCount: warnings?.length ?? 0,



21

});



22

},



23

});
```

This pattern works well for audit logs, internal dashboards, and tracking usage for a particular feature.

### [Measuring Model Performance](#measuring-model-performance)

`onLanguageModelCallEnd` runs after a provider response has been normalized and parsed.
For `streamText`, the event also includes streaming-specific timing data such as time to first output and gaps between output chunks.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Explain partial prerendering in two paragraphs.',



6



7

onLanguageModelCallEnd({



8

callId,



9

modelId,



10

usage,



11

performance,



12

providerMetadata,



13

}) {



14

metrics.histogram('ai.model.response_time_ms', performance.responseTimeMs, {



15

callId,



16

modelId,



17

});



18



19

metrics.gauge('ai.model.tokens_per_second', {



20

output: performance.outputTokensPerSecond,



21

total: performance.effectiveTotalTokensPerSecond,



22

tokens: usage.totalTokens,



23

});



24



25

logger.info('ai.model.provider_metadata', {



26

callId,



27

providerMetadata,



28

});



29

},



30

});



31



32

for await (const textPart of result.textStream) {



33

process.stdout.write(textPart);



34

}
```

Use model-call events when you want to measure provider work specifically.
Use step events when you want timing that includes SDK-managed work such as local tool execution.

### [Debugging Multi-Step Tool Calls](#debugging-multi-step-tool-calls)

When you use tools with `generateText` or `streamText`, a single user request can involve multiple model calls.
Each model call is a step. The model may call a tool in one step, receive the tool result, and then produce a final answer in the next step.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, isStepCount, tool } from 'ai';



2

import { z } from 'zod';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

stopWhen: isStepCount(5),



7

prompt: 'What is the weather in San Francisco?',



8

tools: {



9

weather: tool({



10

description: 'Get the weather in a location',



11

inputSchema: z.object({ location: z.string() }),



12

execute: async ({ location }) => getWeather(location),



13

}),



14

},



15



16

onStepStart({ stepNumber, messages, steps }) {



17

console.log(`Step ${stepNumber} started`, {



18

messageCount: messages.length,



19

previousSteps: steps.length,



20

});



21

},



22



23

onStepEnd({ stepNumber, finishReason, toolCalls, usage, performance }) {



24

console.log(`Step ${stepNumber} finished`, {



25

finishReason,



26

toolCalls: toolCalls.map(toolCall => toolCall.toolName),



27

totalTokens: usage.totalTokens,



28

stepTimeMs: performance.stepTimeMs,



29

});



30

},



31

});
```

This helps answer questions such as:

* Did the model call a tool or answer directly?
* How many steps did the request take?
* Which step used the most tokens?
* Did time go to the model response or to local tool execution?

### [Monitoring Tool Execution](#monitoring-tool-execution)

Tool execution callbacks run around the tool's `execute` function.
Use them to record tool usage, latency, successful results, and tool errors.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

prompt: 'Find flights from SFO to JFK tomorrow morning.',



7

tools: {



8

searchFlights: tool({



9

description: 'Search available flights',



10

inputSchema: z.object({



11

origin: z.string(),



12

destination: z.string(),



13

}),



14

execute: async input => searchFlights(input),



15

}),



16

},



17



18

onToolExecutionStart({ callId, toolCall }) {



19

logger.info('ai.tool.started', {



20

callId,



21

toolCallId: toolCall.toolCallId,



22

toolName: toolCall.toolName,



23

input: toolCall.input,



24

});



25

},



26



27

onToolExecutionEnd({ callId, toolCall, toolExecutionMs, toolOutput }) {



28

logger.info('ai.tool.finished', {



29

callId,



30

toolCallId: toolCall.toolCallId,



31

toolName: toolCall.toolName,



32

durationMs: toolExecutionMs,



33

success: toolOutput.type === 'tool-result',



34

});



35

},



36

});
```

`toolOutput` is a discriminated union. When `toolOutput.type` is `'tool-result'`, the output is available on `toolOutput.output`. When it is `'tool-error'`, the error is available on `toolOutput.error`.

### [Observing Embeddings and Reranking](#observing-embeddings-and-reranking)

Embedding and reranking callbacks are simpler: they expose `onStart` and `onEnd` around the operation.
This is useful for retrieval pipelines where you want to understand how often you are embedding, how many values you embed, and how reranking changes result sets.

```
1

import { embedMany, rerank } from 'ai';



2

import { cohere } from '@ai-sdk/cohere';



3



4

const values = ['sunny day at the beach', 'rainy afternoon in the city'];



5



6

const { embeddings } = await embedMany({



7

model: 'openai/text-embedding-3-small',



8

values,



9



10

onStart({ callId, operationId, modelId, value }) {



11

logger.info('ai.embedding.started', {



12

callId,



13

operationId,



14

modelId,



15

valueCount: Array.isArray(value) ? value.length : 1,



16

});



17

},



18



19

onEnd({ callId, usage }) {



20

logger.info('ai.embedding.finished', {



21

callId,



22

tokens: usage.tokens,



23

});



24

},



25

});



26



27

const { ranking } = await rerank({



28

model: cohere.reranking('rerank-v3.5'),



29

documents: values,



30

query: 'talk about rain',



31



32

onEnd({ callId, ranking }) {



33

logger.info('ai.rerank.finished', {



34

callId,



35

topResult: ranking[0],



36

});



37

},



38

});
```

[Generation Lifecycle](#generation-lifecycle)
---------------------------------------------

`generateText` and `streamText` expose the richest lifecycle because they can involve prompts, model calls, tool calls, and multiple steps.

A typical single-step generation runs in this order:

1. `onStart`
2. `onStepStart`
3. `onLanguageModelCallStart`
4. `onLanguageModelCallEnd`
5. `onStepEnd`
6. `onEnd`

A multi-step generation with local tool execution usually runs like this:

1. `onStart`
2. `onStepStart`
3. `onLanguageModelCallStart`
4. `onLanguageModelCallEnd`
5. `onToolExecutionStart`
6. `onToolExecutionEnd`
7. `onStepEnd`
8. Repeat step callbacks until the stop condition is met
9. `onEnd`

`onStepStart` and `onStepEnd` describe the full step.
`onLanguageModelCallStart` and `onLanguageModelCallEnd` describe only the model call inside that step.
This distinction matters when the step includes local tool execution: the step duration can be longer than the model response duration.

[Runtime and Tool Context](#runtime-and-tool-context)
-----------------------------------------------------

Lifecycle callbacks receive the full `runtimeContext` and `toolsContext` values that flow through the call.
This makes callbacks useful for attaching application context without changing prompts or tool inputs.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

prompt: 'Check the order status.',



7

runtimeContext: {



8

requestId: 'req_123',



9

tenantId: 'tenant_abc',



10

},



11

tools: {



12

getOrderStatus: tool({



13

inputSchema: z.object({ orderId: z.string() }),



14

contextSchema: z.object({ region: z.string() }),



15

execute: async ({ orderId }, { context }) =>



16

getOrderStatus(orderId, context.region),



17

}),



18

},



19

toolsContext: {



20

getOrderStatus: {



21

region: 'us-east-1',



22

},



23

},



24



25

onStart({ callId, runtimeContext }) {



26

logger.info('ai.request.started', {



27

callId,



28

requestId: runtimeContext.requestId,



29

tenantId: runtimeContext.tenantId,



30

});



31

},



32



33

onToolExecutionStart({ toolCall, toolContext }) {



34

logger.info('ai.tool.started', {



35

toolName: toolCall.toolName,



36

region: toolContext.region,



37

});



38

},



39

});
```

Telemetry integrations can filter `runtimeContext` and `toolsContext` before
exporting them. Lifecycle callbacks receive the full context objects. Be
careful not to log secrets or sensitive user data from callbacks.

[Available Callbacks](#available-callbacks)
-------------------------------------------

### [`generateText` and `streamText`](#generatetext-and-streamtext)

### onStart:

(event: GenerateTextStartEvent) => void | Promise<void>

### onStepStart:

(event: GenerateTextStepStartEvent) => void | Promise<void>

### onLanguageModelCallStart:

(event: LanguageModelCallStartEvent) => void | Promise<void>

### onLanguageModelCallEnd:

(event: LanguageModelCallEndEvent) => void | Promise<void>

### onToolExecutionStart:

(event: ToolExecutionStartEvent) => void | Promise<void>

### onToolExecutionEnd:

(event: ToolExecutionEndEvent) => void | Promise<void>

### onStepEnd:

(event: GenerateTextStepEndEvent) => void | Promise<void>

### onEnd:

(event: GenerateTextEndEvent) => void | Promise<void>

`onStepFinish` is deprecated. Use `onStepEnd` for new code.

### [`embed` and `embedMany`](#embed-and-embedmany)

### onStart:

(event: EmbedStartEvent) => void | Promise<void>

### onEnd:

(event: EmbedEndEvent) => void | Promise<void>

### [`rerank`](#rerank)

### onStart:

(event: RerankStartEvent) => void | Promise<void>

### onEnd:

(event: RerankEndEvent) => void | Promise<void>

[Event Data Reference](#event-data-reference)
---------------------------------------------

The exact event data depends on the callback. The tables below summarize the fields you will most commonly use.

### [Text Generation Events](#text-generation-events)

#### [onStart](#onstart)

Called once before any model calls are made.

### callId:

string

### operationId:

string

### provider:

string

### modelId:

string

### messages:

Array<ModelMessage>

### instructions:

Instructions | undefined

### tools:

ToolSet | undefined

### toolChoice:

ToolChoice | undefined

### activeTools:

ActiveTools<TOOLS>

### maxRetries:

number

### timeout:

TimeoutConfiguration | undefined

### headers:

Record<string, string | undefined> | undefined

### providerOptions:

ProviderOptions | undefined

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

#### [onStepStart](#onstepstart)

Called before each step begins.

### callId:

string

### stepNumber:

number

### provider:

string

### modelId:

string

### messages:

Array<ModelMessage>

### tools:

ToolSet | undefined

### activeTools:

ActiveTools<TOOLS>

### steps:

ReadonlyArray<StepResult>

### providerOptions:

ProviderOptions | undefined

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

#### [onLanguageModelCallStart](#onlanguagemodelcallstart)

Called immediately before the provider model call begins.

### callId:

string

### provider:

string

### modelId:

string

### instructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### tools:

ReadonlyArray<Record<string, unknown>> | undefined

#### [onLanguageModelCallEnd](#onlanguagemodelcallend)

Called after the provider response has been normalized and parsed, before local tool execution begins.

### callId:

string

### provider:

string

### modelId:

string

### finishReason:

FinishReason

### usage:

LanguageModelUsage

### content:

ReadonlyArray<ContentPart<TOOLS>>

### responseId:

string

### providerMetadata:

ProviderMetadata | undefined

### performance:

LanguageModelCallPerformance

#### [onToolExecutionStart](#ontoolexecutionstart)

Called before a local tool's `execute` function runs.

### callId:

string

### toolCall:

TypedToolCall

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[toolName]>

#### [onToolExecutionEnd](#ontoolexecutionend)

Called after a local tool's `execute` function completes or errors.

### callId:

string

### toolCall:

TypedToolCall

### toolExecutionMs:

number

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[toolName]>

### toolOutput:

{ type: 'tool-result'; output: unknown } | { type: 'tool-error'; error: unknown }

#### [onStepEnd](#onstepend)

Called after each step completes. The event is the full `StepResult` for that step.

### callId:

string

### stepNumber:

number

### model:

{ provider: string; modelId: string }

### content:

Array<ContentPart>

### text:

string

### toolCalls:

Array<TypedToolCall>

### toolResults:

Array<TypedToolResult>

### finishReason:

FinishReason

### usage:

LanguageModelUsage

### performance:

StepResultPerformance

### warnings:

CallWarning[] | undefined

### request:

LanguageModelRequestMetadata

### response:

LanguageModelResponseMetadata

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

#### [onEnd](#onend)

Called once when the full generation completes.

### callId:

string

### steps:

Array<StepResult>

### finalStep:

StepResult

### responseMessages:

Array<ResponseMessage>

### content:

Array<ContentPart>

### text:

string

### toolCalls:

Array<TypedToolCall>

### toolResults:

Array<TypedToolResult>

### finishReason:

FinishReason

### usage:

LanguageModelUsage

### warnings:

CallWarning[] | undefined

### [Embedding Events](#embedding-events)

`embed` and `embedMany` share the same event interfaces.
Use `operationId` to distinguish `'ai.embed'` from `'ai.embedMany'`.
For `embed`, `value` is a single string. For `embedMany`, `value` is an array of strings.

#### [onStart](#onstart-1)

### callId:

string

### operationId:

string

### provider:

string

### modelId:

string

### value:

string | Array<string>

### maxRetries:

number

### headers:

Record<string, string | undefined> | undefined

### providerOptions:

ProviderOptions | undefined

#### [onEnd](#onend-1)

### callId:

string

### operationId:

string

### provider:

string

### modelId:

string

### value:

string | Array<string>

### embedding:

Embedding | Array<Embedding>

### usage:

EmbeddingModelUsage

### warnings:

Array<Warning>

### providerMetadata:

ProviderMetadata | undefined

### response:

{ headers?: Record<string, string>; body?: unknown } | Array<{ headers?: Record<string, string>; body?: unknown } | undefined> | undefined

### [Rerank Events](#rerank-events)

#### [onStart](#onstart-2)

### callId:

string

### operationId:

string

### provider:

string

### modelId:

string

### documents:

Array<JSONObject | string>

### query:

string

### topN:

number | undefined

### maxRetries:

number

### headers:

Record<string, string | undefined> | undefined

### providerOptions:

ProviderOptions | undefined

#### [onEnd](#onend-2)

### callId:

string

### operationId:

string

### provider:

string

### modelId:

string

### documents:

Array<JSONObject | string>

### query:

string

### ranking:

Array<{ originalIndex: number; score: number; document: JSONObject | string }>

### warnings:

Array<Warning>

### providerMetadata:

ProviderMetadata | undefined

### response:

{ id?: string; timestamp: Date; modelId: string; headers?: Record<string, string>; body?: unknown }

[Previous

DevTools](/docs/ai-sdk-core/devtools)[Next

AI SDK Harnesses](/docs/ai-sdk-harnesses)
