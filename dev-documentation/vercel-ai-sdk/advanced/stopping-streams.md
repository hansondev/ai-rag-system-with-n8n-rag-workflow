---
title: "Stopping Streams"
source_url: https://ai-sdk.dev/docs/advanced/stopping-streams
section: advanced
crawled: 2026-09-20
---

# Stopping Streams

> Source: https://ai-sdk.dev/docs/advanced/stopping-streams

[Advanced](/docs/advanced)Stopping Streams


[Stopping Streams](#stopping-streams)
=====================================

Canceling ongoing streams is often needed.
For example, users might want to stop a stream when they realize that the response is not what they want.

The different parts of the AI SDK support canceling streams in different ways.

[AI SDK Core](#ai-sdk-core)
---------------------------

The AI SDK functions have an `abortSignal` argument that you can use to cancel a stream.
You would use this if you want to cancel a stream from the server side to the LLM API, e.g. by
forwarding the `abortSignal` from the request.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { createTextStreamResponse, streamText, toTextStream } from 'ai';



2



3

export async function POST(req: Request) {



4

const { prompt } = await req.json();



5



6

const result = streamText({



7

model: "xai/grok-4.6",



8

prompt,



9

// forward the abort signal:



10

abortSignal: req.signal,



11

onAbort: ({ steps }) => {



12

// Handle cleanup when stream is aborted



13

console.log('Stream aborted after', steps.length, 'steps');



14

// Persist partial results to database



15

},



16

});



17



18

return createTextStreamResponse({



19

stream: toTextStream({ stream: result.stream }),



20

});



21

}
```

[AI SDK UI](#ai-sdk-ui)
-----------------------

The hooks, e.g. `useChat` or `useCompletion`, provide a `stop` helper function that can be used to cancel a stream.
This aborts the HTTP request from the client. To also stop the model request on the server, your server runtime must propagate the client disconnect to the request's `AbortSignal`, and your route must forward that signal to the AI SDK Core call as shown above.

Stream abort functionality is not compatible with stream resumption. If you're
using `resume: true` in `useChat`, the abort functionality will break the
resumption mechanism. Choose either abort or resume functionality, but not
both.

```
1

'use client';



2



3

import { useCompletion } from '@ai-sdk/react';



4



5

export default function Chat() {



6

const { input, completion, stop, status, handleSubmit, handleInputChange } =



7

useCompletion();



8



9

return (



10

<div>



11

{(status === 'submitted' || status === 'streaming') && (



12

<button type="button" onClick={() => stop()}>



13

Stop



14

</button>



15

)}



16

{completion}



17

<form onSubmit={handleSubmit}>



18

<input value={input} onChange={handleInputChange} />



19

</form>



20

</div>



21

);



22

}
```

### [Vercel](#vercel)

On Vercel, [request cancellation](https://vercel.com/docs/functions/functions-api-reference#cancel-requests) is only supported in the Node.js runtime and must be enabled for each function that needs it. Add `supportsCancellation` to the function's configuration in `vercel.json`:

vercel.json

```
1

{



2

"functions": {



3

"app/api/chat/route.ts": {



4

"supportsCancellation": true



5

}



6

}



7

}
```

With cancellation enabled, calling `stop()` aborts the client request, Vercel aborts `req.signal`, and forwarding `req.signal` as `abortSignal` cancels the model request.

Without `supportsCancellation`, `stop()` still stops the client-side stream
but the server-side generation may continue.

[Handling stream abort cleanup](#handling-stream-abort-cleanup)
---------------------------------------------------------------

When streams are aborted, you may need to perform cleanup operations such as persisting partial results or cleaning up resources. The `onAbort` callback provides a way to handle these scenarios on the server side.

Unlike `onEnd`, which is called when a stream completes normally, `onAbort` is specifically called when a stream is aborted via `AbortSignal`. This distinction allows you to handle normal completion and aborted streams differently.

For UI message streams (`toUIMessageStreamResponse`), the `onEnd` callback
also receives an `isAborted` parameter that indicates whether the stream was
aborted. This allows you to handle both completion and abort scenarios in a
single callback.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Write a long story...',



6

abortSignal: controller.signal,



7

onAbort: ({ steps }) => {



8

// Called when stream is aborted - persist partial results



9

await savePartialResults(steps);



10

await logAbortEvent(steps.length);



11

},



12

onEnd: ({ steps, totalUsage }) => {



13

// Called when stream completes normally



14

await saveFinalResults(steps, totalUsage);



15

},



16

});
```

The `onAbort` callback receives:

* `steps`: Array of all completed steps before the abort occurred

This is particularly useful for:

* Persisting partial conversation history to database
* Saving partial progress for later continuation
* Cleaning up server-side resources or connections
* Logging abort events for analytics

You can also handle abort events directly in the stream using the `abort` stream part:

```
1

for await (const part of result.stream) {



2

switch (part.type) {



3

case 'text-delta':



4

// Handle text delta content



5

break;



6

case 'abort':



7

// Handle abort event directly in stream



8

console.log('Stream was aborted');



9

break;



10

// ... other cases



11

}



12

}
```

[UI Message Streams](#ui-message-streams)
-----------------------------------------

When using `toUIMessageStream`, you need to handle stream abortion slightly differently. The `onEnd` callback receives an `isAborted` parameter, and you should pass `consumeStream` to `createUIMessageStreamResponse` to ensure proper abort handling:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { openai } from '@ai-sdk/openai';



2

import {



3

consumeStream,



4

convertToModelMessages,



5

createUIMessageStreamResponse,



6

streamText,



7

toUIMessageStream,



8

UIMessage,



9

} from 'ai';



10



11

export async function POST(req: Request) {



12

const { messages }: { messages: UIMessage[] } = await req.json();



13



14

const result = streamText({



15

model: "xai/grok-4.6",



16

messages: await convertToModelMessages(messages),



17

abortSignal: req.signal,



18

});



19



20

return createUIMessageStreamResponse({



21

stream: toUIMessageStream({



22

stream: result.stream,



23

onEnd: async ({ isAborted }) => {



24

if (isAborted) {



25

console.log('Stream was aborted');



26

// Handle abort-specific cleanup



27

} else {



28

console.log('Stream completed normally');



29

// Handle normal completion



30

}



31

},



32

}),



33

consumeSseStream: consumeStream,



34

});



35

}
```

The `consumeStream` function is necessary for proper abort handling in UI message streams. It ensures that the stream is properly consumed even when aborted, preventing potential memory leaks or hanging connections.

[AI SDK RSC](#ai-sdk-rsc)
-------------------------

The AI SDK RSC does not currently support stopping streams.

[Previous

Prompt Engineering](/docs/advanced/prompt-engineering)[Next

Backpressure](/docs/advanced/backpressure)
