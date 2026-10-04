---
title: "AI_RetryError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-retry-error
section: reference
crawled: 2026-09-20
---

# AI_RetryError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-retry-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_RetryError


[AI\_RetryError](#ai_retryerror)
================================

This error occurs when a retry operation fails.

[Properties](#properties)
-------------------------

* `reason`: The reason for the retry failure
* `lastError`: The most recent error that occurred during retries
* `errors`: Array of all errors that occurred during retry attempts
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_RetryError` using:

```
1

import { RetryError } from 'ai';



2



3

if (RetryError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoVideoGeneratedError](/docs/reference/ai-sdk-errors/ai-no-video-generated-error)[Next

AI\_StreamProviderError](/docs/reference/ai-sdk-errors/ai-stream-provider-error)
