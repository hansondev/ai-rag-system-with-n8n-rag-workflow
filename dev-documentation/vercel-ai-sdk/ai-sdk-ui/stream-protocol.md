---
title: "Stream Protocols"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol
section: ai-sdk-ui
crawled: 2026-09-20
---

# Stream Protocols

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol

[AI SDK UI](/docs/ai-sdk-ui)Stream Protocols


[Stream Protocols](#stream-protocols)
=====================================

AI SDK UI functions such as `useChat` and `useCompletion` support both text streams and data streams.
The stream protocol defines how the data is streamed to the frontend on top of the HTTP protocol.

This page describes both protocols and how to use them in the backend and frontend.

You can use this information to develop custom backends and frontends for your use case, e.g.,
to provide compatible API endpoints that are implemented in a different language such as Python.

For instance, here's an example using [FastAPI](https://github.com/vercel/ai/tree/main/examples/next-fastapi) as a backend.

[Text Stream Protocol](#text-stream-protocol)
---------------------------------------------

A text stream contains chunks in plain text, that are streamed to the frontend.
Each chunk is then appended together to form a full text response.

Text streams are supported by `useChat`, `useCompletion`, and `useObject`.
When you use `useChat` or `useCompletion`, you need to enable text streaming
by setting the `streamProtocol` options to `text`.

You can generate text streams with `streamText` in the backend.
Pass the result's `stream` to `toTextStream` and return it with
`createTextStreamResponse` to create a streaming HTTP response.

Text streams only support basic text data. If you need to stream other types
of data such as tool calls, use data streams.

### [Text Stream Example](#text-stream-example)

Here is a Next.js example that uses the text stream protocol:

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { TextStreamChatTransport } from 'ai';



5

import { useState } from 'react';



6



7

export default function Chat() {



8

const [input, setInput] = useState('');



9

const { messages, sendMessage } = useChat({



10

transport: new TextStreamChatTransport({ api: '/api/chat' }),



11

});



12



13

return (



14

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



15

{messages.map(message => (



16

<div key={message.id} className="whitespace-pre-wrap">



17

{message.role === 'user' ? 'User: ' : 'AI: '}



18

{message.parts.map((part, i) => {



19

switch (part.type) {



20

case 'text':



21

return <div key={`${message.id}-${i}`}>{part.text}</div>;



22

}



23

})}



24

</div>



25

))}



26



27

<form



28

onSubmit={e => {



29

e.preventDefault();



30

sendMessage({ text: input });



31

setInput('');



32

}}



33

>



34

<input



35

className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"



36

value={input}



37

placeholder="Say something..."



38

onChange={e => setInput(e.currentTarget.value)}



39

/>



40

</form>



41

</div>



42

);



43

}
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createTextStreamResponse,



4

streamText,



5

toTextStream,



6

UIMessage,



7

} from 'ai';



8



9

// Allow streaming responses up to 30 seconds



10

export const maxDuration = 30;



11



12

export async function POST(req: Request) {



13

const { messages }: { messages: UIMessage[] } = await req.json();



14



15

const result = streamText({



16

model: "xai/grok-4.6",



17

messages: await convertToModelMessages(messages),



18

});



19



20

return createTextStreamResponse({



21

stream: toTextStream({ stream: result.stream }),



22

});



23

}
```

[Data Stream Protocol](#data-stream-protocol)
---------------------------------------------

A data stream follows a special protocol that the AI SDK provides to send information to the frontend.

The data stream protocol uses Server-Sent Events (SSE) format for improved standardization, keep-alive through ping, reconnect capabilities, and better cache handling.

When you provide data streams from a custom backend, you need to set the
`x-vercel-ai-ui-message-stream` header to `v1`.

The following stream parts are currently supported:

### [Message Start Part](#message-start-part)

Indicates the beginning of a new message with metadata.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"start","messageId":"..."}
```

### [Text Parts](#text-parts)

Text content is streamed using a start/delta/end pattern with unique IDs for each text block.

#### [Text Start Part](#text-start-part)

Indicates the beginning of a text block.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"text-start","id":"msg_68679a454370819ca74c8eb3d04379630dd1afb72306ca5d"}
```

#### [Text Delta Part](#text-delta-part)

Contains incremental text content for the text block.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"text-delta","id":"msg_68679a454370819ca74c8eb3d04379630dd1afb72306ca5d","delta":"Hello"}
```

