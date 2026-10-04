---
title: "AI_UIMessageStreamError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-ui-message-stream-error
section: reference
crawled: 2026-09-20
---

# AI_UIMessageStreamError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-ui-message-stream-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_UIMessageStreamError


[AI\_UIMessageStreamError](#ai_uimessagestreamerror)
====================================================

This error occurs when a UI message stream reports an error or contains invalid
or out-of-sequence chunks.

Common causes:

* Receiving an `error` chunk in a completion data stream
* Receiving a `text-delta` chunk without a preceding `text-start` chunk
* Receiving a `text-end` chunk without a preceding `text-start` chunk
* Receiving a `reasoning-delta` chunk without a preceding `reasoning-start` chunk
* Receiving a `reasoning-end` chunk without a preceding `reasoning-start` chunk
* Receiving a `tool-input-delta` chunk without a preceding `tool-input-start` chunk
* Attempting to access a tool invocation that doesn't exist

This error often surfaces when an upstream request fails **before any tokens are streamed** and a custom transport tries to write an inline error message to the UI stream without the proper start chunk.

[Properties](#properties)
-------------------------

* `chunkType`: The type of chunk that caused the error (e.g., `text-delta`, `reasoning-end`, `tool-input-delta`)
* `chunkId`: The ID associated with the failing chunk (part ID or toolCallId).
  This is an empty string for chunks, such as completion `error` chunks, that do
  not have an ID.
* `message`: The error message with details about what went wrong

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_UIMessageStreamError` using:

```
1

import { UIMessageStreamError } from 'ai';



2



3

if (UIMessageStreamError.isInstance(error)) {



4

console.log('Chunk type:', error.chunkType);



5

console.log('Chunk ID:', error.chunkId);



6

// Handle the error



7

}
```

[Common Solutions](#common-solutions)
-------------------------------------

1. **Ensure proper chunk ordering**: Always send a `*-start` chunk before any `*-delta` or `*-end` chunks for the same ID:

   ```
   1

   // Correct order



   2

   writer.write({ type: 'text-start', id: 'my-text' });



   3

   writer.write({ type: 'text-delta', id: 'my-text', delta: 'Hello' });



   4

   writer.write({ type: 'text-end', id: 'my-text' });
   ```
2. **Verify IDs match**: Ensure the `id` used in `*-delta` and `*-end` chunks matches the `id` used in the corresponding `*-start` chunk.
3. **Handle error paths correctly**: When writing error messages in custom transports, ensure you emit the full start/delta/end sequence:

   ```
   1

   // When handling errors in custom transports



   2

   writer.write({ type: 'text-start', id: errorId });



   3

   writer.write({



   4

   type: 'text-delta',



   5

   id: errorId,



   6

   delta: 'Request failed...',



   7

   });



   8

   writer.write({ type: 'text-end', id: errorId });
   ```
4. **Check stream producer logic**: Review your streaming implementation to ensure chunks are sent in the correct order, especially when dealing with concurrent operations or merged streams.

[Previous

AI\_TypeValidationError](/docs/reference/ai-sdk-errors/ai-type-validation-error)[Next

AI\_UnsupportedFunctionalityError](/docs/reference/ai-sdk-errors/ai-unsupported-functionality-error)
