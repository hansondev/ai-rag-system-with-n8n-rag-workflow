---
title: "Migrating from RSC to UI"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/migrating-to-ui
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Migrating from RSC to UI

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/migrating-to-ui

[AI SDK RSC](/docs/ai-sdk-rsc)Migrating from RSC to UI


[Migrating from RSC to UI](#migrating-from-rsc-to-ui)
=====================================================

This guide helps you migrate from AI SDK RSC to AI SDK UI.

[Background](#background)
-------------------------

The AI SDK has two packages that help you build the frontend for your applications – [AI SDK UI](/docs/ai-sdk-ui) and [AI SDK RSC](/docs/ai-sdk-rsc).

We introduced support for using [React Server Components](https://react.dev/reference/rsc/server-components) (RSC) within the AI SDK to simplify building generative user interfaces for frameworks that support RSC.

However, given we're pushing the boundaries of this technology, AI SDK RSC currently faces significant limitations that make it unsuitable for stable production use.

* It is not possible to abort a stream using server actions. This will be improved in future releases of React and Next.js [(1122)](https://github.com/vercel/ai/issues/1122).
* When using `createStreamableUI` and `streamUI`, components remount on `.done()`, causing them to flicker [(2939)](https://github.com/vercel/ai/issues/2939).
* Many suspense boundaries can lead to crashes [(2843)](https://github.com/vercel/ai/issues/2843).
* Using `createStreamableUI` can lead to quadratic data transfer. You can avoid this using createStreamableValue instead, and rendering the component client-side.
* Closed RSC streams cause update issues [(3007)](https://github.com/vercel/ai/issues/3007).

Due to these limitations, AI SDK RSC is marked as experimental, and we do not recommend using it for stable production environments.

As a result, we strongly recommend migrating to AI SDK UI, which has undergone extensive development to provide a more stable and production grade experience.

In building [v0](https://v0.dev), we have invested considerable time exploring how to create the best chat experience on the web. AI SDK UI ships with many of these best practices and commonly used patterns like [language model middleware](/docs/ai-sdk-core/middleware), [multi-step tool calls](/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls-using-stopwhen), [attachments](/docs/ai-sdk-ui/chatbot#attachments), [telemetry](/docs/ai-sdk-core/telemetry), [provider registry](/docs/ai-sdk-core/provider-management#provider-registry), and many more. These features have been considerately designed into a neat abstraction that you can use to reliably integrate AI into your applications.

[Streaming Chat Completions](#streaming-chat-completions)
---------------------------------------------------------

### [Basic Setup](#basic-setup)

The `streamUI` function executes as part of a server action as illustrated below.

#### [Before: Handle generation and rendering in a single server action](#before-handle-generation-and-rendering-in-a-single-server-action)

@/app/actions.tsx

```
1

import { openai } from '@ai-sdk/openai';



2

import { getMutableAIState, streamUI } from '@ai-sdk/rsc';



3



4

export async function sendMessage(message: string) {



5

'use server';



6



7

const messages = getMutableAIState('messages');



8



9

messages.update([...messages.get(), { role: 'user', content: message }]);



10



11

const { value: stream } = await streamUI({



12

model: openai('gpt-4o'),



13

instructions: 'you are a friendly assistant!',



14

messages: messages.get(),



15

text: async function* ({ content, done }) {



16

// process text



17

},



18

tools: {



19

// tool definitions



20

},



21

});



22



23

return stream;



24

}
```

#### [Before: Call server action and update UI state](#before-call-server-action-and-update-ui-state)

The chat interface calls the server action. The response is then saved using the `useUIState` hook.

@/app/page.tsx

```
1

'use client';



2



3

import { useState, ReactNode } from 'react';



4

import { useActions, useUIState } from '@ai-sdk/rsc';



5



6

export default function Page() {



7

const { sendMessage } = useActions();



8

const [input, setInput] = useState('');



9

const [messages, setMessages] = useUIState();



10



11

return (



12

<div>



13

{messages.map(message => message)}



14



15

<form



16

onSubmit={async () => {



17

const response: ReactNode = await sendMessage(input);



18

setMessages(msgs => [...msgs, response]);



19

}}



20

>



21

<input type="text" />



22

<button type="submit">Submit</button>



23

</form>



24

</div>



25

);



26

}
```

The `streamUI` function combines generating text and rendering the user interface. To migrate to AI SDK UI, you need to **separate these concerns** – streaming generations with `streamText` and rendering the UI with `useChat`.

#### [After: Replace server action with route handler](#after-replace-server-action-with-route-handler)

The `streamText` function executes as part of a route handler and streams the response to the client. The `useChat` hook on the client decodes this stream and renders the response within the chat interface.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

@/app/api/chat/route.ts

```
1

import {



2

createUIMessageStreamResponse,



3

streamText,



4

toUIMessageStream,



5

} from 'ai';



6

import { openai } from '@ai-sdk/openai';



7



8

export async function POST(request) {



9

const { messages } = await request.json();



10



11

const result = streamText({



12

model: "xai/grok-4.6",



13

instructions: 'you are a friendly assistant!',



14

messages,



15

tools: {



16

// tool definitions



17

},



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

#### [After: Update client to use chat hook](#after-update-client-to-use-chat-hook)

@/app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4



5

export default function Page() {



6

const { messages, input, setInput, handleSubmit } = useChat();



7



8

return (



9

<div>



10

{messages.map(message => (



11

<div key={message.id}>



12

<div>{message.role}</div>



13

<div>{message.content}</div>



14

</div>



15

))}



16



17

<form onSubmit={handleSubmit}>



18

<input



19

type="text"



20

value={input}



21

onChange={event => {



22

setInput(event.target.value);



23

}}



24

/>



25

<button type="submit">Send</button>



26

</form>



27

</div>



28

);



29

}
```

### [Parallel Tool Calls](#parallel-tool-calls)

In AI SDK RSC, `streamUI` does not support parallel tool calls. You will have to use a combination of `streamText`, `createStreamableUI` and `createStreamableValue`.

With AI SDK UI, `useChat` comes with built-in support for parallel tool calls. You can define multiple tools in the `streamText` and have them called them in parallel. The `useChat` hook will then handle the parallel tool calls for you automatically.

### [Multi-Step Tool Calls](#multi-step-tool-calls)

In AI SDK RSC, `streamUI` does not support multi-step tool calls. You will have to use a combination of `streamText`, `createStreamableUI` and `createStreamableValue`.

With AI SDK UI, `useChat` comes with built-in support for multi-step tool calls. You can set `stopWhen` in the `streamText` function to define when the model should stop making tool calls. The `useChat` hook will then handle the multi-step tool calls for you automatically.

### [Generative User Interfaces](#generative-user-interfaces)

The `streamUI` function uses `tools` as a way to execute functions based on user input and renders React components based on the function output to go beyond text in the chat interface.

#### [Before: Render components within the server action and stream to client](#before-render-components-within-the-server-action-and-stream-to-client)

@/app/actions.tsx

```
1

import { z } from 'zod';



2

import { streamUI } from '@ai-sdk/rsc';



3

import { openai } from '@ai-sdk/openai';



4

import { getWeather } from '@/utils/queries';



5

import { Weather } from '@/components/weather';



6



7

const { value: stream } = await streamUI({



8

model: openai('gpt-4o'),



9

instructions: 'you are a friendly assistant!',



10

messages,



11

text: async function* ({ content, done }) {



12

// process text



13

},



14

tools: {



15

displayWeather: {



16

description: 'Display the weather for a location',



17

inputSchema: z.object({



18

latitude: z.number(),



19

longitude: z.number(),



20

}),



21

generate: async function* ({ latitude, longitude }) {



22

yield <div>Loading weather...</div>;



23



24

const { value, unit } = await getWeather({ latitude, longitude });



25



26

return <Weather value={value} unit={unit} />;



27

},



28

},



29

},



30

});
```

As mentioned earlier, `streamUI` generates text and renders the React component in a single server action call.

#### [After: Replace with route handler and stream props data to client](#after-replace-with-route-handler-and-stream-props-data-to-client)

The `streamText` function streams the props data as response to the client, while `useChat` decode the stream as `toolInvocations` and renders the chat interface.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

@/app/api/chat/route.ts

```
1

import { z } from 'zod';



2

import { openai } from '@ai-sdk/openai';



3

import { getWeather } from '@/utils/queries';



4

import {



5

createUIMessageStreamResponse,



6

streamText,



7

toUIMessageStream,



8

} from 'ai';



9



10

export async function POST(request) {



11

const { messages } = await request.json();



12



13

const result = streamText({



14

model: "xai/grok-4.6",



15

instructions: 'you are a friendly assistant!',



16

messages,



17

tools: {



18

displayWeather: {



19

description: 'Display the weather for a location',



20

inputSchema: z.object({



21

latitude: z.number(),



22

longitude: z.number(),



23

}),



24

execute: async function ({ latitude, longitude }) {



25

const props = await getWeather({ latitude, longitude });



26

return props;



27

},



28

},



29

},



30

});



31



32

return createUIMessageStreamResponse({



33

stream: toUIMessageStream({ stream: result.stream }),



34

});



35

}
```

#### [After: Update client to use chat hook and render components using tool invocations](#after-update-client-to-use-chat-hook-and-render-components-using-tool-invocations)

@/app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { Weather } from '@/components/weather';



5



6

export default function Page() {



7

const { messages, input, setInput, handleSubmit } = useChat();



8



9

return (



10

<div>



11

{messages.map(message => (



12

<div key={message.id}>



13

<div>{message.role}</div>



14

<div>{message.content}</div>



15



16

<div>



17

{message.toolInvocations.map(toolInvocation => {



18

const { toolName, toolCallId, state } = toolInvocation;



19



20

if (state === 'result') {



21

const { result } = toolInvocation;



22



23

return (



24

<div key={toolCallId}>



25

{toolName === 'displayWeather' ? (



26

<Weather weatherAtLocation={result} />



27

) : null}



28

</div>



29

);



30

} else {



31

return (



32

<div key={toolCallId}>



33

{toolName === 'displayWeather' ? (



34

<div>Loading weather...</div>



35

) : null}



36

</div>



37

);



38

}



39

})}



40

</div>



41

</div>



42

))}



43



44

<form onSubmit={handleSubmit}>



45

<input



46

type="text"



47

value={input}



48

onChange={event => {



49

setInput(event.target.value);



50

}}



51

/>



52

<button type="submit">Send</button>



53

</form>



54

</div>



55

);



56

}
```

### [Handling Client Interactions](#handling-client-interactions)

With AI SDK RSC, components streamed to the client can trigger subsequent generations by calling the relevant server action using the `useActions` hooks. This is possible as long as the component is a descendant of the `<AI/>` context provider.

#### [Before: Use actions hook to send messages](#before-use-actions-hook-to-send-messages)

@/app/components/list-flights.tsx

```
1

'use client';



2



3

import { useActions, useUIState } from '@ai-sdk/rsc';



4



5

export function ListFlights({ flights }) {



6

const { sendMessage } = useActions();



7

const [_, setMessages] = useUIState();



8



9

return (



10

<div>



11

{flights.map(flight => (



12

<div



13

key={flight.id}



14

onClick={async () => {



15

const response = await sendMessage(



16

`I would like to choose flight ${flight.id}!`,



17

);



18



19

setMessages(msgs => [...msgs, response]);



20

}}



21

>



22

{flight.name}



23

</div>



24

))}



25

</div>



26

);



27

}
```

#### [After: Use another chat hook with same ID from the component](#after-use-another-chat-hook-with-same-id-from-the-component)

After switching to AI SDK UI, these messages are synced by initializing the `useChat` hook in the component with the same `id` as the parent component.

@/app/components/list-flights.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4



5

export function ListFlights({ chatId, flights }) {



6

const { append } = useChat({



7

id: chatId,



8

body: { id: chatId },



9

});



10



11

return (



12

<div>



13

{flights.map(flight => (



14

<div



15

key={flight.id}



16

onClick={async () => {



17

await append({



18

role: 'user',



19

content: `I would like to choose flight ${flight.id}!`,



20

});



21

}}



22

>



23

{flight.name}



24

</div>



25

))}



26

</div>



27

);



28

}
```

### [Loading Indicators](#loading-indicators)

In AI SDK RSC, you can use the `initial` parameter of `streamUI` to define the component to display while the generation is in progress.

#### [Before: Use `loading` to show loading indicator](#before-use-loading-to-show-loading-indicator)

@/app/actions.tsx

```
1

import { openai } from '@ai-sdk/openai';



2

import { streamUI } from '@ai-sdk/rsc';



3



4

const { value: stream } = await streamUI({



5

model: openai('gpt-4o'),



6

instructions: 'you are a friendly assistant!',



7

messages,



8

initial: <div>Loading...</div>,



9

text: async function* ({ content, done }) {



10

// process text



11

},



12

tools: {



13

// tool definitions



14

},



15

});



16



17

return stream;
```

With AI SDK UI, you can use the tool invocation state to show a loading indicator while the tool is executing.

#### [After: Use tool invocation state to show loading indicator](#after-use-tool-invocation-state-to-show-loading-indicator)

@/app/components/message.tsx

```
1

'use client';



2



3

export function Message({ role, content, toolInvocations }) {



4

return (



5

<div>



6

<div>{role}</div>



7

<div>{content}</div>



8



9

{toolInvocations && (



10

<div>



11

{toolInvocations.map(toolInvocation => {



12

const { toolName, toolCallId, state } = toolInvocation;



13



14

if (state === 'result') {



15

const { result } = toolInvocation;



16



17

return (



18

<div key={toolCallId}>



19

{toolName === 'getWeather' ? (



20

<Weather weatherAtLocation={result} />



21

) : null}



22

</div>



23

);



24

} else {



25

return (



26

<div key={toolCallId}>



27

{toolName === 'getWeather' ? (



28

<Weather isLoading={true} />



29

) : (



30

<div>Loading...</div>



31

)}



32

</div>



33

);



34

}



35

})}



36

</div>



37

)}



38

</div>



39

);



40

}
```

### [Saving Chats](#saving-chats)

Before implementing `streamUI` as a server action, you should create an `<AI/>` provider and wrap your application at the root layout to sync the AI and UI states. During initialization, you typically use the `onSetAIState` callback function to track updates to the AI state and save it to the database when `done(...)` is called.

#### [Before: Save chats using callback function of context provider](#before-save-chats-using-callback-function-of-context-provider)

@/app/actions.ts

```
1

import { createAI } from '@ai-sdk/rsc';



2

import { saveChat } from '@/utils/queries';



3



4

export const AI = createAI({



5

initialAIState: {},



6

initialUIState: {},



7

actions: {



8

// server actions



9

},



10

onSetAIState: async ({ state, done }) => {



11

'use server';



12



13

if (done) {



14

await saveChat(state);



15

}



16

},



17

});
```

#### [After: Save chats using callback function of `streamText`](#after-save-chats-using-callback-function-of-streamtext)

With AI SDK UI, you will save chats using the `onEnd` callback function of `streamText` in your route handler.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

@/app/api/chat/route.ts

```
1

import { openai } from '@ai-sdk/openai';



2

import { saveChat } from '@/utils/queries';



3

import {



4

createUIMessageStreamResponse,



5

streamText,



6

toUIMessageStream,



7

convertToModelMessages,



8

} from 'ai';



9



10

export async function POST(request) {



11

const { id, messages } = await request.json();



12



13

const coreMessages = await convertToModelMessages(messages);



14



15

const result = streamText({



16

model: "xai/grok-4.6",



17

instructions: 'you are a friendly assistant!',



18

messages: coreMessages,



19

onEnd: async ({ responseMessages }) => {



20

try {



21

await saveChat({



22

id,



23

messages: [...coreMessages, ...responseMessages],



24

});



25

} catch (error) {



26

console.error('Failed to save chat');



27

}



28

},



29

});



30



31

return createUIMessageStreamResponse({



32

stream: toUIMessageStream({ stream: result.stream }),



33

});



34

}
```

### [Restoring Chats](#restoring-chats)

When using AI SDK RSC, the `useUIState` hook contains the UI state of the chat. When restoring a previously saved chat, the UI state needs to be loaded with messages.

Similar to how you typically save chats in AI SDK RSC, you should use the `onGetUIState` callback function to retrieve the chat from the database, convert it into UI state, and return it to be accessible through `useUIState`.

#### [Before: Load chat from database using callback function of context provider](#before-load-chat-from-database-using-callback-function-of-context-provider)

@/app/actions.ts

```
1

import { createAI } from '@ai-sdk/rsc';



2

import { loadChatFromDB, convertToUIState } from '@/utils/queries';



3



4

export const AI = createAI({



5

actions: {



6

// server actions



7

},



8

onGetUIState: async () => {



9

'use server';



10



11

const chat = await loadChatFromDB();



12

const uiState = convertToUIState(chat);



13



14

return uiState;



15

},



16

});
```

AI SDK UI uses the `messages` field of `useChat` to store messages. To load messages when `useChat` is mounted, you should use `initialMessages`.

As messages are typically loaded from the database, we can use a server actions inside a Page component to fetch an older chat from the database during static generation and pass the messages as props to the `<Chat/>` component.

#### [After: Load chat from database during static generation of page](#after-load-chat-from-database-during-static-generation-of-page)

@/app/chat/[id]/page.tsx

```
1

import { Chat } from '@/app/components/chat';



2

import { getChatById } from '@/utils/queries';



3



4

// link to example implementation: https://github.com/vercel/ai-chatbot/blob/00b125378c998d19ef60b73fe576df0fe5a0e9d4/lib/utils.ts#L87-L127



5

import { convertToUIMessages } from '@/utils/functions';



6



7

export default async function Page({ params }: { params: any }) {



8

const { id } = params;



9

const chatFromDb = await getChatById({ id });



10



11

const chat: Chat = {



12

...chatFromDb,



13

messages: convertToUIMessages(chatFromDb.messages),



14

};



15



16

return <Chat key={id} id={chat.id} initialMessages={chat.messages} />;



17

}
```

#### [After: Pass chat messages as props and load into chat hook](#after-pass-chat-messages-as-props-and-load-into-chat-hook)

@/app/components/chat.tsx

```
1

'use client';



2



3

import { Message } from 'ai';



4

import { useChat } from '@ai-sdk/react';



5



6

export function Chat({



7

id,



8

initialMessages,



9

}: {



10

id;



11

initialMessages: Array<Message>;



12

}) {



13

const { messages } = useChat({



14

id,



15

initialMessages,



16

});



17



18

return (



19

<div>



20

{messages.map(message => (



21

<div key={message.id}>



22

<div>{message.role}</div>



23

<div>{message.content}</div>



24

</div>



25

))}



26

</div>



27

);



28

}
```

[Streaming Object Generation](#streaming-object-generation)
-----------------------------------------------------------

The `createStreamableValue` function streams any serializable data from the server to the client. As a result, this function allows you to stream object generations from the server to the client when paired with `streamText` and `Output`.

#### [Before: Use streamable value to stream object generations](#before-use-streamable-value-to-stream-object-generations)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

@/app/actions.ts

```
1

import { Output, streamText } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { createStreamableValue } from '@ai-sdk/rsc';



4

import { notificationsSchema } from '@/utils/schemas';



5



6

export async function generateSampleNotifications() {



7

'use server';



8



9

const stream = createStreamableValue();



10



11

(async () => {



12

const { partialOutputStream } = streamText({



13

model: "xai/grok-4.6",



14

instructions: 'generate sample ios messages for testing',



15

prompt: 'messages from a family group chat during diwali, max 4',



16

output: Output.object({ schema: notificationsSchema }),



17

});



18



19

for await (const partialObject of partialOutputStream) {



20

stream.update(partialObject);



21

}



22

})();



23



24

stream.done();



25



26

return { partialNotificationsStream: stream.value };



27

}
```

#### [Before: Read streamable value and update object](#before-read-streamable-value-and-update-object)

@/app/page.tsx

```
1

'use client';



2



3

import { useState } from 'react';



4

import { readStreamableValue } from '@ai-sdk/rsc';



5

import { generateSampleNotifications } from '@/app/actions';



6



7

export default function Page() {



8

const [notifications, setNotifications] = useState(null);



9



10

return (



11

<div>



12

<button



13

onClick={async () => {



14

const { partialNotificationsStream } =



15

await generateSampleNotifications();



16



17

for await (const partialNotifications of readStreamableValue(



18

partialNotificationsStream,



19

)) {



20

if (partialNotifications) {



21

setNotifications(partialNotifications.notifications);



22

}



23

}



24

}}



25

>



26

Generate



27

</button>



28

</div>



29

);



30

}
```

To migrate to AI SDK UI, you should use the `useObject` hook and implement `streamText` with `Output` within your route handler.

#### [After: Replace with route handler and stream text response](#after-replace-with-route-handler-and-stream-text-response)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

@/app/api/object/route.ts

```
1

import { Output, createTextStreamResponse, streamText, toTextStream } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { notificationSchema } from '@/utils/schemas';



4



5

export async function POST(req: Request) {



6

const context = await req.json();



7



8

const result = streamText({



9

model: "xai/grok-4.6",



10

output: Output.object({ schema: notificationSchema }),



11

prompt:



12

`Generate 3 notifications for a messages app in this context:` + context,



13

});



14



15

return createTextStreamResponse({



16

stream: toTextStream({ stream: result.stream }),



17

});



18

}
```

#### [After: Use object hook to decode stream and update object](#after-use-object-hook-to-decode-stream-and-update-object)

@/app/page.tsx

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4

import { notificationSchema } from '@/utils/schemas';



5



6

export default function Page() {



7

const { object, submit } = useObject({



8

api: '/api/object',



9

schema: notificationSchema,



10

});



11



12

return (



13

<div>



14

<button onClick={() => submit('Messages during finals week.')}>



15

Generate notifications



16

</button>



17



18

{object?.notifications?.map((notification, index) => (



19

<div key={index}>



20

<p>{notification?.name}</p>



21

<p>{notification?.message}</p>



22

</div>



23

))}



24

</div>



25

);



26

}
```

[Previous

Handling Authentication](/docs/ai-sdk-rsc/authentication)[Next

Advanced](/docs/advanced)
