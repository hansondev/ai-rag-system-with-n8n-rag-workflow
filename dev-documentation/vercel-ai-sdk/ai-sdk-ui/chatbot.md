---
title: "Chatbot"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
section: ai-sdk-ui
crawled: 2026-09-20
---

# Chatbot

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot

[AI SDK UI](/docs/ai-sdk-ui)Chatbot


[Chatbot](#chatbot)
===================

The `useChat` hook makes it effortless to create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages arrive.

To summarize, the `useChat` hook provides the following features:

* **Message Streaming**: All the messages from the AI provider are streamed to the chat UI in real-time.
* **Managed States**: The hook manages the states for input, messages, status, error and more for you.
* **Seamless Integration**: Easily integrate your chat AI into any design or layout with minimal effort.

In this guide, you will learn how to use the `useChat` hook to create a chatbot application with real-time message streaming.
Check out our [chatbot with tools guide](/docs/ai-sdk-ui/chatbot-tool-usage) to learn how to use tools in your chatbot.
Let's start with the following example first.

[Example](#example)
-------------------

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { DefaultChatTransport } from 'ai';



5

import { useState } from 'react';



6



7

export default function Page() {



8

const { messages, sendMessage, status } = useChat({



9

transport: new DefaultChatTransport({



10

api: '/api/chat',



11

}),



12

});



13

const [input, setInput] = useState('');



14



15

return (



16

<>



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



26

<form



27

onSubmit={e => {



28

e.preventDefault();



29

if (input.trim()) {



30

sendMessage({ text: input });



31

setInput('');



32

}



33

}}



34

>



35

<input



36

value={input}



37

onChange={e => setInput(e.target.value)}



38

disabled={status !== 'ready'}



39

placeholder="Say something..."



40

/>



41

<button type="submit" disabled={status !== 'ready'}>



42

Submit



43

</button>



44

</form>



45

</>



46

);



47

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

instructions: 'You are a helpful assistant.',



18

messages: await convertToModelMessages(messages),



19

});



20



21

return createUIMessageStreamResponse({



22

stream: toUIMessageStream({ stream: result.stream }),



23

});



24

}
```

The UI messages have a new `parts` property that contains the message parts.
We recommend rendering the messages using the `parts` property instead of the
`content` property. The parts property supports different message types,
including text, tool invocation, and tool result, and allows for more flexible
and complex chat UIs.

In the `Page` component, the `useChat` hook will request to your AI provider endpoint whenever the user sends a message using `sendMessage`.
The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available,
without having to wait for the entire response to be received.

[Customized UI](#customized-ui)
-------------------------------

`useChat` also provides ways to manage the chat message states via code, show status, and update messages without being triggered by user interactions.

### [Status](#status)

The `useChat` hook returns a `status`. It has the following possible values:

* `submitted`: The message has been sent to the API and we're awaiting the start of the response stream.
* `streaming`: The response is actively streaming in from the API, receiving chunks of data.
* `ready`: The full response has been received and processed; a new user message can be submitted.
* `error`: An error occurred during the API request, preventing successful completion.

You can use `status` for e.g. the following purposes:

* To show a loading spinner while the chatbot is processing the user's message.
* To show a "Stop" button to abort the current message.
* To disable the submit button.

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { DefaultChatTransport } from 'ai';



5

import { useState } from 'react';



6



7

export default function Page() {



8

const { messages, sendMessage, status, stop } = useChat({



9

transport: new DefaultChatTransport({



10

api: '/api/chat',



11

}),



12

});



13

const [input, setInput] = useState('');



14



15

return (



16

<>



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



26

{(status === 'submitted' || status === 'streaming') && (



27

<div>



28

{status === 'submitted' && <Spinner />}



29

<button type="button" onClick={() => stop()}>



30

Stop



31

</button>



32

</div>



33

)}



34



35

<form



36

onSubmit={e => {



37

e.preventDefault();



38

if (input.trim()) {



39

sendMessage({ text: input });



40

setInput('');



41

}



42

}}



43

>



44

<input



45

value={input}



46

onChange={e => setInput(e.target.value)}



47

disabled={status !== 'ready'}



48

placeholder="Say something..."



49

/>



50

<button type="submit" disabled={status !== 'ready'}>



51

Submit



52

</button>



53

</form>



54

</>



55

);



56

}
```

