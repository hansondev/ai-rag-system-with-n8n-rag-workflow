---
title: "onEnd not called when stream is aborted"
source_url: https://ai-sdk.dev/docs/troubleshooting/stream-abort-handling
section: troubleshooting
crawled: 2026-09-20
---

# onEnd not called when stream is aborted

> Source: https://ai-sdk.dev/docs/troubleshooting/stream-abort-handling

[Troubleshooting](/docs/troubleshooting)onEnd not called when stream is aborted


[onEnd not called when stream is aborted](#onend-not-called-when-stream-is-aborted)
===================================================================================

[Issue](#issue)
---------------

When using `toUIMessageStream` with an `onEnd` callback, the callback may not execute when the stream is aborted. This happens because the abort handler immediately terminates the response, preventing the `onEnd` callback from being triggered.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

// Server-side code where onEnd isn't called on abort



2

export async function POST(req: Request) {



3

const { messages } = await req.json();



4



5

const result = streamText({



6

model: "xai/grok-4.6",



7

messages: await convertToModelMessages(messages),



8

abortSignal: req.signal,



9

});



10



11

return createUIMessageStreamResponse({



12

stream: toUIMessageStream({



13

stream: result.stream,



14

onEnd: async ({ isAborted }) => {



15

// This isn't called when the stream is aborted!



16

if (isAborted) {



17

console.log('Stream was aborted');



18

// Handle abort-specific cleanup



19

} else {



20

console.log('Stream completed normally');



21

// Handle normal completion



22

}



23

},



24

}),



25

});



26

}
```

[Background](#background)
-------------------------

When a stream is aborted, the response is immediately terminated. Without proper handling, the `onEnd` callback has no chance to execute, preventing important cleanup operations like saving partial results or logging abort events.

[Solution](#solution)
---------------------

Add `consumeSseStream: consumeStream` to the `createUIMessageStreamResponse` configuration. This ensures that abort events are properly captured and forwarded to the `onEnd` callback, allowing it to execute even when the stream is aborted.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

// other imports...



2

import {



3

consumeStream,



4

createUIMessageStreamResponse,



5

toUIMessageStream,



6

} from 'ai';



7



8

export async function POST(req: Request) {



9

const { messages } = await req.json();



10



11

const result = streamText({



12

model: "xai/grok-4.6",



13

messages: await convertToModelMessages(messages),



14

abortSignal: req.signal,



15

});



16



17

return createUIMessageStreamResponse({



18

stream: toUIMessageStream({



19

stream: result.stream,



20

onEnd: async ({ isAborted }) => {



21

// Now this WILL be called even when aborted!



22

if (isAborted) {



23

console.log('Stream was aborted');



24

// Handle abort-specific cleanup



25

} else {



26

console.log('Stream completed normally');



27

// Handle normal completion



28

}



29

},



30

}),



31

consumeSseStream: consumeStream, // This enables onEnd to be called on abort



32

});



33

}
```

[Previous

Repeated assistant messages in useChat](/docs/troubleshooting/repeated-assistant-messages)[Next

Tool calling with structured outputs](/docs/troubleshooting/tool-calling-with-structured-outputs)
