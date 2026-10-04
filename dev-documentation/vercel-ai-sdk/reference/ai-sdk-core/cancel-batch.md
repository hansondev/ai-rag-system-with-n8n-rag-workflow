---
title: "experimental_cancelBatch()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/cancel-batch
section: reference
crawled: 2026-09-20
---

# experimental_cancelBatch()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/cancel-batch

[AI SDK Core](/docs/ai-sdk-core)experimental\_cancelBatch


[`experimental_cancelBatch()`](#experimental_cancelbatch)
=========================================================

Batch support is experimental and the API may change in patch releases.

Requests cancellation of an asynchronous batch. A successful call means that
the provider accepted the cancellation request, not that cancellation has
finished. For a complete guide to the batch lifecycle, see
[Batch](/docs/ai-sdk-core/batch).

```
1

import { experimental_cancelBatch as cancelBatch } from 'ai';



2



3

const result = await cancelBatch({



4

provider,



5

batch,



6

});



7



8

console.log(result.providerMetadata);
```

[Import](#import)
-----------------

```
import { experimental_cancelBatch } from "ai"
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

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number }

### headers?:

Record<string, string | undefined>

### [Returns](#returns)

### providerMetadata?:

ProviderMetadata

Calling this function with a provider that does not support batch cancellation
throws an `UnsupportedFunctionalityError`.

[Previous

experimental\_getBatchResults](/docs/reference/ai-sdk-core/get-batch-results)[Next

createMCPClient](/docs/reference/ai-sdk-core/create-mcp-client)