### [Error State](#error-state)

Similarly, the `error` state reflects the error object thrown during the fetch request.
It can be used to display an error message, disable the submit button, or show a retry button:

We recommend showing a generic error message to the user, such as "Something
went wrong." This is a good practice to avoid leaking information from the
server.

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { DefaultChatTransport } from 'ai';



5

import { useState } from 'react';



6



7

export default function Chat() {



8

const { messages, sendMessage, error, regenerate } = useChat({



9

transport: new DefaultChatTransport({



10

api: '/api/chat',



11

}),



12

});



13

const [input, setInput] = useState('');



14



15

return (



16

<div>



17

{messages.map(m => (



18

<div key={m.id}>



19

{m.role}:{' '}



20

{m.parts.map((part, index) =>



21

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



22

)}



23

</div>



24

))}



25



26

{error && (



27

<>



28

<div>An error occurred.</div>



29

<button type="button" onClick={() => regenerate()}>



30

Retry



31

</button>



32

</>



33

)}



34



35

<form



36

onSubmit={e => {



37

e.preventDefault();



38

if (input.trim()) {



39

sendMessage({ text: input });



40

setInput('');



41

}



42

}}



43

>



44

<input



45

value={input}



46

onChange={e => setInput(e.target.value)}



47

disabled={error != null}



48

/>



49

</form>



50

</div>



51

);



52

}
```

Please also see the [error handling](/docs/ai-sdk-ui/error-handling) guide for more information.

### [Modify messages](#modify-messages)

Sometimes, you may want to directly modify some existing messages. For example, a delete button can be added to each message to allow users to remove them from the chat history.

The `setMessages` function can help you achieve these tasks:

```
1

const { messages, setMessages } = useChat()



2



3

const handleDelete = (id) => {



4

setMessages(messages.filter(message => message.id !== id))



5

}



6



7

return <>



8

{messages.map(message => (



9

<div key={message.id}>



10

{message.role === 'user' ? 'User: ' : 'AI: '}



11

{message.parts.map((part, index) => (



12

part.type === 'text' ? (



13

<span key={index}>{part.text}</span>



14

) : null



15

))}



16

<button onClick={() => handleDelete(message.id)}>Delete</button>



17

</div>



18

))}



19

...
```

You can think of `messages` and `setMessages` as a pair of `state` and `setState` in React.

### [Cancellation and regeneration](#cancellation-and-regeneration)

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the `stop` function returned by the `useChat` hook.

```
1

const { stop, status } = useChat()



2



3

return <>



4

<button onClick={stop} disabled={!(status === 'streaming' || status === 'submitted')}>Stop</button>



5

...
```

When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your chatbot application.

Similarly, you can also request the AI provider to reprocess the last message by calling the `regenerate` function returned by the `useChat` hook:

```
1

const { regenerate, status } = useChat();



2



3

return (



4

<>



5

<button



6

onClick={regenerate}



7

disabled={!(status === 'ready' || status === 'error')}



8

>



9

Regenerate



10

</button>



11

...



12

</>



13

);
```

When the user clicks the "Regenerate" button, the AI provider will regenerate the last message and replace the current one correspondingly.

### [Throttling UI Updates](#throttling-ui-updates)

This feature is currently only available for React.

By default, the `useChat` hook will trigger a render every time a new chunk is received.
You can throttle the UI updates with the `throttle` option.

page.tsx

```
1

const { messages, ... } = useChat({



2

// Throttle the messages and data updates to 50ms:



3

throttle: 50



4

})
```

[Event Callbacks](#event-callbacks)
-----------------------------------

`useChat` provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle:

* `onFinish`: Called when the assistant response is completed. The event includes the response message, all messages, and flags for abort, disconnect, and errors.
* `onError`: Called when an error occurs during the fetch request.
* `onData`: Called whenever a data part is received.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```
1

import { UIMessage } from 'ai';



2



3

