---
title: "experimental_getBatchResults()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/get-batch-results
section: reference
crawled: 2026-09-20
---

# experimental_getBatchResults()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/get-batch-results

[AI SDK Core](/docs/ai-sdk-core)experimental\_getBatchResults


[`experimental_getBatchResults()`](#experimental_getbatchresults)
=================================================================

Batch support is experimental and the API may change in patch releases.

Returns an async iterable of terminal results for the requests in an
asynchronous batch. For a complete guide to the batch lifecycle, see
[Batch](/docs/ai-sdk-core/batch).

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { experimental_getBatchResults as getBatchResults } from 'ai';



3



4

for await (const item of getBatchResults({ provider: anthropic, batch })) {



5

if (item.status === 'succeeded') {



6

console.log(item.id, item.text);



7

} else {



8

console.error(item.id, item.error);



9

}



10

}
```

[Import](#import)
-----------------

```
import { experimental_getBatchResults } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### provider?:

Experimental\_BatchProvider

### batch:

Experimental\_BatchReference

### tools?:

ToolSet

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

An `AsyncIterableStream<Experimental_BatchItemResult>` of succeeded,
failed, cancelled, or expired request results. You can consume the stream as
either an async iterable or a `ReadableStream`.

Successful items contain `id`, `status: 'succeeded'`, `text`, normalized
`content` (including text, reasoning, sources, files, tool calls, and tool
results),
`finishReason`, `usage`, and optional response and provider metadata. `text` is
the concatenation of text parts and can be an empty string when a result
contains no text parts.
Failed, cancelled, and expired items contain the request `id`, their terminal
status, and optional error details.

[Previous

dynamicTool](/docs/reference/ai-sdk-core/dynamic-tool)[Next

experimental\_cancelBatch](/docs/reference/ai-sdk-core/cancel-batch)
