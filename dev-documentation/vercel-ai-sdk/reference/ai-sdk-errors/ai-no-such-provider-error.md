---
title: "AI_NoSuchProviderError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-provider-error
section: reference
crawled: 2026-09-20
---

# AI_NoSuchProviderError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-provider-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoSuchProviderError


[AI\_NoSuchProviderError](#ai_nosuchprovidererror)
==================================================

This error occurs when a provider ID is not found.

[Properties](#properties)
-------------------------

* `providerId`: The ID of the provider that was not found
* `availableProviders`: Array of available provider IDs
* `modelId`: The ID of the model
* `modelType`: The type of model
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoSuchProviderError` using:

```
1

import { NoSuchProviderError } from 'ai';



2



3

if (NoSuchProviderError.isInstance(error)) {



4

// Handle the error



5

}
```

Experimental evaluation resolution uses `modelType: 'evaluationModel'`. This
includes unavailable evaluation capabilities and unknown evaluation model or
provider IDs. See [Evaluation](/docs/ai-sdk-core/evaluation#default-provider-strings).

[Previous

AI\_NoSuchModelError](/docs/reference/ai-sdk-errors/ai-no-such-model-error)[Next

AI\_NoSuchProviderReferenceError](/docs/reference/ai-sdk-errors/ai-no-such-provider-reference-error)