const {



4

/* ... */



5

} = useChat({



6

onFinish: ({ message, messages, isAbort, isDisconnect, isError }) => {



7

// use information to e.g. update other UI states



8

},



9

onError: error => {



10

console.error('An error occurred:', error);



11

},



12

onData: data => {



13

console.log('Received data part from server:', data);



14

},



15

});
```

It's worth noting that you can abort the processing by throwing an error in the `onData` callback. This will trigger the `onError` callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

[Request Configuration](#request-configuration)
-----------------------------------------------

### [Custom headers, body, and credentials](#custom-headers-body-and-credentials)

By default, the `useChat` hook sends a HTTP POST request to the `/api/chat` endpoint with the message list as the request body. You can customize the request in two ways:

#### [Hook-Level Configuration (Applied to all requests)](#hook-level-configuration-applied-to-all-requests)

You can configure transport-level options that will be applied to all requests made by the hook:

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

const { messages, sendMessage } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/custom-chat',



7

headers: {



8

Authorization: 'your_token',



9

},



10

body: {



11

user_id: '123',



12

},



13

credentials: 'same-origin',



14

}),



15

});
```

#### [Dynamic Hook-Level Configuration](#dynamic-hook-level-configuration)

You can also provide functions that return configuration values. This is useful for authentication tokens that need to be refreshed, or for configuration that depends on runtime conditions:

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

const { messages, sendMessage } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/custom-chat',



7

headers: () => ({



8

Authorization: `Bearer ${getAuthToken()}`,



9

'X-User-ID': getCurrentUserId(),



10

}),



11

body: () => ({



12

sessionId: getCurrentSessionId(),



13

preferences: getUserPreferences(),



14

}),



15

credentials: () => 'include',



16

}),



17

});
```

For component state that changes over time, use `useRef` to store the current
value and reference `ref.current` in your configuration function, or prefer
request-level options (see next section) for better reliability.

#### [Request-Level Configuration (Recommended)](#request-level-configuration-recommended)

**Recommended**: Use request-level options for better flexibility and control.
Request-level options take precedence over hook-level options and allow you to
customize each request individually.

```
1

// Pass options as the second parameter to sendMessage



2

sendMessage(



3

{ text: input },



4

{



5

headers: {



6

Authorization: 'Bearer token123',



7

'X-Custom-Header': 'custom-value',



8

},



9

body: {



10

temperature: 0.7,



11

max_tokens: 100,



12

user_id: '123',



13

},



14

metadata: {



15

userId: 'user123',



16

sessionId: 'session456',



17

},



18

},



19

);
```

The request-level options are merged with hook-level options, with request-level options taking precedence. On your server side, you can handle the request with this additional information.

### [Setting custom body fields per request](#setting-custom-body-fields-per-request)

You can configure custom `body` fields on a per-request basis using the second parameter of the `sendMessage` function.
This is useful if you want to pass in additional information to your backend that is not part of the message list.

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

const { messages, sendMessage } = useChat();



8

const [input, setInput] = useState('');



9



10

return (



11

<div>



12

{messages.map(m => (



13

<div key={m.id}>



14

{m.role}:{' '}



15

{m.parts.map((part, index) =>



16

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



17

)}



18

</div>



19

))}



20



21

<form



22

onSubmit={event => {



23

event.preventDefault();



24

if (input.trim()) {



25

sendMessage(



26

{ text: input },



27

{



28

body: {



29

customKey: 'customValue',



30

},



31

},



32

);



33

setInput('');



34

}



35

}}



36

>



37

<input value={input} onChange={e => setInput(e.target.value)} />



38

</form>



39

</div>



40

);



41

}
```

You can retrieve these custom fields on your server side by destructuring the request body:

app/api/chat/route.ts

```
1

export async function POST(req: Request) {



2

// Extract additional information ("customKey") from the body of the request:



3

const { messages, customKey }: { messages: UIMessage[]; customKey: string } =



4

await req.json();



5

//...



6

}
```

