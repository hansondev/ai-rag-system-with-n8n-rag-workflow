---
title: "createUIMessageStream"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream
section: reference
crawled: 2026-09-20
---

# createUIMessageStream

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream

[AI SDK UI](/docs/ai-sdk-ui)createUIMessageStream


[`createUIMessageStream`](#createuimessagestream)
=================================================

The `createUIMessageStream` function allows you to create a readable stream for UI messages with advanced features like message merging, error handling, and finish callbacks.

[Import](#import)
-----------------

```
import { createUIMessageStream } from "ai"
```

[Example](#example)
-------------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const existingMessages: UIMessage[] = [



2

/* ... */



3

];



4



5

const stream = createUIMessageStream({



6

async execute({ writer }) {



7

// The outer stream owns the assistant message lifecycle.



8

writer.write({ type: 'start' });



9



10

// Start a text message



11

// Note: The id must be consistent across text-start, text-delta, and text-end steps



12

// This allows the system to correctly identify they belong to the same text block



13

writer.write({



14

type: 'text-start',



15

id: 'example-text',



16

});



17



18

// Write a message chunk



19

writer.write({



20

type: 'text-delta',



21

id: 'example-text',



22

delta: 'Hello',



23

});



24



25

// End the text message



26

writer.write({



27

type: 'text-end',



28

id: 'example-text',



29

});



30



31

// Merge another stream from streamText



32

const result = streamText({



33

model: "xai/grok-4.6",



34

prompt: 'Write a haiku about AI',



35

});



36



37

writer.merge(



38

toUIMessageStream({



39

stream: result.stream,



40

sendStart: false,



41

onEnd: ({ outcome }) => {



42

// The composer decides that the model stream outcome is also the



43

// aggregate stream outcome.



44

writer.setOutcome(outcome);



45

},



46

}),



47

);



48

},



49

onError: error => `Custom error: ${error.message}`,



50

originalMessages: existingMessages,



51

onEnd: ({ messages, isContinuation, outcome, responseMessage }) => {



52

console.log('Stream ended with messages:', messages);



53

console.log('Stream outcome:', outcome.status);



54

},



55

});
```

`setOutcome` records the composer's policy without writing a chunk or closing
the stream. The first outcome declared through `setOutcome` is retained, but a
fatal execution, merge, error-handling, or downstream processing failure makes
the final `onEnd` outcome `failed`. Individual `error` chunks do not change the
outcome by themselves. When merging multiple child streams, aggregate their
outcomes and call `setOutcome` once.

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### execute:

(options: { writer: UIMessageStreamWriterWithOutcome }) => Promise<void> | void

UIMessageStreamWriterWithOutcome

### write:

(part: UIMessageChunk) => void

### merge:

(stream: ReadableStream<UIMessageChunk>) => void

### setOutcome:

(outcome: UIMessageStreamOutcome) => void

### onError:

(error: unknown) => string

### onError:

(error: unknown) => string

### originalMessages:

UIMessage[] | undefined

### onEnd:

(options: { messages: UIMessage[]; isContinuation: boolean; isAborted: boolean; outcome: UIMessageStreamOutcome; responseMessage: UIMessage; finishReason?: FinishReason }) => PromiseLike<void> | void

EndOptions

### messages:

UIMessage[]

### isContinuation:

boolean

### isAborted:

boolean

### outcome:

UIMessageStreamOutcome = { status: 'completed' } | { status: 'failed'; error?: unknown } | { status: 'aborted' } | { status: 'unknown' }

### responseMessage:

UIMessage

### finishReason:

FinishReason | undefined

### onFinish:

(options: { messages: UIMessage[]; isContinuation: boolean; isAborted: boolean; outcome: UIMessageStreamOutcome; responseMessage: UIMessage; finishReason?: FinishReason }) => PromiseLike<void> | void

### generateId:

IdGenerator | undefined

### [Returns](#returns)

`ReadableStream<UIMessageChunk>`

A readable stream that emits UI message chunks. The stream automatically handles error propagation, merging of multiple streams, and proper cleanup when all operations are complete.

[Previous

pruneMessages](/docs/reference/ai-sdk-ui/prune-messages)[Next

createUIMessageStreamResponse](/docs/reference/ai-sdk-ui/create-ui-message-stream-response)
