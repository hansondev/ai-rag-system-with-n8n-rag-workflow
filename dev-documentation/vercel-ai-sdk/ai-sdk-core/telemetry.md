---
title: "Telemetry"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/telemetry
section: ai-sdk-core
crawled: 2026-09-20
---

# Telemetry

> Source: https://ai-sdk.dev/docs/ai-sdk-core/telemetry

[AI SDK Core](/docs/ai-sdk-core)Telemetry


[Telemetry](#telemetry)
=======================

The AI SDK uses [OpenTelemetry](https://opentelemetry.io/) to collect telemetry data.
OpenTelemetry is an open-source observability framework designed to provide
standardized instrumentation for collecting telemetry data.

Check out the [AI SDK Observability Integrations](/providers/observability)
to see providers that offer monitoring and tracing for AI SDK applications.

[Enabling telemetry](#enabling-telemetry)
-----------------------------------------

### [Step 1: Register the OpenTelemetry integration](#step-1-register-the-opentelemetry-integration)

OpenTelemetry span collection requires the `@ai-sdk/otel` package. Install it and register the integration once at application startup:

```
1

pnpm install @ai-sdk/otel
```

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3



4

registerTelemetry(new OpenTelemetry());
```

#### [Next.js](#nextjs)

For Next.js applications, create an `instrumentation.ts` file in your project root and register the AI SDK telemetry integration alongside your OpenTelemetry provider setup:

instrumentation.ts

```
1

import { registerOTel } from '@vercel/otel';



2

import { registerTelemetry } from 'ai';



3

import { OpenTelemetry } from '@ai-sdk/otel';



4



5

export function register() {



6

registerOTel({



7

serviceName: 'my-ai-app',



8

});



9



10

registerTelemetry(new OpenTelemetry());



11

}
```

See the [Next.js OpenTelemetry guide](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry) for more details on setting up OpenTelemetry in Next.js.

For Node.js applications (without Next.js), register the integration at the top level of your entry file.

### [Step 2: Enabling Telemetry](#step-2-enabling-telemetry)

Once a telemetry integration is registered, all AI SDK calls emit telemetry events by default.
You can still pass `telemetry` to attach metadata (like `functionId`) or to opt out of a specific call:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a short story about a cat.',



4

telemetry: {



5

functionId: `story-agent`,



6

},



7

});
```

By default, both inputs and outputs are recorded. You can disable them by setting the `recordInputs` and `recordOutputs` options to `false`.

Disabling the recording of inputs and outputs can be useful for privacy, data transfer, and performance reasons.
You might for example want to disable recording inputs if they contain sensitive information.

### [Opting out](#opting-out)

Telemetry is opt-out. To disable telemetry for a specific call, set `isEnabled: false`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a short story about a cat.',



4

telemetry: { isEnabled: false },



5

});
```

To disable telemetry globally, do not register any telemetry integrations via the `registerTelemetry()` function.

[Telemetry Metadata](#telemetry-metadata)
-----------------------------------------

You can provide a `functionId` to identify the function that the telemetry data is for,
and `runtimeContext` to include additional information in the telemetry data.
For the broader context model, see
[Runtime and Tool Context](/docs/ai-sdk-core/runtime-and-tool-context).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a short story about a cat.',



4

runtimeContext: {



5

userId: 'user_123',



6

requestId: 'req_abc',



7

},



8

telemetry: {



9

functionId: 'my-awesome-function',



10

},



11

});
```

### [Runtime context telemetry inclusion](#runtime-context-telemetry-inclusion)

`runtimeContext` can contain values that are useful inside your application but should not be sent to telemetry providers, such as user identifiers, tenant IDs, or credentials. Use `telemetry.includeRuntimeContext` to mark the top-level `runtimeContext` properties that should be included in telemetry:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a short story about a cat.',



4

runtimeContext: {



5

userId: 'user_123',



6

requestId: 'req_abc',



7

},



8

telemetry: {



9

includeRuntimeContext: {



10

requestId: true,



11

},



12

},



13

});
```

In this example, telemetry integrations receive `runtimeContext` as `{ requestId: 'req_abc' }`. Properties set to `false` or omitted are excluded. If `telemetry.includeRuntimeContext` is omitted, no runtime context properties are included. `telemetry.includeRuntimeContext` is supported by `generateText`, `streamText`, `ToolLoopAgent`, `embed`, `embedMany`, and `rerank`.

`telemetry.includeRuntimeContext` only filters telemetry integrations,
including OpenTelemetry integrations. Lifecycle callbacks and returned results
still receive the full `runtimeContext`.

### [Tool context](#tool-context)

Tool-specific context can also contain values that are useful during execution but should not be sent to telemetry providers, such as API keys or access tokens.
Use `telemetry.includeToolsContext` to include selected top-level properties from a tool's `context` in telemetry:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const weatherTool = tool({



2

inputSchema: z.object({



3

location: z.string(),



4

}),



5

contextSchema: z.object({



6

weatherApiKey: z.string(),



7

defaultUnit: z.enum(['celsius', 'fahrenheit']),



8

}),



9

execute: async ({ location }, { context }) =>



10

fetchWeather(location, context.weatherApiKey, context.defaultUnit),



11

});



12



13

const result = await generateText({



14

model: "xai/grok-4.6",



15

tools: { weather: weatherTool },



16

toolsContext: {



17

weather: {



18

weatherApiKey: 'weather-123',



19

defaultUnit: 'fahrenheit',



20

},



21

},



22

prompt: 'What is the weather in San Francisco?',



23

telemetry: {



24

includeToolsContext: {



25

weather: {



26

defaultUnit: true,



27

},



28

},



29

},



30

});
```

