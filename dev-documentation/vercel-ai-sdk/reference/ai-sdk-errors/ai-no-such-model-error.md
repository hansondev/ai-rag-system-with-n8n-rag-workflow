---
title: "AI_NoSuchModelError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-model-error
section: reference
crawled: 2026-09-20
---

# AI_NoSuchModelError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-model-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoSuchModelError


[AI\_NoSuchModelError](#ai_nosuchmodelerror)
============================================

This error occurs when a model ID is not found.

[Properties](#properties)
-------------------------

* `modelId`: The ID of the model that was not found
* `modelType`: The type of model (`'languageModel'`, `'embeddingModel'`, `'imageModel'`, `'transcriptionModel'`, `'speechModel'`, or `'rerankingModel'`)
* `message`: The error message (optional, auto-generated from `modelId` and `modelType`)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoSuchModelError` using:

```
1

import { NoSuchModelError } from 'ai';



2



3

if (NoSuchModelError.isInstance(error)) {



4

// Handle the error



5

}
```

Experimental evaluation resolution uses `modelType: 'evaluationModel'`. This
includes unavailable evaluation capabilities and unknown evaluation model or
provider IDs. See [Evaluation](/docs/ai-sdk-core/evaluation#default-provider-strings).

[Previous

AI\_NoSpeechGeneratedError](/docs/reference/ai-sdk-errors/ai-no-speech-generated-error)[Next

AI\_NoSuchProviderError](/docs/reference/ai-sdk-errors/ai-no-such-provider-error)
