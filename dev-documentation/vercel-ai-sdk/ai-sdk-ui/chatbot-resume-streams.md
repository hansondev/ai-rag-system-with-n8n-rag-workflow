---
title: "Chatbot Resume Streams"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-resume-streams
section: ai-sdk-ui
crawled: 2026-09-20
---

# Chatbot Resume Streams

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-resume-streams

[AI SDK UI](/docs/ai-sdk-ui)Chatbot Resume Streams


[Chatbot Resume Streams](#chatbot-resume-streams)
=================================================

`useChat` supports resuming ongoing streams after page reloads. Use this feature to build applications with long-running generations.

In a resumable stream setup, client-side aborts are treated as disconnects.
Closing a tab, refreshing the page, or calling `stop()` only closes the
current HTTP connection and should not cancel the underlying generation. To
let users stop generation, add a dedicated stop endpoint that persists the
partial response, cancels the active work, and clears the active stream. See
[Stop an Active Resumable Stream](#stop-an-active-resumable-stream) and
[troubleshooting](/docs/troubleshooting/abort-breaks-resumable-streams) for
more details.

[How stream resumption works](#how-stream-resumption-works)
-----------------------------------------------------------

Stream resumption requires persistence for messages and active streams in your application. The AI SDK provides tools to connect to storage, but you need to set up the storage yourself.

**The AI SDK provides:**

* A `resume` option in `useChat` that automatically reconnects to active streams
* Access to the outgoing stream through the `consumeSseStream` callback
* Automatic HTTP requests to your resume endpoints

**You build:**

* Storage to track which stream belongs to each chat
* Redis to store the UIMessage stream
* Two API endpoints: POST to create streams, GET to resume them
* Integration with [`resumable-stream`](https://www.npmjs.com/package/resumable-stream) to manage Redis storage

[Prerequisites](#prerequisites)
-------------------------------

To implement resumable streams in your chat application, you need:

1. **The `resumable-stream` package** - Handles the publisher/subscriber mechanism for streams
2. **A Redis instance** - Stores stream data (e.g. [Redis through Vercel](https://vercel.com/marketplace/redis))
3. **A persistence layer** - Tracks which stream ID is active for each chat (e.g. database)

[Implementation](#implementation)
---------------------------------

### [1. Client-side: Enable stream resumption](#1-client-side-enable-stream-resumption)

Use the `resume` option in the `useChat` hook to enable stream resumption. When `resume` is true, the hook automatically attempts to reconnect to any active stream for the chat on mount:

app/chat/[chatId]/chat.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { DefaultChatTransport, type UIMessage } from 'ai';



5



6

export function Chat({



7

chatData,



8

resume = false,



9

}: {



10

chatData: { id: string; messages: UIMessage[] };



11

resume?: boolean;



12

}) {



13

const { messages, sendMessage, status } = useChat({



14

id: chatData.id,



15

messages: chatData.messages,



16

resume, // Enable automatic stream resumption



17

transport: new DefaultChatTransport({



18

// You must send the id of the chat



19

prepareSendMessagesRequest: ({ id, messages }) => {



20

return {



21

body: {



22

id,



23

message: messages[messages.length - 1],



24

},



25

};



26

},



27

}),



28

});



29



30

return <div>{/* Your chat UI */}</div>;



31

}
```

You must send the chat ID with each request (see
`prepareSendMessagesRequest`).

When you enable `resume`, the `useChat` hook makes a `GET` request to `/api/chat/[id]/stream` on mount to check for and resume any active streams.

Let's start by creating the POST handler to create the resumable stream.

### [2. Create the POST handler](#2-create-the-post-handler)

The POST handler creates resumable streams using the `consumeSseStream` callback:

app/api/chat/route.ts

```
1

import { openai } from '@ai-sdk/openai';



2

import { readChat, saveChat } from '@util/chat-store';



3

import {



4

convertToModelMessages,



5

createUIMessageStreamResponse,



6

generateId,



7

streamText,



8

toUIMessageStream,



9

type UIMessage,



10

} from 'ai';



11

import { after } from 'next/server';



12

import { createResumableStreamContext } from 'resumable-stream';



13



14

export async function POST(req: Request) {



15

const {



16

message,



17

id,



18

}: {



19

message: UIMessage | undefined;



20

id: string;



21

} = await req.json();



22



23

const chat = await readChat(id);



24

let messages = chat.messages;



25



26

messages = [...messages, message!];



27



28

// Clear any previous active stream and save the user message



29

saveChat({ id, messages, activeStreamId: null });



30



31

const result = streamText({



32

model: 'openai/gpt-5-mini',



33

messages: await convertToModelMessages(messages),



34

});



35



36

return createUIMessageStreamResponse({



37

stream: toUIMessageStream({



38

stream: result.stream,



39

originalMessages: messages,



40

generateMessageId: generateId,



41

onEnd: ({ messages }) => {



42

// Clear the active stream when finished



43

saveChat({ id, messages, activeStreamId: null });



44

},



45

}),



46

async consumeSseStream({ stream }) {



47

const streamId = generateId();



48



49

// Create a resumable stream from the SSE stream



50

const streamContext = createResumableStreamContext({ waitUntil: after });



51

await streamContext.createNewResumableStream(streamId, () => stream);



52



53

// Update the chat with the active stream ID



54

saveChat({ id, activeStreamId: streamId });



55

},



56

});



57

}
```

### [3. Implement the GET handler](#3-implement-the-get-handler)

Create a GET handler at `/api/chat/[id]/stream` that:

1. Reads the chat ID from the route params
2. Loads the chat data to check for an active stream
3. Returns 204 (No Content) if no stream is active
4. Resumes the existing stream if one is found

app/api/chat/[id]/stream/route.ts

```
1

import { readChat } from '@util/chat-store';



2

import { UI_MESSAGE_STREAM_HEADERS } from 'ai';



3

import { after } from 'next/server';



4

import { createResumableStreamContext } from 'resumable-stream';



5



6

export async function GET(



7

_: Request,



8

{ params }: { params: Promise<{ id: string }> },



9

) {



10

const { id } = await params;



11



12

const chat = await readChat(id);



13



14

if (chat.activeStreamId == null) {



15

// no content response when there is no active stream



16

return new Response(null, { status: 204 });



17

}



18



19

const streamContext = createResumableStreamContext({



20

waitUntil: after,



21

});



22



23

return new Response(



24

await streamContext.resumeExistingStream(chat.activeStreamId),



25

{ headers: UI_MESSAGE_STREAM_HEADERS },



26

);



27

}
```

The `after` function from Next.js allows work to continue after the response
has been sent. This ensures that the resumable stream persists in Redis even
after the initial response is returned to the client, enabling reconnection
later.

[How it works](#how-it-works)
-----------------------------

### [Request lifecycle](#request-lifecycle)

![Diagram showing the architecture and lifecycle of resumable stream requests](https://e742qlubrjnjqpp0.public.blob.vercel-storage.com/resume-stream-diagram.png)

The diagram above shows the complete lifecycle of a resumable stream:

1. **Stream creation**: When you send a new message, the POST handler uses `streamText` to generate the response. The `consumeSseStream` callback creates a resumable stream with a unique ID and stores it in Redis through the `resumable-stream` package
2. **Stream tracking**: Your persistence layer saves the `activeStreamId` in the chat data
3. **Client reconnection**: When the client reconnects (page reload), the `resume` option triggers a GET request to `/api/chat/[id]/stream`
4. **Stream recovery**: The GET handler checks for an `activeStreamId` and uses `resumeExistingStream` to reconnect. If no active stream exists, it returns a 204 (No Content) response
5. **Completion cleanup**: When the stream finishes, the `onFinish` callback clears the `activeStreamId` by setting it to `null`

[Customize the resume endpoint](#customize-the-resume-endpoint)
---------------------------------------------------------------

By default, the `useChat` hook makes a GET request to `/api/chat/[id]/stream` when resuming. Customize this endpoint, credentials, and headers, using the `prepareReconnectToStreamRequest` option in `DefaultChatTransport`:

app/chat/[chatId]/chat.tsx

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

export function Chat({ chatData, resume }) {



5

const { messages, sendMessage } = useChat({



6

id: chatData.id,



7

messages: chatData.messages,



8

resume,



9

transport: new DefaultChatTransport({



10

// Customize reconnect settings (optional)



11

prepareReconnectToStreamRequest: ({ id }) => {



12

return {



13

api: `/api/chat/${id}/stream`, // Default pattern



14

// Or use a different pattern:



15

// api: `/api/streams/${id}/resume`,



16

// api: `/api/resume-chat?id=${id}`,



17

credentials: 'include', // Include cookies/auth



18

headers: {



19

Authorization: 'Bearer token',



20

'X-Custom-Header': 'value',



21

},



22

};



23

},



24

}),



25

});



26



27

return <div>{/* Your chat UI */}</div>;



28

}
```

This lets you:

* Match your existing API route structure
* Add query parameters or custom paths
* Integrate with different backend architectures

[Stop an Active Resumable Stream](#stop-an-active-resumable-stream)
-------------------------------------------------------------------

`useChat` includes a `stop()` function that aborts the current client request. In a resumable stream setup, that abort is a disconnect signal, not a request to stop generation.

Stream resumption lets a client reconnect to an active stream after the original connection closes. To make that possible, the server keeps the stream running even when no client is actively consuming it. If the user refreshes the page, closes the tab, loses their connection, or navigates away, the client can reconnect later with `resumeStream()`.

Because of this, a client-side abort (e.g. closing the page or refreshing) only closes the current HTTP connection. It is not a request to cancel the underlying work. If your stop button only calls `stop()`, the model request, background job, workflow, or stream writer can continue running, and the client can reconnect to the same active stream.

To support an explicit stop button, create a dedicated stop endpoint. The endpoint should accept the current assistant message from the client, persist that partial response, cancel the work that is producing the stream, and clear the active stream record for the chat.

Stream resumption also needs your application to store a reference from the chat to the stream that can be resumed. This guide calls that reference `activeStreamId`. The resume endpoint uses it to find the stream to reconnect to. The stop endpoint uses the same value to find the work to cancel, and to avoid clearing a newer stream that may have started while the stop request was in flight.

### [Client-side: send the current assistant message](#client-side-send-the-current-assistant-message)

The chat setup is the same as the resumable stream setup above. To add stop behavior, send the latest partial assistant message to your stop endpoint before stopping the local chat stream.

When the client knows the active stream ID, include it in the request. This lets the server ignore stale stop requests that arrive after a newer stream has already started.

app/chat/[chatId]/chat.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { type UIMessage } from 'ai';



5



6

export function Chat({



7

chatData,



8

resume = false,



9

}: {



10

chatData: {



11

id: string;



12

messages: UIMessage[];



13

activeStreamId?: string | null;



14

};



15

resume?: boolean;



16

}) {



17

const chat = useChat({



18

id: chatData.id,



19

messages: chatData.messages,



20

resume,



21

});



22



23

const stop = () => {



24

const lastMessage = chat.messages[chat.messages.length - 1];



25

const assistantMessage =



26

lastMessage?.role === 'assistant' ? lastMessage : undefined;



27



28

void fetch(`/api/chat/${chatData.id}/stop`, {



29

method: 'POST',



30

headers: { 'Content-Type': 'application/json' },



31

body: JSON.stringify(



32

assistantMessage || chatData.activeStreamId



33

? {



34

assistantMessage,



35

activeStreamId: chatData.activeStreamId,



36

}



37

: {},



38

),



39

});



40



41

void chat.stop();



42

};



43



44

return <button onClick={stop}>Stop</button>;



45

}
```

The stop request tells your server to cancel the active work. `chat.stop()` stops the local client from reading more chunks.

### [Server-side: stop the active work and clear the stream](#server-side-stop-the-active-work-and-clear-the-stream)

The stop endpoint should:

1. Load the chat and read its `activeStreamId`
2. Persist the assistant snapshot if one was sent
3. Cancel the work that is producing the stream
4. Clear `activeStreamId` only if it still points to the same stream

app/api/chat/[id]/stop/route.ts

```
1

import { readChat, saveChat } from '@util/chat-store';



2

import { type UIMessage } from 'ai';



3



4

type StopRequest = {



5

activeStreamId?: string | null;



6

assistantMessage?: UIMessage;



7

};



8



9

export async function POST(



10

req: Request,



11

{ params }: { params: Promise<{ id: string }> },



12

) {



13

const { id } = await params;



14

const chat = await readChat(id);



15



16

if (chat.activeStreamId == null) {



17

return Response.json({ success: true });



18

}



19



20

const activeStreamId = chat.activeStreamId;



21

const body = (await req.json().catch(() => ({}))) as StopRequest;



22



23

if (body.activeStreamId != null && body.activeStreamId !== activeStreamId) {



24

return Response.json({ success: true });



25

}



26



27

if (body.assistantMessage) {



28

await saveAssistantSnapshot({



29

chatId: id,



30

message: body.assistantMessage,



31

});



32

}



33



34

await markStreamAsStopped(activeStreamId);



35

await cancelActiveWork(activeStreamId);



36



37

const latestChat = await readChat(id);



38

if (latestChat.activeStreamId === activeStreamId) {



39

await saveChat({ id, activeStreamId: null });



40

}



41



42

return Response.json({ success: true });



43

}
```

`markStreamAsStopped` and `cancelActiveWork` depend on your backend. In a Redis-backed resumable stream setup, you might close the stored stream and abort the model request that is writing to it. In a workflow setup, you might cancel the workflow run that owns the stream. In a job queue setup, you might cancel the job or write a cancellation flag that the job checks.

The `activeStreamId` can identify replay state, producer state, or both. If those are separate in your system, store enough information with the chat to cancel the producer that writes to the stream.

Persist the assistant snapshot as an insert or merge. Avoid overwriting a newer server-written message with an older client snapshot.

### [Keep navigation separate from stop](#keep-navigation-separate-from-stop)

Do not call the stop endpoint from route cleanup code. Route cleanup is a disconnect, not an explicit stop. The active stream should remain resumable when the user refreshes the page or navigates away.

Only call the stop endpoint for an explicit user action, such as pressing a stop button.

After a user stops a stream, avoid automatic reconnect attempts for that chat until the user sends another message or explicitly retries. Otherwise the client can reconnect before cancellation has finished.

[Important considerations](#important-considerations)
-----------------------------------------------------

* **Stream expiration**: Streams in Redis expire after a set time (configurable in the `resumable-stream` package)
* **Multiple clients**: Multiple clients can connect to the same stream simultaneously
* **Error handling**: When no active stream exists, the GET handler returns a 204 (No Content) status code
* **Security**: Ensure proper authentication and authorization for both creating and resuming streams
* **Race conditions**: Clear the `activeStreamId` when starting a new stream to prevent resuming outdated streams

  
[View Example on GitHub](https://github.com/vercel/ai/blob/main/examples/next)

[Previous

Chatbot Message Persistence](/docs/ai-sdk-ui/chatbot-message-persistence)[Next

Chatbot Tool Usage](/docs/ai-sdk-ui/chatbot-tool-usage)