[Message Metadata](#message-metadata)
-------------------------------------

You can attach custom metadata to messages for tracking information like timestamps, model details, and token usage.

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

if (part.type === 'start') {



7

return {



8

createdAt: Date.now(),



9

model: 'gpt-5.1',



10

};



11

}



12



13

if (part.type === 'finish') {



14

return {



15

totalTokens: part.totalUsage.totalTokens,



16

};



17

}



18

},



19

}),



20

});
```

```
1

// Client: Access metadata via message.metadata



2

{



3

messages.map(message => (



4

<div key={message.id}>



5

{message.role}:{' '}



6

{message.metadata?.createdAt &&



7

new Date(message.metadata.createdAt).toLocaleTimeString()}



8

{/* Render message content */}



9

{message.parts.map((part, index) =>



10

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



11

)}



12

{/* Show token count if available */}



13

{message.metadata?.totalTokens && (



14

<span>{message.metadata.totalTokens} tokens</span>



15

)}



16

</div>



17

));



18

}
```

For complete examples with type safety and advanced use cases, see the [Message Metadata documentation](/docs/ai-sdk-ui/message-metadata).

[Transport Configuration](#transport-configuration)
---------------------------------------------------

You can configure custom transport behavior using the `transport` option to customize how messages are sent to your API:

app/page.tsx

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

export default function Chat() {



5

const { messages, sendMessage } = useChat({



6

id: 'my-chat',



7

transport: new DefaultChatTransport({



8

prepareSendMessagesRequest: ({ id, messages }) => {



9

return {



10

body: {



11

id,



12

message: messages[messages.length - 1],



13

},



14

};



15

},



16

}),



17

});



18



19

// ... rest of your component



20

}
```

The corresponding API route receives the custom request format:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

export async function POST(req: Request) {



2

const { id, message } = await req.json();



3



4

// Load existing messages and add the new one



5

const messages = await loadMessages(id);



6

messages.push(message);



7



8

const result = streamText({



9

model: "xai/grok-4.6",



10

messages: await convertToModelMessages(messages),



11

});



12



13

return createUIMessageStreamResponse({



14

stream: toUIMessageStream({ stream: result.stream }),



15

});



16

}
```

### [Advanced: Trigger-based routing](#advanced-trigger-based-routing)

For more complex scenarios like message regeneration, you can use trigger-based routing:

app/page.tsx

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

export default function Chat() {



5

const { messages, sendMessage, regenerate } = useChat({



6

id: 'my-chat',



7

transport: new DefaultChatTransport({



8

prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {



9

if (trigger === 'submit-user-message') {



10

return {



11

body: {



12

trigger: 'submit-user-message',



13

id,



14

message: messages[messages.length - 1],



15

messageId,



16

},



17

};



18

} else if (trigger === 'regenerate-assistant-message') {



19

return {



20

body: {



21

trigger: 'regenerate-assistant-message',



22

id,



23

messageId,



24

},



25

};



26

}



27

throw new Error(`Unsupported trigger: ${trigger}`);



28

},



29

}),



30

});



31



32

// ... rest of your component



33

}
```

The corresponding API route would handle different triggers:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

export async function POST(req: Request) {



2

const { trigger, id, message, messageId } = await req.json();



3



4

const chat = await readChat(id);



5

let messages = chat.messages;



6



7

if (trigger === 'submit-user-message') {



8

// Handle new user message



9

messages = [...messages, message];



10

} else if (trigger === 'regenerate-assistant-message') {



11

// Handle message regeneration - remove messages after messageId



12

const messageIndex = messages.findIndex(m => m.id === messageId);



13

if (messageIndex !== -1) {



14

messages = messages.slice(0, messageIndex);



15

}



16

}



17



18

const result = streamText({



19

model: "xai/grok-4.6",



20

messages: await convertToModelMessages(messages),



21

});



22



23

return createUIMessageStreamResponse({



24

stream: toUIMessageStream({ stream: result.stream }),



25

});



26

}
```

To learn more about building custom transports, refer to the [Transport API documentation](/docs/ai-sdk-ui/transport).

### [Direct Agent Transport](#direct-agent-transport)

For scenarios where you want to communicate directly with an Agent without going through HTTP, you can use `DirectChatTransport`. This is useful for:

* Server-side rendering scenarios
* Testing without network
* Single-process applications

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/page.tsx

```
1

