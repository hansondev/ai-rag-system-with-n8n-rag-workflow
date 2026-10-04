---
title: "experimental_listBatches()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/list-batches
section: reference
crawled: 2026-09-20
---

# experimental_listBatches()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/list-batches

[AI SDK Core](/docs/ai-sdk-core)experimental\_listBatches


[`experimental_listBatches()`](#experimental_listbatches)
=========================================================

Batch support is experimental and the API may change in patch releases.

Lists a page of asynchronous batches and their latest normalized statuses. For
a complete guide to the batch lifecycle, see [Batch](/docs/ai-sdk-core/batch).

```
1

import { experimental_listBatches as listBatches } from 'ai';



2



3

const page = await listBatches({



4

provider,



5

limit: 20,



6

cursor,



7

});



8



9

console.log(page.batches, page.nextCursor);
```

[Import](#import)
-----------------

```
import { experimental_listBatches } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### provider?:

Experimental\_BatchProvider

### limit?:

number

### cursor?:

string

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

### batches:

Array<Experimental\_Batch>

### nextCursor?:

string

### providerMetadata?:

ProviderMetadata

Calling this function with a provider that does not support listing batches
throws an `UnsupportedFunctionalityError`.

[Previous

toolSearch](/docs/reference/ai-sdk-core/tool-search)[Next

MCP Apps](/docs/reference/ai-sdk-core/mcp-apps)
