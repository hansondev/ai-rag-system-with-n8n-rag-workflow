---
title: "extractReasoningMiddleware()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/extract-reasoning-middleware
section: reference
crawled: 2026-09-20
---

# extractReasoningMiddleware()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/extract-reasoning-middleware

[AI SDK Core](/docs/ai-sdk-core)extractReasoningMiddleware


[`extractReasoningMiddleware()`](#extractreasoningmiddleware)
=============================================================

`extractReasoningMiddleware` is a middleware function that extracts XML-tagged reasoning sections from generated text and exposes them separately from the main text content. This is particularly useful when you want to separate an AI model's reasoning process from its final output.

```
1

import { extractReasoningMiddleware } from 'ai';



2



3

const middleware = extractReasoningMiddleware({



4

tagName: 'reasoning',



5

separator: '\n',



6

});
```

[Import](#import)
-----------------

```
import { extractReasoningMiddleware } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### tagName:

string

### separator?:

string

### startWithReasoning?:

boolean

### [Returns](#returns)

Returns a middleware object that:

* Processes both streaming and non-streaming responses
* Extracts content between specified XML tags as reasoning
* Removes the XML tags and reasoning from the main text
* Adds a `reasoning` property to the result containing the extracted content
* Maintains proper separation between text sections using the specified separator

### [Type Parameters](#type-parameters)

The middleware works with the `LanguageModelV4StreamPart` type for streaming responses.

[Previous

LanguageModelV4Middleware](/docs/reference/ai-sdk-core/language-model-v2-middleware)[Next

simulateStreamingMiddleware](/docs/reference/ai-sdk-core/simulate-streaming-middleware)