#### [Text End Part](#text-end-part)

Indicates the completion of a text block.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"text-end","id":"msg_68679a454370819ca74c8eb3d04379630dd1afb72306ca5d"}
```

### [Reasoning Parts](#reasoning-parts)

Reasoning content is streamed using a start/delta/end pattern with unique IDs for each reasoning block.

#### [Reasoning Start Part](#reasoning-start-part)

Indicates the beginning of a reasoning block.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"reasoning-start","id":"reasoning_123"}
```

#### [Reasoning Delta Part](#reasoning-delta-part)

Contains incremental reasoning content for the reasoning block.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"reasoning-delta","id":"reasoning_123","delta":"This is some reasoning"}
```

#### [Reasoning End Part](#reasoning-end-part)

Indicates the completion of a reasoning block.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"reasoning-end","id":"reasoning_123"}
```

### [Reasoning File Part](#reasoning-file-part)

Reasoning file parts contain references to files generated as part of reasoning, such as images produced during the reasoning process.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"reasoning-file","url":"data:image/png;base64,iVBOR...","mediaType":"image/png"}
```

### [Source Parts](#source-parts)

Source parts provide references to external content sources.

#### [Source URL Part](#source-url-part)

References to external URLs.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"source-url","sourceId":"https://example.com","url":"https://example.com"}
```

#### [Source Document Part](#source-document-part)

References to documents or files.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"source-document","sourceId":"https://example.com","mediaType":"file","title":"Title"}
```

### [File Part](#file-part)

The file parts contain references to files with their media type.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"file","url":"https://example.com/file.png","mediaType":"image/png"}
```

### [Custom Part](#custom-part)

Custom parts represent provider-specific content that doesn't fit into the standard part types. The `kind` field identifies the specific custom content type in the format `{provider}.{provider-type}`.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"custom","kind":"openai.compaction","providerMetadata":{"openai":{"itemId":"cmp_123"}}}
```

### [Data Parts](#data-parts)

Custom data parts allow streaming of arbitrary structured data with type-specific handling.

Format: Server-Sent Event with JSON object where the type includes a custom suffix

Example:

```
1

data: {"type":"data-weather","data":{"location":"SF","temperature":100}}
```

The `data-*` type pattern allows you to define custom data types that your frontend can handle specifically.

### [Error Part](#error-part)

The error parts are appended to the message as they are received.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"error","errorText":"error message"}
```

### [Tool Input Start Part](#tool-input-start-part)

Indicates the beginning of tool input streaming.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-input-start","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","toolName":"getWeatherInformation"}
```

### [Tool Input Delta Part](#tool-input-delta-part)

Incremental chunks of tool input as it's being generated.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-input-delta","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","inputTextDelta":"San Francisco"}
```

### [Tool Input Available Part](#tool-input-available-part)

Indicates that tool input is complete and ready for execution.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-input-available","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","toolName":"getWeatherInformation","input":{"city":"San Francisco"}}
```

### [Tool Approval Request Part](#tool-approval-request-part)

Indicates that a tool call requires approval, or records that the approval decision was made automatically.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-approval-request","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","approvalId":"approval_123","approvalDescriptor":{"scope":"account:delete"},"reason":"Requires operator review"}
```

When `isAutomatic` is omitted, the request expects an explicit approval response
from the client. `reason` is optional and explains why the tool call requires
approval. `approvalDescriptor` is optional opaque metadata for the approval.
When the stream is processed into UI messages, it is available as
`part.approval.descriptor` and is retained through subsequent approval states.