import { useChat } from '@ai-sdk/react';



2

import { DirectChatTransport, ToolLoopAgent } from 'ai';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

instructions: 'You are a helpful assistant.',



7

});



8



9

export default function Chat() {



10

const { messages, sendMessage, status } = useChat({



11

transport: new DirectChatTransport({ agent }),



12

});



13



14

return (



15

<>



16

{messages.map(message => (



17

<div key={message.id}>



18

{message.role === 'user' ? 'User: ' : 'AI: '}



19

{message.parts.map((part, index) =>



20

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



21

)}



22

</div>



23

))}



24



25

<button



26

onClick={() => sendMessage({ text: 'Hello!' })}



27

disabled={status !== 'ready'}



28

>



29

Send



30

</button>



31

</>



32

);



33

}
```

The `DirectChatTransport` invokes the agent's `stream()` method directly, converting UI messages to model messages and streaming the response back as UI message chunks.

For more details, see the [DirectChatTransport reference](/docs/reference/ai-sdk-ui/direct-chat-transport).

[Controlling the response stream](#controlling-the-response-stream)
-------------------------------------------------------------------

With `streamText`, you can control how error messages and usage information are sent back to the client.

### [Error Messages](#error-messages)

By default, the error message is masked for security reasons.
The default error message is "An error occurred."
You can forward error messages or send your own error message by providing an `onError` function:

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

export async function POST(req: Request) {



10

const { messages }: { messages: UIMessage[] } = await req.json();



11



12

const result = streamText({



13

model: "xai/grok-4.6",



14

messages: await convertToModelMessages(messages),



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

onError: error => {



21

if (error == null) {



22

return 'unknown error';



23

}



24



25

if (typeof error === 'string') {



26

return error;



27

}



28



29

if (error instanceof Error) {



30

return error.message;



31

}



32



33

return JSON.stringify(error);



34

},



35

}),



36

});



37

}
```

### [Usage Information](#usage-information)

Track token consumption and resource usage with [message metadata](/docs/ai-sdk-ui/message-metadata):

1. Define a custom metadata type with usage fields (optional, for type safety)
2. Attach usage data using `messageMetadata` in your response
3. Display usage metrics in your UI components

Usage data is attached as metadata to messages and becomes available once the model completes its response generation.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { openai } from '@ai-sdk/openai';



2

import {



3

convertToModelMessages,



4

createUIMessageStreamResponse,



5

streamText,



6

toUIMessageStream,



7

UIMessage,



8

type LanguageModelUsage,



9

} from 'ai';



10



11

// Create a new metadata type (optional for type-safety)



12

type MyMetadata = {



13

totalUsage: LanguageModelUsage;



14

};



15



16

// Create a new custom message type with your own metadata



17

export type MyUIMessage = UIMessage<MyMetadata>;



18



19

export async function POST(req: Request) {



20

const { messages }: { messages: MyUIMessage[] } = await req.json();



21



22

const result = streamText({



23

model: "xai/grok-4.6",



24

messages: await convertToModelMessages(messages),



25

});



26



27

return createUIMessageStreamResponse({



28

stream: toUIMessageStream({



29

stream: result.stream,



30

originalMessages: messages,



31

messageMetadata: ({ part }) => {



32

// Send total usage when generation is finished



33

if (part.type === 'finish') {



34

return { totalUsage: part.totalUsage };



35

}



36

},



37

}),



38

});



39

}
```

Then, on the client, you can access the message-level metadata.

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import type { MyUIMessage } from './api/chat/route';



5

import { DefaultChatTransport } from 'ai';



6



7

export default function Chat() {



8

// Use custom message type defined on the server (optional for type-safety)



9

const { messages } = useChat<MyUIMessage>({



10

transport: new DefaultChatTransport({



11

api: '/api/chat',



12

}),



13

});



14



15

return (



16

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



17

{messages.map(m => (



18

<div key={m.id} className="whitespace-pre-wrap">



19

{m.role === 'user' ? 'User: ' : 'AI: '}



20

{m.parts.map(part => {



21

if (part.type === 'text') {



22

return part.text;



23

}



24

})}



25

{/* Render usage via metadata */}



26

{m.metadata?.totalUsage && (



27

<div>Total usage: {m.metadata?.totalUsage.totalTokens} tokens</div>



28

)}



29

</div>



30

))}



31

</div>



32

);



33

}
```

