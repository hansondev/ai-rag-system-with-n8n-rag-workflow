---
title: "simulateStreamingMiddleware()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/simulate-streaming-middleware
section: reference
crawled: 2026-09-20
---

# simulateStreamingMiddleware()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/simulate-streaming-middleware

[AI SDK Core](/docs/ai-sdk-core)simulateStreamingMiddleware


[`simulateStreamingMiddleware()`](#simulatestreamingmiddleware)
===============================================================

`simulateStreamingMiddleware` is a middleware function that simulates streaming behavior with responses from non-streaming language models. This is useful when you want to maintain a consistent streaming interface even when using models that only provide complete responses.

```
1

import { simulateStreamingMiddleware } from 'ai';



2



3

const middleware = simulateStreamingMiddleware();
```

[Import](#import)
-----------------

```
import { simulateStreamingMiddleware } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

This middleware doesn't accept any parameters.

### [Returns](#returns)

Returns a middleware object that:

* Takes a complete response from a language model
* Converts it into a simulated stream of chunks
* Properly handles various response components including:
  + Text content
  + Reasoning (as string or array of objects)
  + Tool calls
  + Metadata and usage information
  + Warnings

### [Usage Example](#usage-example)

```
1

import { streamText } from 'ai';



2

import { wrapLanguageModel } from 'ai';



3

import { simulateStreamingMiddleware } from 'ai';



4



5

// Example with a non-streaming model



6

const result = streamText({



7

model: wrapLanguageModel({



8

model: nonStreamingModel,



9

middleware: simulateStreamingMiddleware(),



10

}),



11

prompt: 'Your prompt here',



12

});



13



14

// Now you can use the streaming interface



15

for await (const chunk of result.stream) {



16

// Process streaming chunks



17

}
```

[How It Works](#how-it-works)
-----------------------------

The middleware:

1. Awaits the complete response from the language model
2. Creates a `ReadableStream` that emits chunks in the correct sequence
3. Simulates streaming by breaking down the response into appropriate chunk types
4. Preserves all metadata, reasoning, tool calls, and other response properties

[Previous

extractReasoningMiddleware](/docs/reference/ai-sdk-core/extract-reasoning-middleware)[Next

defaultInstructionsMiddleware](/docs/reference/ai-sdk-core/default-instructions-middleware)
