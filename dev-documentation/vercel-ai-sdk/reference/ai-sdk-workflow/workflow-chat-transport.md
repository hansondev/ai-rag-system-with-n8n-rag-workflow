---
title: "WorkflowChatTransport"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-workflow/workflow-chat-transport
section: reference
crawled: 2026-09-20
---

# WorkflowChatTransport

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-workflow/workflow-chat-transport

[AI SDK Workflow](/docs/reference/ai-sdk-workflow)WorkflowChatTransport


[`WorkflowChatTransport`](#workflowchattransport)
=================================================

A [`ChatTransport`](/docs/ai-sdk-ui/transport) implementation for [`useChat`](/docs/reference/ai-sdk-ui/use-chat) that enables automatic stream reconnection for workflow-based chat apps. It posts messages to a chat endpoint, extracts the `x-workflow-run-id` response header, and reconnects to a `/{runId}/stream` endpoint on interruption (network failures, page refreshes, function timeouts).

Unlike [`DefaultChatTransport`](/docs/ai-sdk-ui/transport) which assumes the full response arrives in a single HTTP request, `WorkflowChatTransport` is designed for the [Workflow SDK](https://vercel.com/docs/workflow) where the initial response stream may be interrupted by function timeouts. The transport automatically detects missing `finish` events and reconnects to resume from where the stream left off.

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { WorkflowChatTransport } from '@ai-sdk/workflow/client';



5



6

export default function Chat() {



7

const { messages, sendMessage } = useChat({



8

transport: new WorkflowChatTransport({



9

api: '/api/chat',



10

maxConsecutiveErrors: 5,



11

}),



12

});



13



14

// ... render chat UI



15

}
```

[Import](#import)
-----------------

```
import { WorkflowChatTransport } from "@ai-sdk/workflow/client"
```

[Constructor](#constructor)
---------------------------

### [Parameters](#parameters)

### api?:

string

### fetch?:

typeof fetch

### maxConsecutiveErrors?:

number

### initialStartIndex?:

number

### onChatSendMessage?:

(response: Response, options: SendMessagesOptions) => void | Promise<void>

### onChatEnd?:

({ chatId, chunkIndex }) => void | Promise<void>

### prepareSendMessagesRequest?:

PrepareSendMessagesRequest

### prepareReconnectToStreamRequest?:

PrepareReconnectToStreamRequest

[Methods](#methods)
-------------------

### [`sendMessages()`](#sendmessages)

Sends messages to the chat endpoint via POST and returns a streaming response. If the stream is interrupted (no `finish` event received), the transport automatically reconnects via GET to `{api}/{runId}/stream?startIndex={chunkIndex}` to resume from where it left off.

The POST request includes the messages as JSON and expects the response to include an `x-workflow-run-id` header identifying the workflow run.

```
1

const stream = await transport.sendMessages({



2

chatId: 'chat-123',



3

trigger: 'submit-message',



4

messages: [...],



5

abortSignal: controller.signal,



6

});
```

### chatId:

string

### trigger:

'submit-message' | 'regenerate-message'

### messageId:

string | undefined

### messages:

UIMessage[]

### abortSignal:

AbortSignal | undefined

#### [Returns](#returns)

Returns a `Promise<ReadableStream<UIMessageChunk>>` that includes chunks from both the initial POST response and any automatic reconnection.

### [`reconnectToStream()`](#reconnecttostream)

Reconnects to an existing chat stream that was previously interrupted. Useful for resuming after a page refresh or when the client needs to re-establish a connection.

```
1

const stream = await transport.reconnectToStream({



2

chatId: 'chat-123',



3

startIndex: -50, // Optional: fetch last 50 chunks



4

});
```

### chatId:

string

### abortSignal:

AbortSignal | undefined

### startIndex?:

number

#### [Returns](#returns-1)

Returns a `Promise<ReadableStream<UIMessageChunk> | null>`.

[How Reconnection Works](#how-reconnection-works)
-------------------------------------------------

The transport follows this flow:

1. **POST** to `{api}` with messages. The response must include an `x-workflow-run-id` header.
2. **Stream** the SSE response, counting chunks as they arrive.
3. **Detect interruption**: If the stream closes without a `finish` event (e.g., function timeout, network error), the transport knows the response is incomplete.
4. **Reconnect** via GET to `{api}/{runId}/stream?startIndex={chunkIndex}` to resume from the last received chunk.
5. **Retry**: If the reconnection stream also interrupts, retry up to `maxConsecutiveErrors` times.
6. **Complete**: Once a `finish` event is received, call `onChatEnd` and close the stream.

### [Negative Start Index](#negative-start-index)

When `initialStartIndex` is negative (e.g., `-50`), the transport sends it as-is in the first reconnection request. The server should resolve this to an absolute position and return the `x-workflow-stream-tail-index` response header so the transport can compute the correct position for subsequent retries.

If the header is missing or invalid, the transport falls back to replaying from the beginning (`startIndex=0`).

Negative indexes require a durable server stream whose stored objects are
already `UIMessageChunk` objects. The raw `WorkflowAgent` conversion shown
below supports non-negative indexes only.

[Server Requirements](#server-requirements)
-------------------------------------------

For `WorkflowChatTransport` to work, your server must provide two endpoints:

### [POST `{api}` (e.g., `/api/chat`)](#post-api-eg-apichat)

* Accept messages as JSON body
* Return an SSE stream of `UIMessageChunk` events
* Include an `x-workflow-run-id` response header

### [GET `{api}/{runId}/stream` (e.g., `/api/chat/{runId}/stream`)](#get-apirunidstream-eg-apichatrunidstream)

* Accept a `startIndex` query parameter
* Return the SSE stream starting from the given chunk index
* For negative `startIndex`, resolve to the tail and include `x-workflow-stream-tail-index` response header

See the [WorkflowAgent guide](/docs/agents/workflow-agent) for complete endpoint examples.

[Examples](#examples)
---------------------

### [Basic Usage with useChat](#basic-usage-with-usechat)

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { WorkflowChatTransport } from '@ai-sdk/workflow/client';



5

import { useMemo } from 'react';



6



7

export default function Chat() {



8

const transport = useMemo(



9

() => new WorkflowChatTransport({ api: '/api/chat' }),



10

[],



11

);



12



13

const { messages, sendMessage, status } = useChat({ transport });



14



15

return (



16

<div>



17

{messages.map(message => (



18

<div key={message.id}>



19

{message.role === 'user' ? 'User: ' : 'AI: '}



20

{message.parts.map((part, index) =>



21

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



22

)}



23

</div>



24

))}



25

<button onClick={() => sendMessage({ text: 'Hello!' })}>Send</button>



26

</div>



27

);



28

}
```

### [With Callbacks](#with-callbacks)

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { WorkflowChatTransport } from '@ai-sdk/workflow/client';



5

import { useMemo } from 'react';



6



7

export default function Chat() {



8

const transport = useMemo(



9

() =>



10

new WorkflowChatTransport({



11

api: '/api/chat',



12

maxConsecutiveErrors: 5,



13

onChatSendMessage: response => {



14

const runId = response.headers.get('x-workflow-run-id');



15

console.log('Workflow run started:', runId);



16

},



17

onChatEnd: ({ chatId, chunkIndex }) => {



18

console.log(`Chat ${chatId} complete, ${chunkIndex} chunks`);



19

},



20

}),



21

[],



22

);



23



24

const { messages, sendMessage } = useChat({ transport });



25



26

// ... render chat UI



27

}
```

### [Server-Side Endpoints (Next.js)](#server-side-endpoints-nextjs)

app/api/chat/route.ts

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2

import { createUIMessageStreamResponse, type UIMessage } from 'ai';



3

import { start } from 'workflow/api';



4

import { chat } from '@/workflow/agent-chat';



5



6

export async function POST(request: Request) {



7

const { messages }: { messages: UIMessage[] } = await request.json();



8

const run = await start(chat, [messages]);



9



10

return createUIMessageStreamResponse({



11

stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),



12

headers: {



13

'x-workflow-run-id': run.runId,



14

},



15

});



16

}
```

app/api/chat/[runId]/stream/route.ts

```
1

import { createModelCallToUIChunkTransform } from '@ai-sdk/workflow';



2

import { createUIMessageStreamResponse } from 'ai';



3

import type { NextRequest } from 'next/server';



4

import { getRun } from 'workflow/api';



5



6

export async function GET(



7

request: NextRequest,



8

{ params }: { params: Promise<{ runId: string }> },



9

) {



10

const { runId } = await params;



11

const startIndex = Number(



12

new URL(request.url).searchParams.get('startIndex') ?? '0',



13

);



14

if (!Number.isSafeInteger(startIndex) || startIndex < 0) {



15

return Response.json(



16

{ error: 'startIndex must be a non-negative safe integer' },



17

{ status: 400 },



18

);



19

}



20



21

const run = await getRun(runId);



22

const readable = run



23

.getReadable({ startIndex: 0 })



24

.pipeThrough(



25

createModelCallToUIChunkTransform({ uiStartIndex: startIndex }),



26

);



27



28

return createUIMessageStreamResponse({



29

stream: readable,



30

headers: {



31

'x-workflow-run-id': runId,



32

},



33

});



34

}
```

This `WorkflowAgent` endpoint replays raw `ModelCallStreamPart` objects from
index `0`, then applies the transport's non-negative cursor after converting
them to `UIMessageChunk` objects. Negative start indexes require a durable
stream whose stored objects are already `UIMessageChunk` objects.

[Previous

WorkflowAgent](/docs/reference/ai-sdk-workflow/workflow-agent)[Next

generateVideo](/docs/reference/ai-sdk-workflow/generate-video)
