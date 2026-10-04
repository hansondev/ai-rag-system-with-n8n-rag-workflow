---
title: "Streaming Custom Data"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data
section: ai-sdk-ui
crawled: 2026-09-20
---

# Streaming Custom Data

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data

[AI SDK UI](/docs/ai-sdk-ui)Streaming Custom Data


[Streaming Custom Data](#streaming-custom-data)
===============================================

It is often useful to send additional data alongside the model's response.
For example, you may want to send status information, the message ids after storing them,
or references to content that the language model is referring to.

The AI SDK provides several helpers that allows you to stream additional data to the client
and attach it to the `UIMessage` parts array:

* `createUIMessageStream`: creates a data stream
* `createUIMessageStreamResponse`: creates a response object that streams data
* `pipeUIMessageStreamToResponse`: pipes a data stream to a server response object

The data is streamed as part of the response stream using Server-Sent Events.

[Setting Up Type-Safe Data Streaming](#setting-up-type-safe-data-streaming)
---------------------------------------------------------------------------

First, define your custom message type with data part schemas for type safety:

ai/types.ts

```
1

import { UIMessage } from 'ai';



2



3

// Define your custom message type with data part schemas



4

export type MyUIMessage = UIMessage<



5

never, // metadata type



6

{



7

weather: {



8

city: string;



9

weather?: string;



10

status: 'loading' | 'success';



11

};



12

notification: {



13

message: string;



14

level: 'info' | 'warning' | 'error';



15

};



16

} // data parts type



17

>;
```

[Streaming Data from the Server](#streaming-data-from-the-server)
-----------------------------------------------------------------

In your server-side route handler, you can create a `UIMessageStream` and then pass it to `createUIMessageStreamResponse`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

route.ts

```
1

import { openai } from '@ai-sdk/openai';



2

import {



3

convertToModelMessages,



4

createUIMessageStream,



5

createUIMessageStreamResponse,



6

streamText,



7

toUIMessageStream,



8

} from 'ai';



9

import type { MyUIMessage } from '@/ai/types';



10



11

export async function POST(req: Request) {



12

const { messages } = await req.json();



13



14

const stream = createUIMessageStream<MyUIMessage>({



15

execute: ({ writer }) => {



16

// 1. Start the assistant message before writing any message parts.



17

writer.write({ type: 'start' });



18



19

// 2. Send initial status (transient - won't be added to message history)



20

writer.write({



21

type: 'data-notification',



22

data: { message: 'Processing your request...', level: 'info' },



23

transient: true, // This part won't be added to message history



24

});



25



26

// 3. Send sources (useful for RAG use cases)



27

writer.write({



28

type: 'source',



29

value: {



30

type: 'source',



31

sourceType: 'url',



32

id: 'source-1',



33

url: 'https://weather.com',



34

title: 'Weather Data Source',



35

},



36

});



37



38

// 4. Send data parts with loading state



39

writer.write({



40

type: 'data-weather',



41

id: 'weather-1',



42

data: { city: 'San Francisco', status: 'loading' },



43

});



44



45

const result = streamText({



46

model: "xai/grok-4.6",



47

messages: await convertToModelMessages(messages),



48

onEnd() {



49

// 5. Update the same data part (reconciliation)



50

writer.write({



51

type: 'data-weather',



52

id: 'weather-1', // Same ID = update existing part



53

data: {



54

city: 'San Francisco',



55

weather: 'sunny',



56

status: 'success',



57

},



58

});



59



60

// 6. Send completion notification (transient)



61

writer.write({



62

type: 'data-notification',



63

data: { message: 'Request completed', level: 'info' },



64

transient: true, // Won't be added to message history



65

});



66

},



67

});



68



69

writer.merge(



70

toUIMessageStream({ stream: result.stream, sendStart: false }),



71

);



72

},



73

});



74



75

return createUIMessageStreamResponse({ stream });



76

}
```

You can also send stream data from custom backends, e.g. Python / FastAPI,
using the [UI Message Stream
Protocol](/docs/ai-sdk-ui/stream-protocol#data-stream-protocol).

[Types of Streamable Data](#types-of-streamable-data)
-----------------------------------------------------

### [Data Parts (Persistent)](#data-parts-persistent)

Regular data parts are added to the message history and appear in `message.parts`:

```
1

writer.write({



2

type: 'data-weather',



3

id: 'weather-1', // Optional: enables reconciliation



4

data: { city: 'San Francisco', status: 'loading' },



5

});
```

### [Sources](#sources)

Sources are useful for RAG implementations where you want to show which documents or URLs were referenced:

```
1

writer.write({



2

type: 'source',



3

value: {



4

type: 'source',



5

sourceType: 'url',



6

id: 'source-1',



7

url: 'https://example.com',



8

title: 'Example Source',



9

},



10

});
```

### [Transient Data Parts (Ephemeral)](#transient-data-parts-ephemeral)

Transient parts are sent to the client but not added to the message history. They are only accessible via the `onData` useChat handler:

```
1

// server



2

writer.write({



3

type: 'data-notification',



4

data: { message: 'Processing...', level: 'info' },



5

transient: true, // Won't be added to message history



6

});



7



8

// client



9

const [notification, setNotification] = useState();



10



11

const { messages } = useChat({



12

onData: ({ data, type }) => {



13

if (type === 'data-notification') {



14

setNotification({ message: data.message, level: data.level });



15

}



16

},



17

});
```

[Data Part Reconciliation](#data-part-reconciliation)
-----------------------------------------------------

When you write to a data part with the same ID, the client automatically reconciles and updates that part. This enables powerful dynamic experiences like:

* **Collaborative artifacts** - Update code, documents, or designs in real-time
* **Progressive data loading** - Show loading states that transform into final results
* **Live status updates** - Update progress bars, counters, or status indicators
* **Interactive components** - Build UI elements that evolve based on user interaction

The reconciliation happens automatically - simply use the same `id` when writing to the stream.

[Processing Data on the Client](#processing-data-on-the-client)
---------------------------------------------------------------

### [Using the onData Callback](#using-the-ondata-callback)

The `onData` callback is essential for handling streaming data, especially transient parts:

page.tsx

```
1

import { useChat } from '@ai-sdk/react';



2

import type { MyUIMessage } from '@/ai/types';



3



4

const { messages } = useChat<MyUIMessage>({



5

api: '/api/chat',



6

onData: dataPart => {



7

// Handle all data parts as they arrive (including transient parts)



8

console.log('Received data part:', dataPart);



9



10

// Handle different data part types



11

if (dataPart.type === 'data-weather') {



12

console.log('Weather update:', dataPart.data);



13

}



14



15

// Handle transient notifications (ONLY available here, not in message.parts)



16

if (dataPart.type === 'data-notification') {



17

showToast(dataPart.data.message, dataPart.data.level);



18

}



19

},



20

});
```

**Important:** Transient data parts are **only** available through the `onData` callback. They will not appear in the `message.parts` array since they're not added to message history.

### [Rendering Persistent Data Parts](#rendering-persistent-data-parts)

You can filter and render data parts from the message parts array:

page.tsx

```
1

const result = (



2

<>



3

{messages?.map(message => (



4

<div key={message.id}>



5

{/* Render weather data parts */}



6

{message.parts



7

.filter(part => part.type === 'data-weather')



8

.map((part, index) => (



9

<div key={index} className="weather-widget">



10

{part.data.status === 'loading' ? (



11

<>Getting weather for {part.data.city}...</>



12

) : (



13

<>



14

Weather in {part.data.city}: {part.data.weather}



15

</>



16

)}



17

</div>



18

))}



19



20

{/* Render text content */}



21

{message.parts



22

.filter(part => part.type === 'text')



23

.map((part, index) => (



24

<div key={index}>{part.text}</div>



25

))}



26



27

{/* Render sources */}



28

{message.parts



29

.filter(part => part.type === 'source')



30

.map((part, index) => (



31

<div key={index} className="source">



32

Source: <a href={part.url}>{part.title}</a>



33

</div>



34

))}



35

</div>



36

))}



37

</>



38

);
```

### [Complete Example](#complete-example)

page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useState } from 'react';



5

import type { MyUIMessage } from '@/ai/types';



6



7

export default function Chat() {



8

const [input, setInput] = useState('');



9



10

const { messages, sendMessage } = useChat<MyUIMessage>({



11

api: '/api/chat',



12

onData: dataPart => {



13

// Handle transient notifications



14

if (dataPart.type === 'data-notification') {



15

console.log('Notification:', dataPart.data.message);



16

}



17

},



18

});



19



20

const handleSubmit = (e: React.FormEvent) => {



21

e.preventDefault();



22

sendMessage({ text: input });



23

setInput('');



24

};



25



26

return (



27

<>



28

{messages?.map(message => (



29

<div key={message.id}>



30

{message.role === 'user' ? 'User: ' : 'AI: '}



31



32

{/* Render weather data */}



33

{message.parts



34

.filter(part => part.type === 'data-weather')



35

.map((part, index) => (



36

<span key={index} className="weather-update">



37

{part.data.status === 'loading' ? (



38

<>Getting weather for {part.data.city}...</>



39

) : (



40

<>



41

Weather in {part.data.city}: {part.data.weather}



42

</>



43

)}



44

</span>



45

))}



46



47

{/* Render text content */}



48

{message.parts



49

.filter(part => part.type === 'text')



50

.map((part, index) => (



51

<div key={index}>{part.text}</div>



52

))}



53

</div>



54

))}



55



56

<form onSubmit={handleSubmit}>



57

<input



58

value={input}



59

onChange={e => setInput(e.target.value)}



60

placeholder="Ask about the weather..."



61

/>



62

<button type="submit">Send</button>



63

</form>



64

</>



65

);



66

}
```

[Use Cases](#use-cases)
-----------------------

* **RAG Applications** - Stream sources and retrieved documents
* **Real-time Status** - Show loading states and progress updates
* **Collaborative Tools** - Stream live updates to shared artifacts
* **Analytics** - Send usage data without cluttering message history
* **Notifications** - Display temporary alerts and status messages

[Message Metadata vs Data Parts](#message-metadata-vs-data-parts)
-----------------------------------------------------------------

Both [message metadata](/docs/ai-sdk-ui/message-metadata) and data parts allow you to send additional information alongside messages, but they serve different purposes:

### [Message Metadata](#message-metadata)

Message metadata is best for **message-level information** that describes the message as a whole:

* Attached at the message level via `message.metadata`
* Sent using the `messageMetadata` callback in `toUIMessageStream`
* Ideal for: timestamps, model info, token usage, user context
* Type-safe with custom metadata types

```
1

// Server: Send metadata about the message



2

return createUIMessageStreamResponse({



3

stream: toUIMessageStream({



4

stream: result.stream,



5

messageMetadata: ({ part }) => {



6

if (part.type === 'finish') {



7

return {



8

model: part.response.modelId,



9

totalTokens: part.totalUsage.totalTokens,



10

createdAt: Date.now(),



11

};



12

}



13

},



14

}),



15

});
```

### [Data Parts](#data-parts)

Data parts are best for streaming **dynamic arbitrary data**:

* Added to the message parts array via `message.parts`
* Streamed using `createUIMessageStream` and `writer.write()`
* Can be reconciled/updated using the same ID
* Support transient parts that don't persist
* Ideal for: dynamic content, loading states, interactive components

```
1

// Server: Stream data as part of message content



2

writer.write({



3

type: 'data-weather',



4

id: 'weather-1',



5

data: { city: 'San Francisco', status: 'loading' },



6

});
```

For more details on message metadata, see the [Message Metadata documentation](/docs/ai-sdk-ui/message-metadata).

[Previous

Object Generation](/docs/ai-sdk-ui/object-generation)[Next

Error Handling](/docs/ai-sdk-ui/error-handling)
