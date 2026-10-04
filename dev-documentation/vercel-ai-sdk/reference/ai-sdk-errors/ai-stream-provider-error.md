---
title: "AI_StreamProviderError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-stream-provider-error
section: reference
crawled: 2026-09-20
---

# AI_StreamProviderError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-stream-provider-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_StreamProviderError


[AI\_StreamProviderError](#ai_streamprovidererror)
==================================================

This error represents a well-formed error event reported by a provider after a
model response stream has started. The AI SDK exposes it in streaming error
parts and callbacks such as the `streamText` `onError` callback.

[Properties](#properties)
-------------------------

* `message`: The provider error message
* `type`: The provider-defined error type (optional)
* `code`: The provider-defined error code as a string or number (optional)
* `statusCode`: The HTTP-equivalent status code when supplied by or inferable from provider metadata (optional)
* `isRetryable`: Whether retrying the model call may succeed
* `data`: The original provider error payload (optional)
* `cause`: The underlying error that caused the failure (optional)

`isRetryable` is a retry classification, not an automatic retry. A stream may
already contain partial output, so applications should decide whether to
discard, replace, or preserve that output before starting another model call.

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

Use `StreamProviderError.isInstance` so identification also works when multiple
AI SDK versions are present:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { StreamProviderError, streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Write a vegetarian lasagna recipe for 4 people.',



6

onError: ({ error }) => {



7

if (StreamProviderError.isInstance(error) && error.isRetryable) {



8

// Schedule an application-managed retry.



9

}



10

},



11

});
```

Providers may not include enough metadata to determine a status code. In that
case, `statusCode` is `undefined`, and retryability is classified
conservatively. Provider-specific status and retry mappings are supplied by the
provider adapter rather than inferred from arbitrary provider error type or code
substrings. Provider `type` and `code` values are preserved independently, even
when a numeric code is also used to determine `statusCode`. Errors that are
already `Error` instances and malformed or unknown provider values are
preserved unchanged.

[Previous

AI\_RetryError](/docs/reference/ai-sdk-errors/ai-retry-error)[Next

AI\_TooManyEmbeddingValuesForCallError](/docs/reference/ai-sdk-errors/ai-too-many-embedding-values-for-call-error)
