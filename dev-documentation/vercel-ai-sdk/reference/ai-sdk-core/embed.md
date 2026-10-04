---
title: "embed()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/embed
section: reference
crawled: 2026-09-20
---

# embed()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/embed

[AI SDK Core](/docs/ai-sdk-core)embed


[`embed()`](#embed)
===================

Generate an embedding for a single value using an embedding model.

This is ideal for use cases where you need to embed a single value to e.g. retrieve similar items or to use the embedding in a downstream task.

```
1

import { embed } from 'ai';



2



3

const { embedding } = await embed({



4

model: 'openai/text-embedding-3-small',



5

value: 'sunny day at the beach',



6

});
```

[Import](#import)
-----------------

```
import { embed } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

EmbeddingModel

### value:

VALUE

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### providerOptions?:

ProviderOptions

### runtimeContext?:

RUNTIME\_CONTEXT

### telemetry?:

TelemetryOptions<RUNTIME\_CONTEXT>

TelemetryOptions

### isEnabled?:

boolean

### recordInputs?:

boolean

### recordOutputs?:

boolean

### functionId?:

string

### includeRuntimeContext?:

{ [KEY in keyof RUNTIME\_CONTEXT]?: boolean }

### integrations?:

Telemetry | Telemetry[]

### onStart?:

(event: EmbedStartEvent<RUNTIME\_CONTEXT>) => PromiseLike<void> | void

EmbedStartEvent<RUNTIME\_CONTEXT>

### runtimeContext:

RUNTIME\_CONTEXT

### callId:

string

### operationId:

string

### model:

{ provider: string; modelId: string }

### value:

string | Array<string>

### maxRetries:

number

### abortSignal:

AbortSignal | undefined

### headers:

Record<string, string | undefined> | undefined

### providerOptions:

ProviderOptions | undefined

### onEnd?:

(event: EmbedEndEvent<RUNTIME\_CONTEXT>) => PromiseLike<void> | void

EmbedEndEvent<RUNTIME\_CONTEXT>

### runtimeContext:

RUNTIME\_CONTEXT

### callId:

string

### operationId:

string

### model:

{ provider: string; modelId: string }

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

{ headers?: Record<string, string>; body?: unknown } | undefined

### [Returns](#returns)

### value:

VALUE

### embedding:

number[]

### usage:

EmbeddingModelUsage

EmbeddingModelUsage

### tokens:

number

### warnings:

Warning[]

### response?:

Response

Response

### headers?:

Record<string, string>

### body?:

unknown

### providerMetadata?:

ProviderMetadata | undefined

[Previous

streamText](/docs/reference/ai-sdk-core/stream-text)[Next

embedMany](/docs/reference/ai-sdk-core/embed-many)
