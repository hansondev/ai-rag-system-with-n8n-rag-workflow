---
title: "experimental_getBatchStatus()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/get-batch-status
section: reference
crawled: 2026-09-20
---

# experimental_getBatchStatus()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/get-batch-status

[AI SDK Core](/docs/ai-sdk-core)experimental\_getBatchStatus


[`experimental_getBatchStatus()`](#experimental_getbatchstatus)
===============================================================

Batch support is experimental and the API may change in patch releases.

Retrieves the latest status of an asynchronous batch. For a complete guide to
the batch lifecycle, see [Batch](/docs/ai-sdk-core/batch).

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { experimental_getBatchStatus as getBatchStatus } from 'ai';



3



4

const status = await getBatchStatus({



5

provider: anthropic,



6

batch,



7

});



8



9

console.log(status.status, status.requestCounts);
```

[Import](#import)
-----------------

```
import { experimental_getBatchStatus } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### provider?:

Experimental\_BatchProvider

### batch:

Experimental\_BatchReference

### providerOptions?:

ProviderOptions

### maxRetries?:

number

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number }

### headers?:

Record<string, string | undefined>

### [Returns](#returns)

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

[Previous

tool](/docs/reference/ai-sdk-core/tool)[Next

dynamicTool](/docs/reference/ai-sdk-core/dynamic-tool)