### [Tool Approval Response Part](#tool-approval-response-part)

Records the approval decision for a tool call.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-approval-response","approvalId":"approval_123","approved":false,"reason":"User denied the request"}
```

For provider-executed tools, the response can also include `providerExecuted: true`.

### [Tool Output Available Part](#tool-output-available-part)

Contains the result of tool execution.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-output-available","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","output":{"city":"San Francisco","weather":"sunny"}}
```

### [Tool Output Denied Part](#tool-output-denied-part)

Indicates that tool execution was denied after the approval flow completed.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"tool-output-denied","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar"}
```

### [Start Step Part](#start-step-part)

A part indicating the start of a step.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"start-step"}
```

### [Finish Step Part](#finish-step-part)

A part indicating that a step (i.e., one LLM API call in the backend) has been completed.

This part is necessary to correctly process multiple stitched assistant calls, e.g. when calling tools in the backend, and using steps in `useChat` at the same time.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"finish-step"}
```

### [Reset Step Part](#reset-step-part)

Removes all message parts received since the most recent `start-step` part. If
there is no step boundary, it removes all parts from the current message. This
is useful when a streamed step is retried and partial output from the failed
attempt must be invalidated before replacement output is sent.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"reset-step"}
```

### [Finish Message Part](#finish-message-part)

A part indicating the completion of a message.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"finish"}
```

### [Abort Part](#abort-part)

Indicates the stream was aborted.

Format: Server-Sent Event with JSON object

Example:

```
1

data: {"type":"abort","reason":"user cancelled"}
```

### [Stream Termination](#stream-termination)

The stream ends with a special `[DONE]` marker.

Format: Server-Sent Event with literal `[DONE]`

Example:

```
1

data: [DONE]
```

The data stream protocol is supported
by `useChat` and `useCompletion` on the frontend and used by default.
`useCompletion` only supports the `text` and `data` stream parts.

On the backend, you can pass the `streamText` result stream to `toUIMessageStream` and return it with `createUIMessageStreamResponse`.

### [UI Message Stream Example](#ui-message-stream-example)

Here is a Next.js example that uses the UI message stream protocol:

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useState } from 'react';



5



6

export default function Chat() {



7

const [input, setInput] = useState('');



8

const { messages, sendMessage } = useChat();



9



10

return (



11

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



12

{messages.map(message => (



13

<div key={message.id} className="whitespace-pre-wrap">



14

{message.role === 'user' ? 'User: ' : 'AI: '}



15

{message.parts.map((part, i) => {



16

switch (part.type) {



17

case 'text':



18

return <div key={`${message.id}-${i}`}>{part.text}</div>;



19

}



20

})}



21

</div>



22

))}



23



24

<form



25

onSubmit={e => {



26

e.preventDefault();



27

sendMessage({ text: input });



28

setInput('');



29

}}



30

>



31

<input



32

className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"



33

value={input}



34

placeholder="Say something..."



35

onChange={e => setInput(e.currentTarget.value)}



36

/>



37

</form>



38

</div>



39

);



40

}
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

streamText,



5

toUIMessageStream,



6

UIMessage,



7

} from 'ai';



8



9

// Allow streaming responses up to 30 seconds



10

export const maxDuration = 30;



11



12

export async function POST(req: Request) {



13

const { messages }: { messages: UIMessage[] } = await req.json();



14



15

const result = streamText({



16

model: "xai/grok-4.6",



17

messages: await convertToModelMessages(messages),



18

});



19



20

return createUIMessageStreamResponse({



21

stream: toUIMessageStream({ stream: result.stream }),



22

});



23

}
```

[Previous

Message Metadata](/docs/ai-sdk-ui/message-metadata)[Next

AI SDK RSC](/docs/ai-sdk-rsc)
