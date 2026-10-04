---
title: "AI_APICallError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-api-call-error
section: reference
crawled: 2026-09-20
---

# AI_APICallError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-api-call-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_APICallError


[AI\_APICallError](#ai_apicallerror)
====================================

This error occurs when an API call fails.

[Properties](#properties)
-------------------------

* `url`: The URL of the API request that failed
* `requestBodyValues`: The request body values sent to the API
* `statusCode`: The HTTP status code returned by the API (optional)
* `responseHeaders`: The response headers returned by the API (optional)
* `responseBody`: The response body returned by the API (optional)
* `isRetryable`: Whether the request can be retried based on the status code
* `data`: Any additional data associated with the error (optional)
* `cause`: The underlying error that caused the API call to fail (optional)

When this error is created for an AI SDK UI chat transport or completion
request, `requestBodyValues` is `undefined` so prompts and messages are not
copied into the client-facing error object.

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_APICallError` using:

```
1

import { APICallError } from 'ai';



2



3

if (APICallError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI SDK Errors](/docs/reference/ai-sdk-errors)[Next

AI\_DownloadError](/docs/reference/ai-sdk-errors/ai-download-error)