You can also access your metadata from the `onFinish` callback of `useChat`:

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import type { MyUIMessage } from './api/chat/route';



5

import { DefaultChatTransport } from 'ai';



6



7

export default function Chat() {



8

// Use custom message type defined on the server (optional for type-safety)



9

const { messages } = useChat<MyUIMessage>({



10

transport: new DefaultChatTransport({



11

api: '/api/chat',



12

}),



13

onFinish: ({ message }) => {



14

// Access message metadata via onFinish callback



15

console.log(message.metadata?.totalUsage);



16

},



17

});



18

}
```

### [Text Streams](#text-streams)

`useChat` can handle plain text streams by setting the `streamProtocol` option to `text`:

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



6

export default function Chat() {



7

const { messages } = useChat({



8

transport: new TextStreamChatTransport({



9

api: '/api/chat',



10

}),



11

});



12



13

return <>...</>;



14

}
```

This configuration also works with other backend servers that stream plain text.
Check out the [stream protocol guide](/docs/ai-sdk-ui/stream-protocol) for more information.

When using `TextStreamChatTransport`, tool calls, usage information and finish
reasons are not available.

[Reasoning](#reasoning)
-----------------------

Some models such as DeepSeek `deepseek-r1`
and Anthropic `claude-sonnet-4-5-20250929` support reasoning tokens.
These tokens are typically sent before the message content.
You can forward them to the client with the `sendReasoning` option:

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

export async function POST(req: Request) {



10

const { messages }: { messages: UIMessage[] } = await req.json();



11



12

const result = streamText({



13

model: 'deepseek/deepseek-r1',



14

messages: await convertToModelMessages(messages),



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

sendReasoning: true,



21

}),



22

});



23

}
```

On the client side, you can access the reasoning parts of the message object.

Reasoning parts have a `text` property that contains the reasoning content.

app/page.tsx

```
1

messages.map(message => (



2

<div key={message.id}>



3

{message.role === 'user' ? 'User: ' : 'AI: '}



4

{message.parts.map((part, index) => {



5

// text parts:



6

if (part.type === 'text') {



7

return <div key={index}>{part.text}</div>;



8

}



9



10

// reasoning parts:



11

if (part.type === 'reasoning') {



12

return <pre key={index}>{part.text}</pre>;



13

}



14

})}



15

</div>



16

));
```

Some models may also produce files as part of reasoning (e.g. images).
These are available as `reasoning-file` parts (`ReasoningFileUIPart`) with
`mediaType` and `url` properties, similar to regular file parts.

[Sources](#sources)
-------------------

Some providers such as [Perplexity](/providers/ai-sdk-providers/perplexity#sources) and
[Google](/providers/ai-sdk-providers/google#sources) include sources in the response.

Currently sources are limited to web pages that ground the response.
You can forward them to the client with the `sendSources` option:

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

export async function POST(req: Request) {



10

const { messages }: { messages: UIMessage[] } = await req.json();



11



12

const result = streamText({



13

model: 'perplexity/sonar-pro',



14

messages: await convertToModelMessages(messages),



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

sendSources: true,



21

}),



22

});



23

}
```

On the client side, you can access source parts of the message object.
There are two types of sources: `source-url` for web pages and `source-document` for documents.
Here is an example that renders both types of sources:

app/page.tsx

```
1

messages.map(message => (



2

<div key={message.id}>



3

{message.role === 'user' ? 'User: ' : 'AI: '}



4



5

{/* Render URL sources */}



6

{message.parts



7

.filter(part => part.type === 'source-url')



8

.map(part => (



9

<span key={`source-${part.id}`}>



10

[



11

<a href={part.url} target="_blank">



12

{part.title ?? new URL(part.url).hostname}



13

</a>



14

]



15

</span>



16

))}



17



18

{/* Render document sources */}



19

{message.parts



20

.filter(part => part.type === 'source-document')



21

.map(part => (



22

<span key={`source-${part.id}`}>



23

[<span>{part.title ?? `Document ${part.id}`}</span>]



24

</span>



25

))}



26

</div>



27

));
```

