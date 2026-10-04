---
title: "AI_TooManyEmbeddingValuesForCallError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-too-many-embedding-values-for-call-error
section: reference
crawled: 2026-09-20
---

# AI_TooManyEmbeddingValuesForCallError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-too-many-embedding-values-for-call-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_TooManyEmbeddingValuesForCallError


[AI\_TooManyEmbeddingValuesForCallError](#ai_toomanyembeddingvaluesforcallerror)
================================================================================

This error occurs when too many values are provided in a single embedding call.

[Properties](#properties)
-------------------------

* `provider`: The AI provider name
* `modelId`: The ID of the embedding model
* `maxEmbeddingsPerCall`: The maximum number of embeddings allowed per call
* `values`: The array of values that was provided

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_TooManyEmbeddingValuesForCallError` using:

```
1

import { TooManyEmbeddingValuesForCallError } from 'ai';



2



3

if (TooManyEmbeddingValuesForCallError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_StreamProviderError](/docs/reference/ai-sdk-errors/ai-stream-provider-error)[Next

AI\_ToolCallNotFoundForApprovalError](/docs/reference/ai-sdk-errors/ai-tool-call-not-found-for-approval-error)
