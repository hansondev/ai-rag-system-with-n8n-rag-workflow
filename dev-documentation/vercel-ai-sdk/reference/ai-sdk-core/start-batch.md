---
title: "experimental_startBatch()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/start-batch
section: reference
crawled: 2026-09-20
---

# experimental_startBatch()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/start-batch

[AI SDK Core](/docs/ai-sdk-core)experimental\_startBatch


[`experimental_startBatch()`](#experimental_startbatch)
=======================================================

Batch support is experimental and the API may change in patch releases.

Starts an asynchronous batch of text or image generation requests. For a complete guide to the batch lifecycle, see
[Batch](/docs/ai-sdk-core/batch).

```
1

import { experimental_startBatch as startBatch } from 'ai';



2



3

const batch = await startBatch({



4

requests: [



5

{



6

id: 'france',



7

type: 'text',



8

model: 'gpt-4.1-nano',



9

prompt: 'What is the capital of France?',



10

},



11

],



12

});
```

[Import](#import)
-----------------

```
import { experimental_startBatch } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### provider?:

Experimental\_BatchProvider

### requests:

Array<Experimental\_BatchRequest>

### providerOptions?:

ProviderOptions

### webhookUrl?:

string

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number }

### headers?:

Record<string, string | undefined>

### [Returns](#returns)

### version:

2

### id:

string

### provider:

string

### status:

'pending' | 'completed' | 'failed'

### rawStatus?:

string

### requestCounts?:

{ total: number; pending: number; completed: number; failed: number }

### error?:

Experimental\_BatchError

### createdAt?:

string

### expiresAt?:

string

### providerMetadata?:

ProviderMetadata

### warnings:

Warning[]

[Previous

pipeAgentUIStreamToResponse](/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response)[Next

tool](/docs/reference/ai-sdk-core/tool)
