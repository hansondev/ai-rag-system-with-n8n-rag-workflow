---
title: "embedMany()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/embed-many
section: reference
crawled: 2026-09-20
---

# embedMany()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/embed-many

[AI SDK Core](/docs/ai-sdk-core)embedMany


[`embedMany()`](#embedmany)
===========================

Embed several values using an embedding model.

`embedMany` automatically splits large requests into smaller chunks when the
model has a limit on either the number of embeddings or the UTF-8 input bytes
that can be processed in a single call. Providers can use a conservative byte
budget to keep requests below aggregate token limits without adding a tokenizer
to the AI SDK core package. An individual value larger than the byte budget is
sent in its own call because splitting it would change the resulting embedding.

```
1

import { embedMany } from 'ai';



2



3

const { embeddings } = await embedMany({



4

model: 'openai/text-embedding-3-small',



5

values: [



6

'sunny day at the beach',



7

'rainy afternoon in the city',



8

'snowy night in the mountains',



9

],



10

});
```

[Import](#import)
-----------------

```
import { embedMany } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

EmbeddingModel

### values:

Array<string>

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### providerOptions?:

ProviderOptions

### maxParallelCalls?:

number

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

Array<{ headers?: Record<string, string>; body?: unknown } | undefined>

### [Returns](#returns)

### values:

Array<string>

### embeddings:

number[][]

### usage:

EmbeddingModelUsage

EmbeddingModelUsage

### tokens:

number

### warnings:

Warning[]

### providerMetadata?:

ProviderMetadata | undefined

### responses?:

Array<{ headers?: Record<string, string>; body?: unknown } | undefined>

[Previous

embed](/docs/reference/ai-sdk-core/embed)[Next

rerank](/docs/reference/ai-sdk-core/rerank)
