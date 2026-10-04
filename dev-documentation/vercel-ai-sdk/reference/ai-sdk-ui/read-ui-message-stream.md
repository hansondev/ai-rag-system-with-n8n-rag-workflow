---
title: "readUIMessageStream"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/read-ui-message-stream
section: reference
crawled: 2026-09-20
---

# readUIMessageStream

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/read-ui-message-stream

[AI SDK UI](/docs/ai-sdk-ui)readUIMessageStream


[readUIMessageStream](#readuimessagestream)
===========================================

Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s.

UI message streams are useful outside of Chat use cases, e.g. for terminal UIs, custom stream consumption on the client, or RSC (React Server Components).

[Import](#import)
-----------------

```
1

import { readUIMessageStream } from 'ai';
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### message?:

UIMessage

### stream:

ReadableStream<UIMessageChunk>

### onError?:

(error: unknown) => void

### terminateOnError?:

boolean

### [Returns](#returns)

An `AsyncIterableStream` of `UIMessage`s. Each stream part represents a different state of the same message as it is being completed.

For comprehensive examples and use cases, see [Reading UI Message Streams](/docs/ai-sdk-ui/reading-ui-message-streams).

[Previous

pipeUIMessageStreamToResponse](/docs/reference/ai-sdk-ui/pipe-ui-message-stream-to-response)[Next

InferUITools](/docs/reference/ai-sdk-ui/infer-ui-tools)