In this example, telemetry integrations receive `toolsContext.weather` and tool execution telemetry event `toolContext` as `{ defaultUnit: 'fahrenheit' }`.
Properties set to `false` or omitted are excluded. If `telemetry.includeToolsContext` is omitted, no tool context properties are included. `telemetry.includeToolsContext` is supported by `generateText`, `streamText`, and `ToolLoopAgent`.

`telemetry.includeToolsContext` only filters telemetry integrations, including
OpenTelemetry integrations. Tool execution, lifecycle callbacks, and returned
results still receive the full tool context. See [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context) for the difference
between tool execution context and telemetry event context.

[Custom Tracer](#custom-tracer)
-------------------------------

If you want your traces to use a `TracerProvider` other than the one provided by the `@opentelemetry/api` singleton, pass a custom `Tracer` to the `OpenTelemetry` constructor:

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3



4

const tracerProvider = new NodeTracerProvider();



5

registerTelemetry(



6

new OpenTelemetry({



7

tracer: tracerProvider.getTracer('gen_ai'),



8

}),



9

);
```

[Telemetry Integrations](#telemetry-integrations)
-------------------------------------------------

Telemetry integrations let you hook into the generation lifecycle to build custom observability — logging, analytics, DevTools, or any other monitoring system. Instead of wiring up individual callbacks on every call, you implement a `Telemetry` once and register it globally or pass it via `telemetry.integrations`.

The `OpenTelemetry` and `LegacyOpenTelemetry` from `@ai-sdk/otel` are the built-in integrations for collecting OpenTelemetry spans (see [Enabling telemetry](#enabling-telemetry) above).

### [Registering integrations globally](#registering-integrations-globally)

Use `registerTelemetry` to register an integration once for all AI SDK calls:

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3



4

registerTelemetry(new OpenTelemetry());
```

You can also register multiple integrations in a single call by passing them as additional arguments. They all receive the same lifecycle events:

```
1

import { registerTelemetryIntegration } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3

import { DevToolsTelemetry } from '@ai-sdk/devtools';



4



5

registerTelemetryIntegration(new OpenTelemetry(), DevToolsTelemetry());
```

### [Per-call integrations](#per-call-integrations)

You can also pass one or more integrations to individual `generateText` or `streamText` calls. When per-call integrations are provided, they replace the globally registered integrations for that call:

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

You can combine multiple integrations — they all receive the same lifecycle events:

```
1

telemetry: {



2

integrations: [DevToolsTelemetry(), customLogger()],



3

},
```

Errors inside integrations are caught and do not break the generation flow.

### [Tracing channel](#tracing-channel)

In Node.js, AI SDK telemetry lifecycle and execution events are also traced on
the `ai:telemetry` [tracing channel](https://nodejs.org/api/diagnostics_channel.html#diagnostics_channeltracingchannelnameorchannels).
This lets observability providers subscribe to AI SDK telemetry events without
requiring users to register a separate telemetry integration, and bind async
context across provider calls and tool executions.

```
1

import { tracingChannel } from 'node:diagnostics_channel';



2

import {



3

AI_SDK_TELEMETRY_TRACING_CHANNEL,



4

type TelemetryTracingChannelMessage,



5

} from 'ai';



6



7

tracingChannel(AI_SDK_TELEMETRY_TRACING_CHANNEL).subscribe({



8

start(message) {



9

const telemetryMessage = message as TelemetryTracingChannelMessage;



10



11

if (telemetryMessage.type === 'onStart') {



12

// Inspect telemetryMessage.event and forward it to your provider.



13

}



14

},



15

});
```

Tracing-channel events follow the same per-call telemetry settings as other
telemetry integrations. Setting `telemetry: { isEnabled: false }` disables both
registered integrations and tracing-channel events for that call.

### [Building a custom integration](#building-a-custom-integration)

Implement the `Telemetry` interface from the `ai` package. All methods are optional — implement only the lifecycle events you care about:

```
1

import type { Telemetry } from 'ai';



2



3

class MyIntegration implements Telemetry {



4

async onStart(event) {



5

console.log('Generation started:', event.modelId);



6

}



7



8

async onStepEnd(event) {



9

console.log(



10

`Step ${event.stepNumber} done:`,



11

event.usage.totalTokens,



12

'tokens',



13

);



14

}



15



16

async onToolExecutionEnd(event) {



17

if (event.toolOutput.type === 'tool-result') {



18

console.log(



19

`Tool "${event.toolCall.toolName}" took ${event.toolExecutionMs}ms`,



20

);



21

} else {



22

console.error(



23

`Tool "${event.toolCall.toolName}" failed:`,



24

event.toolOutput.error,



25

);



26

}



27

}



28



29

async onEnd(event) {



30

console.log('Done. Total tokens:', event.usage.totalTokens);



31

}



32



33

async onAbort(event) {



34

console.log('Stream aborted after', event.steps.length, 'finished steps');



35

}



36

}



37



38

export function myIntegration(): Telemetry {



39

return new MyIntegration();



40

}
```

### [Available lifecycle methods](#available-lifecycle-methods)

### onStart:

(event: GenerateTextStartEvent) => void | PromiseLike<void>

### onStepStart:

(event: GenerateTextStepStartEvent) => void | PromiseLike<void>

### onLanguageModelCallStart:

(event: LanguageModelCallStartEvent) => void | PromiseLike<void>

### onLanguageModelCallEnd:

(event: LanguageModelCallEndEvent) => void | PromiseLike<void>

### onToolExecutionStart:

(event: ToolExecutionStartEvent) => void | PromiseLike<void>

### onToolExecutionEnd:

(event: ToolExecutionEndEvent) => void | PromiseLike<void>

### onStepEnd:

(event: GenerateTextStepEndEvent) => void | PromiseLike<void>

### onEmbedEnd:

(event: EmbeddingModelCallEndEvent) => void | PromiseLike<void>

### onRerankEnd:

(event: RerankingModelCallEndEvent) => void | PromiseLike<void>

### onEnd:

(event: GenerateTextEndEvent) => void | PromiseLike<void>

### onAbort:

(event: GenerateTextAbortEvent) => void | PromiseLike<void>

The event types for each method are the same as the corresponding [lifecycle callbacks](/docs/ai-sdk-core/lifecycle-callbacks). See the lifecycle callbacks documentation for the full property reference of each event.

[Collected Data](#collected-data)
---------------------------------

The `@ai-sdk/otel` package provides two integrations that emit different span formats.
The `OpenTelemetry` follows the [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) and is the recommended integration.
The `LegacyOpenTelemetry` integration emits legacy AI SDK-specific spans.

### [GenAI Semantic Conventions](#genai-semantic-conventions)

The `OpenTelemetry` emits spans that follow the [OpenTelemetry Semantic Conventions for GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/).
By default, attributes use the `gen_ai.*` prefix. Provider names are mapped to well-known values (e.g. `openai`, `anthropic`, `gcp.vertex_ai`).

#### [generateText / streamText](#generatetext--streamtext)

For `generateText` and `streamText`, the integration records 3 types of spans:

* **`invoke_agent {modelId}`** (root span, `INTERNAL`): covers the full operation including all steps and tool calls.

  Initial attributes:

  + `gen_ai.operation.name`: `"invoke_agent"`
  + `gen_ai.provider.name`: the provider (e.g. `"openai"`, `"anthropic"`)
  + `gen_ai.request.model`: the requested model ID
  + `gen_ai.agent.name`: the `functionId` from telemetry settings
  + `gen_ai.system_instructions`: system instructions formatted as a JSON array of parts (when `recordInputs` is enabled)
  + `gen_ai.input.messages`: the input messages in [GenAI SemConv message format](#genai-message-format) (when `recordInputs` is enabled)
  + `gen_ai.request.temperature`: the temperature setting
  + `gen_ai.request.max_tokens`: the maximum output tokens
  + `gen_ai.request.top_p`: the topP setting
  + `gen_ai.request.top_k`: the topK setting
  + `gen_ai.request.frequency_penalty`: the frequency penalty
  + `gen_ai.request.presence_penalty`: the presence penalty
  + `gen_ai.request.stop_sequences`: the stop sequences
  + `gen_ai.request.seed`: the seed value

  Attributes set on finish:

  + `gen_ai.response.finish_reasons`: array of finish reasons (e.g. `["stop"]`, `["tool_call"]`)
  + `gen_ai.usage.input_tokens`: the number of input tokens used
  + `gen_ai.usage.output_tokens`: the number of output tokens used
  + `gen_ai.usage.cache_read.input_tokens`: cached input tokens read
  + `gen_ai.usage.cache_creation.input_tokens`: cached input tokens created
  + `gen_ai.output.messages`: the output in [GenAI SemConv message format](#genai-message-format) (when `recordOutputs` is enabled)
* **`chat {modelId}`** (step span, `CLIENT`): one span per LLM provider call, nested under the root span.

  Initial attributes:

  + `gen_ai.operation.name`: `"chat"`
  + `gen_ai.provider.name`: the provider
  + `gen_ai.request.model`: the requested model ID
  + `gen_ai.request.temperature`, `gen_ai.request.max_tokens`, `gen_ai.request.top_p`, `gen_ai.request.top_k`, `gen_ai.request.frequency_penalty`, `gen_ai.request.presence_penalty`, `gen_ai.request.stop_sequences`: request parameters
  + `gen_ai.system_instructions`: instructions supplied separately from the chat history, formatted as a JSON array of parts (when `recordInputs` is enabled)
  + `gen_ai.input.messages`: the prompt messages in [GenAI SemConv message format](#genai-message-format), including system messages that are part of the chat history in their original order (when `recordInputs` is enabled)
  + `gen_ai.tool.definitions`: the tool definitions as stringified JSON (when `recordInputs` is enabled)

  Attributes set on finish:

  + `gen_ai.response.finish_reasons`: array of finish reasons
  + `gen_ai.response.id`: the response ID from the provider
  + `gen_ai.response.model`: the model that generated the response (may differ from the requested model)
  + `gen_ai.usage.input_tokens`: input tokens used in this step
  + `gen_ai.usage.output_tokens`: output tokens used in this step
  + `gen_ai.usage.cache_read.input_tokens`: cached input tokens read
  + `gen_ai.usage.cache_creation.input_tokens`: cached input tokens created
  + `gen_ai.client.operation.duration`: provider call duration, in seconds
  + `gen_ai.client.operation.time_to_first_chunk`: time to the first streamed output chunk, in seconds (streaming calls only)
  + `gen_ai.client.operation.time_per_output_chunk`: average time between streamed output chunks, in seconds (streaming calls with multiple output chunks only)
  + `gen_ai.output.messages`: the output in [GenAI SemConv message format](#genai-message-format) (when `recordOutputs` is enabled)
* **`execute_tool {toolName}`** (tool span, `INTERNAL`): one span per tool execution, nested under the step span. See [GenAI tool call spans](#genai-tool-call-spans) for details.

#### [Deprecated object APIs (generateObject / streamObject)](#deprecated-object-apis-generateobject--streamobject)

`generateObject` and `streamObject` are deprecated. Use `generateText` and
`streamText` with the `output` property instead.

The deprecated object APIs emit the same span hierarchy as `generateText`/`streamText` with these additional attributes on the root span:

* `gen_ai.output.type`: `"json"`

The step spans also include `gen_ai.output.type: "json"`, and `gen_ai.output.messages` contains the generated object as a text part.

#### [embed / embedMany](#embed--embedmany)

For `embed` and `embedMany`, the integration records spans with `CLIENT` kind:

* **`embeddings {modelId}`** (root span): covers the full embedding operation.

  Initial attributes:

  + `gen_ai.operation.name`: `"embeddings"`
  + `gen_ai.provider.name`: the provider
  + `gen_ai.request.model`: the requested model ID
* **`embeddings {modelId}`** (inner span): one span per provider request,
  nested under the root span. `embed` creates one inner span. `embedMany`
  creates one inner span per provider batch call.

  Initial attributes:

  + `gen_ai.operation.name`: `"embeddings"`
  + `gen_ai.provider.name`: the provider
  + `gen_ai.request.model`: the model ID

  Attributes set on finish:

  + `gen_ai.usage.input_tokens`: the number of tokens used

Usage is recorded only on inner provider-request spans. For `embedMany`, sum
the usage from the inner spans to get the total usage for the operation.

#### [rerank](#rerank)

For `rerank`, the integration records spans with `CLIENT` kind:

* **`rerank {modelId}`** (root span): covers the full rerank operation.

  Initial attributes:

  + `gen_ai.operation.name`: `"rerank"`
  + `gen_ai.provider.name`: the provider
  + `gen_ai.request.model`: the requested model ID
* **`rerank {modelId}`** (inner span): one span per provider rerank call, nested under the root span.

  Initial attributes:

  + `gen_ai.operation.name`: `"rerank"`
  + `gen_ai.provider.name`: the provider
  + `gen_ai.request.model`: the model ID

#### [GenAI span details](#genai-span-details)

##### [GenAI message format](#genai-message-format)

The `gen_ai.input.messages` and `gen_ai.output.messages` attributes follow the [OpenTelemetry GenAI Semantic Conventions message format](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/).
Messages are JSON arrays of objects with a `role` and a `parts` array. Each part has a `type` and type-specific fields:

* `text`: `{ type: "text", content: "..." }`
* `reasoning`: `{ type: "reasoning", content: "..." }`
* `tool_call`: `{ type: "tool_call", id: "...", name: "...", arguments: ... }`
* `tool_call_response`: `{ type: "tool_call_response", id: "...", response: ... }`
* `blob`: `{ type: "blob", modality: "image"|"video"|"audio", mime_type: "...", content: "..." }` (base64-encoded)
* `uri`: `{ type: "uri", modality: "image"|"video"|"audio", mime_type: "...", uri: "..." }` (for URL-based files)

Output messages also include a `finish_reason` field (e.g. `"stop"`, `"tool_call"`, `"length"`, `"content_filter"`).

Instructions supplied through `instructions` (or the deprecated `system` option) are recorded separately in `gen_ai.system_instructions` as a JSON array of `{ type: "text", content: "..." }` parts. System messages supplied as chat history with `allowSystemInMessages` remain in `gen_ai.input.messages` in their original positions.

##### [GenAI tool call spans](#genai-tool-call-spans)

Tool call spans (`execute_tool {toolName}`) are nested under the step span and contain:

* `gen_ai.operation.name`: `"execute_tool"`
* `gen_ai.tool.name`: the name of the tool
* `gen_ai.tool.call.id`: the tool call ID
* `gen_ai.tool.type`: `"function"`
* `gen_ai.tool.call.arguments`: the input arguments (stringified JSON, when `recordInputs` is enabled)
* `gen_ai.execute_tool.duration`: the tool execution duration, in seconds
* `gen_ai.tool.call.result`: the output result (stringified JSON, when `recordOutputs` is enabled). Only set when the tool call succeeds.

### [Custom OpenTelemetry span attributes](#custom-opentelemetry-span-attributes)

Use `enrichSpan` to add custom attributes to spans created by the
`OpenTelemetry` integration. This is useful when an observability backend needs
vendor-specific attributes that are not AI SDK-owned semantics.

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3



4

registerTelemetry(



5

new OpenTelemetry({



6

enrichSpan: ({ spanType, operationId, callId, runtimeContext }) => {



7

return {



8

...getCustomAttributes(runtimeContext, spanType),



9

'my_app.operation_id': operationId,



10

'my_app.call_id': callId,



11

};



12

},



13

}),



14

);
```

The callback runs when each span is created and receives:

* `spanType`: the type of span being created (`operation`, `step`, `languageModel`, `tool`, `embedding`, or `reranking`).
* `operationId`: the AI SDK operation ID for the current call, such as `ai.generateText` or `ai.streamText`.
* `callId`: the unique ID for the current AI SDK call.
* `runtimeContext`: the telemetry-filtered runtime context for text generation, embedding, and reranking spans. Text generation spans also reflect updates from `prepareStep`.

Custom attributes are merged with AI SDK attributes on the span. AI SDK-owned
attributes take precedence when a custom attribute uses the same key.

`telemetry.includeRuntimeContext` is applied before telemetry integrations receive
`runtimeContext`, so custom span enrichment only receives top-level runtime context
properties explicitly set to `true`. If the option is omitted, no runtime context
properties are included.

Embedding and reranking operations can share the same runtime context with text
generation to attribute their spans to the same application request:

```
1

await embed({



2

model: 'openai/text-embedding-3-small',



3

value: 'sunny day at the beach',



4

runtimeContext: {



5

requestId: 'req_abc',



6

userId: 'user_123',



7

},



8

telemetry: {



9

includeRuntimeContext: { requestId: true },



10

},



11

});
```

A globally registered `OpenTelemetry({ enrichSpan })` integration receives
`{ requestId: 'req_abc' }` for the operation span and its embedding model span.
The same applies to every chunk in `embedMany` and to the operation and model
spans in `rerank`. The `onStart` and `onEnd` callbacks receive the full context.

### [Supplemental AI SDK attributes on OpenTelemetry spans](#supplemental-ai-sdk-attributes-on-opentelemetry-spans)

The GenAI semantic conventions cover the core model, prompt, response, tool call, and usage data. You can opt into additional AI SDK-specific attributes for data that is not represented by GenAI semantics:

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3



4

registerTelemetry(



5

new OpenTelemetry({



6

usage: true,



7

providerMetadata: true,



8

runtimeContext: true,



9

}),



10

);
```

This does not create additional AI SDK-specific spans such as `ai.generateText`, `ai.generateText.doGenerate`, or `ai.toolCall`. Instead, it adds only the selected supplemental attributes to the spans emitted by `OpenTelemetry`, such as `invoke_agent {modelId}`, `step {n}`, `chat {modelId}`, and `execute_tool {toolName}`.

All supplemental attributes are disabled by default. Enable only the data you want to collect:

```
1

registerTelemetry(



2

new OpenTelemetry({



3

usage: true,



4

providerMetadata: true,



5

embedding: true,



6

reranking: true,



7

runtimeContext: true,



8

headers: true,



9

toolChoice: true,



10

schema: true,



11

}),



12

);
```

The available options are:

* `usage`: detailed usage attributes that are not covered by GenAI usage attributes, such as uncached input tokens and output text/reasoning token details.
* `providerMetadata`: `ai.response.providerMetadata` on operation, step, and model-call spans.
* `embedding`: embedding inputs and outputs.
* `reranking`: rerank input documents and ranking output.
* `runtimeContext`: `ai.settings.context.*`.
* `headers`: `ai.request.headers.*`.
* `toolChoice`: `ai.prompt.toolChoice`.
* `schema`: object generation schema and output mode attributes.

The `recordInputs` and `recordOutputs` telemetry options are still respected for supplemental input and output attributes.

### [Legacy AI SDK Spans (`LegacyOpenTelemetry`)](#legacy-ai-sdk-spans-legacyopentelemetry)

The `LegacyOpenTelemetry` integration emits spans using AI SDK-specific `ai.*` prefixed attributes.
This is the legacy format. Consider migrating to the `OpenTelemetry` for better compatibility with observability platforms.

#### [generateText function](#generatetext-function)

`generateText` records 3 types of spans:

* `ai.generateText` (span): the full length of the generateText call. It contains 1 or more `ai.generateText.doGenerate` spans.
  It contains the [basic LLM span information](#basic-llm-span-information) and the following attributes:

  + `operation.name`: `ai.generateText` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.generateText"`
  + `ai.prompt`: the prompt that was used when calling `generateText`
  + `ai.response.text`: the text that was generated
  + `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  + `ai.response.finishReason`: the reason why the generation finished
  + `ai.settings.maxOutputTokens`: the maximum number of output tokens that were set
* `ai.generateText.doGenerate` (span): a provider doGenerate call. It can contain `ai.toolCall` spans.
  It contains the [call LLM span information](#call-llm-span-information) and the following attributes:

  + `operation.name`: `ai.generateText.doGenerate` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.generateText.doGenerate"`
  + `ai.prompt.messages`: the messages that were passed into the provider
  + `ai.prompt.tools`: array of stringified tool definitions. The serialized tools can be of type `function` or `provider`.
    Function tools include `FunctionTool` and `DynamicTool` definitions and have a `name`, `description` (optional), and `inputSchema` (JSON schema).
    Provider tools include `ProviderDefinedTool` and `ProviderExecutedTool` definitions and have a `name`, `id`, and `args` (Record).
  + `ai.prompt.toolChoice`: the stringified tool choice setting (JSON). It has a `type` property
    (`auto`, `none`, `required`, `tool`), and if the type is `tool`, a `toolName` property with the specific tool.
  + `ai.response.text`: the text that was generated
  + `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  + `ai.response.finishReason`: the reason why the generation finished
* `ai.toolCall` (span): a tool call that is made as part of the generateText call. See [Legacy tool call spans](#legacy-tool-call-spans) for more details.

#### [streamText function](#streamtext-function)

`streamText` records 3 types of spans and 2 types of events:

* `ai.streamText` (span): the full length of the streamText call. It contains a `ai.streamText.doStream` span.
  It contains the [basic LLM span information](#basic-llm-span-information) and the following attributes:

  + `operation.name`: `ai.streamText` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.streamText"`
  + `ai.prompt`: the prompt that was used when calling `streamText`
  + `ai.response.text`: the text that was generated
  + `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  + `ai.response.finishReason`: the reason why the generation finished
  + `ai.settings.maxOutputTokens`: the maximum number of output tokens that were set
* `ai.streamText.doStream` (span): a provider doStream call.
  This span contains an `ai.stream.firstChunk` event and `ai.toolCall` spans.
  It contains the [call LLM span information](#call-llm-span-information) and the following attributes:

  + `operation.name`: `ai.streamText.doStream` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.streamText.doStream"`
  + `ai.prompt.messages`: the messages that were passed into the provider
  + `ai.prompt.tools`: array of stringified tool definitions. The serialized tools can be of type `function` or `provider`.
    Function tools include `FunctionTool` and `DynamicTool` definitions and have a `name`, `description` (optional), and `inputSchema` (JSON schema).
    Provider tools include `ProviderDefinedTool` and `ProviderExecutedTool` definitions and have a `name`, `id`, and `args` (Record).
  + `ai.prompt.toolChoice`: the stringified tool choice setting (JSON). It has a `type` property
    (`auto`, `none`, `required`, `tool`), and if the type is `tool`, a `toolName` property with the specific tool.
  + `ai.response.text`: the text that was generated
  + `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  + `ai.response.msToFirstChunk`: the time it took to receive the first chunk in milliseconds
  + `ai.response.msToFinish`: the time it took to receive the finish part of the LLM stream in milliseconds
  + `ai.response.avgCompletionTokensPerSecond`: the average number of completion tokens per second
  + `ai.response.finishReason`: the reason why the generation finished
* `ai.toolCall` (span): a tool call that is made as part of the streamText call. See [Legacy tool call spans](#legacy-tool-call-spans) for more details.
* `ai.stream.firstChunk` (event): an event that is emitted when the first chunk of the stream is received.

  + `ai.response.msToFirstChunk`: the time it took to receive the first chunk
* `ai.stream.finish` (event): an event that is emitted when the finish part of the LLM stream is received.

#### [Deprecated object APIs](#deprecated-object-apis)

`generateObject` and `streamObject` are deprecated. Use `generateText` and
`streamText` with the `output` property instead.

If you still run deprecated object APIs, you will see legacy span names:

* `generateObject`: `ai.generateObject`, `ai.generateObject.doGenerate`
* `streamObject`: `ai.streamObject`, `ai.streamObject.doStream`, `ai.stream.firstChunk`

Legacy object spans include the same core metadata as other LLM spans, plus
object-specific attributes such as `ai.schema.*`, `ai.response.object`, and
`ai.settings.output`.

#### [embed function](#embed-function)

`embed` records 2 types of spans:

* `ai.embed` (span): the full length of the embed call. It contains 1 `ai.embed.doEmbed` spans.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  + `operation.name`: `ai.embed` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.embed"`
  + `ai.value`: the value that was passed into the `embed` function
  + `ai.embedding`: a JSON-stringified embedding
* `ai.embed.doEmbed` (span): a provider doEmbed call.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  + `operation.name`: `ai.embed.doEmbed` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.embed.doEmbed"`
  + `ai.values`: the values that were passed into the provider (array)
  + `ai.embeddings`: an array of JSON-stringified embeddings

#### [embedMany function](#embedmany-function)

`embedMany` records 2 types of spans:

* `ai.embedMany` (span): the full length of the embedMany call. It contains 1 or more `ai.embedMany.doEmbed` spans.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  + `operation.name`: `ai.embedMany` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.embedMany"`
  + `ai.values`: the values that were passed into the `embedMany` function
  + `ai.embeddings`: an array of JSON-stringified embedding
* `ai.embedMany.doEmbed` (span): a provider doEmbed call.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  + `operation.name`: `ai.embedMany.doEmbed` and the functionId that was set through `telemetry.functionId`
  + `ai.operationId`: `"ai.embedMany.doEmbed"`
  + `ai.values`: the values that were sent to the provider
  + `ai.embeddings`: an array of JSON-stringified embeddings for each value

#### [Legacy span details](#legacy-span-details)

##### [Basic LLM span information](#basic-llm-span-information)

Many spans that use LLMs (`ai.generateText`, `ai.generateText.doGenerate`, `ai.streamText`, `ai.streamText.doStream`) contain the following attributes:

* `resource.name`: the functionId that was set through `telemetry.functionId`
* `ai.model.id`: the id of the model
* `ai.model.provider`: the provider of the model
* `ai.request.headers.*`: the request headers that were passed in through `headers`
* `ai.response.providerMetadata`: provider specific metadata returned with the generation response
* `ai.settings.maxRetries`: the maximum number of retries that were set
* `ai.telemetry.functionId`: the functionId that was set through `telemetry.functionId`
* `ai.settings.runtimeContext.*`: the runtime context that was passed in through the `runtimeContext` option, filtered to top-level properties marked with `telemetry.includeRuntimeContext` when configured
* `ai.usage.completionTokens`: the number of completion tokens that were used
* `ai.usage.promptTokens`: the number of prompt tokens that were used

##### [Call LLM span information](#call-llm-span-information)

Spans that correspond to individual LLM calls (`ai.generateText.doGenerate`, `ai.streamText.doStream`) contain
[basic LLM span information](#basic-llm-span-information) and the following attributes:

* `ai.response.model`: the model that was used to generate the response. This can be different from the model that was requested if the provider supports aliases.
* `ai.response.id`: the id of the response. Uses the ID from the provider when available.
* `ai.response.timestamp`: the timestamp of the response. Uses the timestamp from the provider when available.
* [Semantic Conventions for GenAI operations](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)
  + `gen_ai.system`: the provider that was used
  + `gen_ai.request.model`: the model that was requested
  + `gen_ai.request.temperature`: the temperature that was set
  + `gen_ai.request.max_tokens`: the maximum number of tokens that were set
  + `gen_ai.request.frequency_penalty`: the frequency penalty that was set
  + `gen_ai.request.presence_penalty`: the presence penalty that was set
  + `gen_ai.request.top_k`: the topK parameter value that was set
  + `gen_ai.request.top_p`: the topP parameter value that was set
  + `gen_ai.request.stop_sequences`: the stop sequences
  + `gen_ai.response.finish_reasons`: the finish reasons that were returned by the provider
  + `gen_ai.response.model`: the model that was used to generate the response. This can be different from the model that was requested if the provider supports aliases.
  + `gen_ai.response.id`: the id of the response. Uses the ID from the provider when available.
  + `gen_ai.usage.input_tokens`: the number of prompt tokens that were used
  + `gen_ai.usage.output_tokens`: the number of completion tokens that were used

##### [Basic embedding span information](#basic-embedding-span-information)

Many spans that use embedding models (`ai.embed`, `ai.embed.doEmbed`, `ai.embedMany`, `ai.embedMany.doEmbed`) contain the following attributes:

* `ai.model.id`: the id of the model
* `ai.model.provider`: the provider of the model
* `ai.request.headers.*`: the request headers that were passed in through `headers`
* `ai.settings.maxRetries`: the maximum number of retries that were set
* `ai.telemetry.functionId`: the functionId that was set through `telemetry.functionId`
* `ai.settings.runtimeContext.*`: the runtime context that was passed in through the `runtimeContext` option
* `ai.usage.tokens`: the number of tokens that were used
* `resource.name`: the functionId that was set through `telemetry.functionId`

##### [Legacy tool call spans](#legacy-tool-call-spans)

Tool call spans (`ai.toolCall`) contain the following attributes:

* `operation.name`: `"ai.toolCall"`
* `ai.operationId`: `"ai.toolCall"`
* `ai.toolCall.name`: the name of the tool
* `ai.toolCall.id`: the id of the tool call
* `ai.toolCall.args`: the input parameters of the tool call
* `ai.toolCall.result`: the output result of the tool call. Only available if the tool call is successful and the result is serializable.

[Previous

Testing](/docs/ai-sdk-core/testing)[Next

DevTools](/docs/ai-sdk-core/devtools)