[Image Generation](#image-generation)
-------------------------------------

Some models such as Google `gemini-2.5-flash-image` support image generation.
When images are generated, they are exposed as files to the client.
On the client side, you can access file parts of the message object
and render them as images.

app/page.tsx

```
1

messages.map(message => (



2

<div key={message.id}>



3

{message.role === 'user' ? 'User: ' : 'AI: '}



4

{message.parts.map((part, index) => {



5

if (part.type === 'text') {



6

return <div key={index}>{part.text}</div>;



7

} else if (part.type === 'file' && part.mediaType.startsWith('image/')) {



8

return <img key={index} src={part.url} alt="Generated image" />;



9

}



10

})}



11

</div>



12

));
```

[Attachments](#attachments)
---------------------------

The `useChat` hook supports sending file attachments along with a message as well as rendering them on the client. This can be useful for building applications that involve sending images, files, or other media content to the AI provider.

There are two ways to send files with a message: using a `FileList` object from file inputs or using an array of file objects.

### [FileList](#filelist)

By using `FileList`, you can send multiple files as attachments along with a message using the file input element. The `useChat` hook will automatically convert them into data URLs and send them to the AI provider.

Currently, only `image/*` and `text/*` content types get automatically
converted into [multi-modal content
parts](/docs/foundations/prompts#file-parts). You will need to handle other
content types manually.

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useRef, useState } from 'react';



5



6

export default function Page() {



7

const { messages, sendMessage, status } = useChat();



8



9

const [input, setInput] = useState('');



10

const [files, setFiles] = useState<FileList | undefined>(undefined);



11

const fileInputRef = useRef<HTMLInputElement>(null);



12



13

return (



14

<div>



15

<div>



16

{messages.map(message => (



17

<div key={message.id}>



18

<div>{`${message.role}: `}</div>



19



20

<div>



21

{message.parts.map((part, index) => {



22

if (part.type === 'text') {



23

return <span key={index}>{part.text}</span>;



24

}



25



26

if (



27

part.type === 'file' &&



28

part.mediaType?.startsWith('image/')



29

) {



30

return <img key={index} src={part.url} alt={part.filename} />;



31

}



32



33

return null;



34

})}



35

</div>



36

</div>



37

))}



38

</div>



39



40

<form



41

onSubmit={event => {



42

event.preventDefault();



43

if (input.trim()) {



44

sendMessage({



45

text: input,



46

files,



47

});



48

setInput('');



49

setFiles(undefined);



50



51

if (fileInputRef.current) {



52

fileInputRef.current.value = '';



53

}



54

}



55

}}



56

>



57

<input



58

type="file"



59

onChange={event => {



60

if (event.target.files) {



61

setFiles(event.target.files);



62

}



63

}}



64

multiple



65

ref={fileInputRef}



66

/>



67

<input



68

value={input}



69

placeholder="Send message..."



70

onChange={e => setInput(e.target.value)}



71

disabled={status !== 'ready'}



72

/>



73

</form>



74

</div>



75

);



76

}
```

### [File Objects](#file-objects)

You can also send files as objects along with a message. This can be useful for sending pre-uploaded files or data URLs.

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

import { FileUIPart } from 'ai';



6



7

export default function Page() {



8

const { messages, sendMessage, status } = useChat();



9



10

const [input, setInput] = useState('');



11

const [files] = useState<FileUIPart[]>([



12

{



13

type: 'file',



14

filename: 'earth.png',



15

mediaType: 'image/png',



16

url: 'https://example.com/earth.png',



17

},



18

{



19

type: 'file',



20

filename: 'moon.png',



21

mediaType: 'image/png',



22

url: 'data:image/png;base64,iVBORw0KGgo...',



23

},



24

]);



25



26

return (



27

<div>



28

<div>



29

{messages.map(message => (



30

<div key={message.id}>



31

<div>{`${message.role}: `}</div>



32



33

<div>



34

{message.parts.map((part, index) => {



35

if (part.type === 'text') {



36

return <span key={index}>{part.text}</span>;



37

}



38



39

if (



40

part.type === 'file' &&



41

part.mediaType?.startsWith('image/')



42

) {



43

return <img key={index} src={part.url} alt={part.filename} />;



44

}



45



46

return null;



47

})}



48

</div>



49

</div>



50

))}



51

</div>



52



53

<form



54

onSubmit={event => {



55

event.preventDefault();



56

if (input.trim()) {



57

sendMessage({



58

text: input,



59

files,



60

});



61

setInput('');



62

}



63

}}



64

>



65

<input



66

value={input}



67

placeholder="Send message..."



68

onChange={e => setInput(e.target.value)}



69

disabled={status !== 'ready'}



70

/>



71

</form>



72

</div>



73

);



74

}
```

Files generated as part of model reasoning are available as `reasoning-file`
parts (`ReasoningFileUIPart`) with the same `mediaType` and `url` properties.

[Type Inference for Tools](#type-inference-for-tools)
-----------------------------------------------------

When working with tools in TypeScript, AI SDK UI provides type inference helpers to ensure type safety for your tool inputs and outputs.

### [InferUITool](#inferuitool)

The `InferUITool` type helper infers the input and output types of a single tool for use in UI messages:

```
1

import { InferUITool } from 'ai';



2

import { z } from 'zod';



3



4

const weatherTool = {



5

description: 'Get the current weather',



6

inputSchema: z.object({



7

location: z.string().describe('The city and state'),



8

}),



9

execute: async ({ location }) => {



10

return `The weather in ${location} is sunny.`;



11

},



12

};



13



14

// Infer the types from the tool



15

type WeatherUITool = InferUITool<typeof weatherTool>;



16

// This creates a type with:



17

// {



18

//   input: { location: string };



19

//   output: string;



20

// }
```

### [InferUITools](#inferuitools)

The `InferUITools` type helper infers the input and output types of a `ToolSet`:

```
1

import { InferUITools, ToolSet } from 'ai';



2

import { z } from 'zod';



3



4

const tools = {



5

weather: {



6

description: 'Get the current weather',



7

inputSchema: z.object({



8

location: z.string().describe('The city and state'),



9

}),



10

execute: async ({ location }) => {



11

return `The weather in ${location} is sunny.`;



12

},



13

},



14

calculator: {



15

description: 'Perform basic arithmetic',



16

inputSchema: z.object({



17

operation: z.enum(['add', 'subtract', 'multiply', 'divide']),



18

a: z.number(),



19

b: z.number(),



20

}),



21

execute: async ({ operation, a, b }) => {



22

switch (operation) {



23

case 'add':



24

return a + b;



25

case 'subtract':



26

return a - b;



27

case 'multiply':



28

return a * b;



29

case 'divide':



30

return a / b;



31

}



32

},



33

},



34

} satisfies ToolSet;



35



36

// Infer the types from the tool set



37

type MyUITools = InferUITools<typeof tools>;



38

// This creates a type with:



39

// {



40

//   weather: { input: { location: string }; output: string };



41

//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };



42

// }
```

### [Using Inferred Types](#using-inferred-types)

You can use these inferred types to create a custom UIMessage type and pass it to various AI SDK UI functions:

```
1

import { InferUITools, UIMessage, UIDataTypes } from 'ai';



2



3

type MyUITools = InferUITools<typeof tools>;



4

type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;
```

Pass the custom type to `useChat` or `createUIMessageStream`:

```
1

import { useChat } from '@ai-sdk/react';



2

import { createUIMessageStream } from 'ai';



3

import type { MyUIMessage } from './types';



4



5

// With useChat



6

const { messages } = useChat<MyUIMessage>();



7



8

// With createUIMessageStream



9

const stream = createUIMessageStream<MyUIMessage>(/* ... */);
```

This provides full type safety for tool inputs and outputs on the client and server.

[Previous

Overview](/docs/ai-sdk-ui/overview)[Next

Chatbot Message Persistence](/docs/ai-sdk-ui/chatbot-message-persistence)
