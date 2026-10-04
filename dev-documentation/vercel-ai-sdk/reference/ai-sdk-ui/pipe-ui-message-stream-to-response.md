---
title: "pipeUIMessageStreamToResponse"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/pipe-ui-message-stream-to-response
section: reference
crawled: 2026-09-20
---

# pipeUIMessageStreamToResponse

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/pipe-ui-message-stream-to-response

[AI SDK UI](/docs/ai-sdk-ui)pipeUIMessageStreamToResponse


[`pipeUIMessageStreamToResponse`](#pipeuimessagestreamtoresponse)
=================================================================

The `pipeUIMessageStreamToResponse` function pipes streaming data to a Node.js ServerResponse object (see [Streaming Data](/docs/ai-sdk-ui/streaming-data)).

[Import](#import)
-----------------

```
import { pipeUIMessageStreamToResponse } from "ai"
```

[Example](#example)
-------------------

```
1

await pipeUIMessageStreamToResponse({



2

response: serverResponse,



3

status: 200,



4

statusText: 'OK',



5

headers: {



6

'Custom-Header': 'value',



7

},



8

stream: myUIMessageStream,



9

consumeSseStream: ({ stream }) => {



10

// Optional: consume the SSE stream independently



11

console.log('Consuming SSE stream:', stream);



12

},



13

});
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### response:

ServerResponse

### stream:

ReadableStream<UIMessageChunk>

### status?:

number

### statusText?:

string

### headers?:

Headers | Record<string, string>

### consumeSseStream?:

({ stream }: { stream: ReadableStream<string> }) => PromiseLike<void> | void

### [Returns](#returns)

A `Promise<void>` that resolves when the stream has been written to the response
and rejects when reading or writing the stream fails.

[Previous

createUIMessageStreamResponse](/docs/reference/ai-sdk-ui/create-ui-message-stream-response)[Next

readUIMessageStream](/docs/reference/ai-sdk-ui/read-ui-message-stream)
