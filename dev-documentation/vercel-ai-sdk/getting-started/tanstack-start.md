---
title: "TanStack Start Quickstart"
source_url: https://ai-sdk.dev/docs/getting-started/tanstack-start
section: getting-started
crawled: 2026-09-20
---

# TanStack Start Quickstart

> Source: https://ai-sdk.dev/docs/getting-started/tanstack-start

[Getting Started](/docs/getting-started)TanStack Start


[TanStack Start Quickstart](#tanstack-start-quickstart)
=======================================================

The AI SDK is a powerful TypeScript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple agent with a streaming chat user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the AI SDK in your own projects.

If you are unfamiliar with the concepts of [Prompt Engineering](/docs/advanced/prompt-engineering) and [HTTP Streaming](/docs/foundations/streaming), you can optionally read these documents first.

[Prerequisites](#prerequisites)
-------------------------------

To follow this quickstart, you'll need:

* Node.js 22+ and pnpm installed on your local development machine.
* A  [Vercel AI Gateway](https://vercel.com/ai-gateway)  API key.

If you haven't obtained your Vercel AI Gateway API key, you can do so by [signing up](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway) on the Vercel website.

[Create Your Application](#create-your-application)
---------------------------------------------------

Start by creating a new TanStack Start application. This command will create a new directory named `my-ai-app` and set up a basic TanStack Start application inside it.

```
pnpm create @tanstack/start@latest my-ai-app
```

Navigate to the newly created directory:

```
cd my-ai-app
```

### [Install dependencies](#install-dependencies)

Install `ai` and `@ai-sdk/react`, the AI package and AI SDK's React hooks. The AI SDK's  [Vercel AI Gateway provider](/providers/ai-sdk-providers/ai-gateway)  ships with the `ai` package. You'll also install `zod`, a schema validation library used for defining tool inputs.

This guide uses the Vercel AI Gateway provider so you can access hundreds of
models from different providers with one API key, but you can switch to any
provider or model by installing its package. Check out available [AI SDK
providers](/providers/ai-sdk-providers) for more information.

pnpmnpmbunyarn

```
pnpm add ai @ai-sdk/react zod
```

### [Configure your AI Gateway API key](#configure-your-ai-gateway-api-key)

Create a `.env` file in your project root and add your AI Gateway API key. This key authenticates your application with Vercel AI Gateway.

```
touch .env
```

Edit the `.env` file:

.env

```
1

AI_GATEWAY_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual Vercel AI Gateway API key.

The AI SDK's Vercel AI Gateway Provider will default to using the
`AI_GATEWAY_API_KEY` environment variable.

[Create a Route Handler](#create-a-route-handler)
-------------------------------------------------

Create a route handler, `src/routes/api/chat.ts` and add the following code:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

src/routes/api/chat.ts

```
1

import {



2

streamText,



3

UIMessage,



4

convertToModelMessages,



5

createUIMessageStreamResponse,



6

toUIMessageStream,



7

} from 'ai';



8

import { createFileRoute } from '@tanstack/react-router';



9



10

export const Route = createFileRoute('/api/chat')({



11

server: {



12

handlers: {



13

POST: async ({ request }) => {



14

const { messages }: { messages: UIMessage[] } = await request.json();



15



16

const result = streamText({



17

model: "xai/grok-4.6",



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

},



25

},



26

},



27

});
```

Let's take a look at what is happening in this code:

1. Define an asynchronous `POST` request handler using TanStack Start's server routes and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation. The `messages` are of UIMessage type, which are designed for use in application UI - they contain the entire message history and associated metadata like timestamps.
2. Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider and `messages` (defined in step 1). You can pass additional [settings](/docs/ai-sdk-core/settings) to further customize the model's behavior. The `messages` key expects a `ModelMessage[]` array. This type is different from `UIMessage` in that it does not include metadata, such as timestamps or sender information. To convert between these types, we use the `convertToModelMessages` function, which strips the UI-specific metadata and transforms the `UIMessage[]` array into the `ModelMessage[]` format that the model expects.
3. The `streamText` function returns a [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text#result-object). Pass its `stream` to `toUIMessageStream` and return it with `createUIMessageStreamResponse` to create a streamed response object.
4. Finally, return the result to the client to stream the response.

This Route Handler creates a POST request endpoint at `/api/chat`.

[Choosing a Provider](#choosing-a-provider)
-------------------------------------------

The AI SDK supports dozens of model providers through [first-party](/providers/ai-sdk-providers), [OpenAI-compatible](/providers/openai-compatible-providers), and  [community](/providers/community-providers)  packages.

This quickstart uses the [Vercel AI Gateway](https://vercel.com/ai-gateway) provider, which is the default [global provider](/docs/ai-sdk-core/provider-management#global-provider-configuration). This means you can access models using a simple string in the model configuration:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

model: "xai/grok-4.6";
```

You can also explicitly import and use the gateway provider in two other equivalent ways:

```
1

// Option 1: Import from 'ai' package (included by default)



2

import { gateway } from 'ai';



3

model: gateway('anthropic/claude-sonnet-4.5');



4



5

// Option 2: Install and import from '@ai-sdk/gateway' package



6

import { gateway } from '@ai-sdk/gateway';



7

model: gateway('anthropic/claude-sonnet-4.5');
```

### [Using other providers](#using-other-providers)

To use a different provider, install its package and create a provider instance. For example, to use OpenAI directly:

pnpmnpmbunyarn

```
pnpm add @ai-sdk/openai
```

```
1

import { openai } from '@ai-sdk/openai';



2



3

model: openai('gpt-5.1');
```

#### [Updating the global provider](#updating-the-global-provider)

You can change the default global provider so string model references use your preferred provider everywhere in your application. Learn more about [provider management](/docs/ai-sdk-core/provider-management#global-provider-configuration).

Pick the approach that best matches how you want to manage providers across your application.

[Wire up the UI](#wire-up-the-ui)
---------------------------------

Now that you have a Route Handler that can query an LLM, it's time to setup your frontend. The AI SDK's  [UI](/docs/ai-sdk-ui)  package abstracts the complexity of a chat interface into one hook, [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Update your index route (`src/routes/index.tsx`) with the following code to show a list of chat messages and provide a user message input:

src/routes/index.tsx

```
1

import { createFileRoute } from '@tanstack/react-router';



2

import { useChat } from '@ai-sdk/react';



3

import { useState } from 'react';



4



5

export const Route = createFileRoute('/')({



6

component: Chat,



7

});



8



9

function Chat() {



10

const [input, setInput] = useState('');



11

const { messages, sendMessage } = useChat();



12

return (



13

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



14

{messages.map(message => (



15

<div key={message.id} className="whitespace-pre-wrap">



16

{message.role === 'user' ? 'User: ' : 'AI: '}



17

{message.parts.map((part, i) => {



18

switch (part.type) {



19

case 'text':



20

return <div key={`${message.id}-${i}`}>{part.text}</div>;



21

}



22

})}



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

sendMessage({ text: input });



30

setInput('');



31

}}



32

>



33

<input



34

className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"



35

value={input}



36

placeholder="Say something..."



37

onChange={e => setInput(e.currentTarget.value)}



38

/>



39

</form>



40

</div>



41

);



42

}
```

This page utilizes the `useChat` hook, which will, by default, use the `POST` API route you created earlier (`/api/chat`). The hook provides functions and state for handling user input and form submission. The `useChat` hook provides multiple utility functions and state variables:

* `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
* `sendMessage` - a function to send a message to the chat API.

The component uses local state (`useState`) to manage the input field value, and handles form submission by calling `sendMessage` with the input text and then clearing the input field.

The LLM's response is accessed through the message `parts` array. Each message contains an ordered array of `parts` that represents everything the model generated in its response. These parts can include plain text, reasoning tokens, and more that you will see later. The `parts` array preserves the sequence of the model's outputs, allowing you to display or process each component in the order it was generated.

[Running Your Application](#running-your-application)
-----------------------------------------------------

With that, you have built everything you need for your chatbot! To start your application, use the command:

```
pnpm run dev
```

Head to your browser and open <http://localhost:3000>. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! The AI SDK makes it fast and easy to build AI chat interfaces with TanStack Start.

[Enhance Your Chatbot with Tools](#enhance-your-chatbot-with-tools)
-------------------------------------------------------------------

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](/docs/ai-sdk-core/tools-and-tool-calling) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the model would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your chatbot by adding a simple weather tool.

### [Update Your Route Handler](#update-your-route-handler)

Modify your `src/routes/api/chat.ts` file to include the new weather tool:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

src/routes/api/chat.ts

```
1

import {



2

streamText,



3

UIMessage,



4

convertToModelMessages,



5

tool,



6

createUIMessageStreamResponse,



7

toUIMessageStream,



8

} from 'ai';



9

import { createFileRoute } from '@tanstack/react-router';



10

import { z } from 'zod';



11



12

export const Route = createFileRoute('/api/chat')({



13

server: {



14

handlers: {



15

POST: async ({ request }) => {



16

const { messages }: { messages: UIMessage[] } = await request.json();



17



18

const result = streamText({



19

model: "xai/grok-4.6",



20

messages: await convertToModelMessages(messages),



21

tools: {



22

weather: tool({



23

description: 'Get the weather in a location (fahrenheit)',



24

inputSchema: z.object({



25

location: z



26

.string()



27

.describe('The location to get the weather for'),



28

}),



29

execute: async ({ location }) => {



30

const temperature = Math.round(Math.random() * (90 - 32) + 32);



31

return {



32

location,



33

temperature,



34

};



35

},



36

}),



37

},



38

});



39



40

return createUIMessageStreamResponse({



41

stream: toUIMessageStream({ stream: result.stream }),



42

});



43

},



44

},



45

},



46

});
```

In this updated code:

1. You import the `tool` function from the `ai` package and `z` from `zod` for schema validation.
2. You define a `tools` object with a `weather` tool. This tool:
   * Has a description that helps the model understand when to use it.
   * Defines `inputSchema` using a Zod schema, specifying that it requires a `location` string to execute this tool. The model will attempt to extract this input from the context of the conversation. If it can't, it will ask the user for the missing information.
   * Defines an `execute` function that simulates getting weather data (in this case, it returns a random temperature). This is an asynchronous function running on the server so you can fetch real data from an external API.

Now your chatbot can "fetch" weather information for any location the user asks about. When the model determines it needs to use the weather tool, it will generate a tool call with the necessary input. The `execute` function will then be automatically run, and the tool output will be added to the `messages` as a `tool` message.

Try asking something like "What's the weather in New York?" and see how the model uses the new tool.

Notice the blank response in the UI? This is because instead of generating a text response, the model generated a tool call. You can access the tool call and subsequent tool result on the client via the `tool-weather` part of the `message.parts` array.

Tool parts are always named `tool-{toolName}`, where `{toolName}` is the key
you used when defining the tool. In this case, since we defined the tool as
`weather`, the part type is `tool-weather`.

### [Update the UI](#update-the-ui)

To display the tool invocation in your UI, update your `src/routes/index.tsx` file:

src/routes/index.tsx

```
1

import { createFileRoute } from '@tanstack/react-router';



2

import { useChat } from '@ai-sdk/react';



3

import { useState } from 'react';



4



5

export const Route = createFileRoute('/')({



6

component: Chat,



7

});



8



9

function Chat() {



10

const [input, setInput] = useState('');



11

const { messages, sendMessage } = useChat();



12

return (



13

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



14

{messages.map(message => (



15

<div key={message.id} className="whitespace-pre-wrap">



16

{message.role === 'user' ? 'User: ' : 'AI: '}



17

{message.parts.map((part, i) => {



18

switch (part.type) {



19

case 'text':



20

return <div key={`${message.id}-${i}`}>{part.text}</div>;



21

case 'tool-weather':



22

return (



23

<pre key={`${message.id}-${i}`}>



24

{JSON.stringify(part, null, 2)}



25

</pre>



26

);



27

}



28

})}



29

</div>



30

))}



31



32

<form



33

onSubmit={e => {



34

e.preventDefault();



35

sendMessage({ text: input });



36

setInput('');



37

}}



38

>



39

<input



40

className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"



41

value={input}



42

placeholder="Say something..."



43

onChange={e => setInput(e.currentTarget.value)}



44

/>



45

</form>



46

</div>



47

);



48

}
```

With this change, you're updating the UI to handle different message parts. For text parts, you display the text content as before. For weather tool invocations, you display a JSON representation of the tool call and its result.

Now, when you ask about the weather, you'll see the tool call and its result displayed in your chat interface.

[Enabling Multi-Step Tool Calls](#enabling-multi-step-tool-calls)
-----------------------------------------------------------------

You may have noticed that while the tool is now visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. By default, `stopWhen` is set to `isStepCount(1)`, which means generation stops after the first step when there are tool results. By changing this condition, you can allow the model to automatically send tool results back to itself to trigger additional generations until your specified stopping condition is met. In this case, you want the model to continue generating so it can use the weather tool results to answer your original question.

### [Update Your Route Handler](#update-your-route-handler-1)

Modify your `src/routes/api/chat.ts` file to include the `stopWhen` condition:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

src/routes/api/chat.ts

```
1

import {



2

streamText,



3

UIMessage,



4

convertToModelMessages,



5

tool,



6

isStepCount,



7

createUIMessageStreamResponse,



8

toUIMessageStream,



9

} from 'ai';



10

import { createFileRoute } from '@tanstack/react-router';



11

import { z } from 'zod';



12



13

export const Route = createFileRoute('/api/chat')({



14

server: {



15

handlers: {



16

POST: async ({ request }) => {



17

const { messages }: { messages: UIMessage[] } = await request.json();



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages: await convertToModelMessages(messages),



22

stopWhen: isStepCount(5),



23

tools: {



24

weather: tool({



25

description: 'Get the weather in a location (fahrenheit)',



26

inputSchema: z.object({



27

location: z



28

.string()



29

.describe('The location to get the weather for'),



30

}),



31

execute: async ({ location }) => {



32

const temperature = Math.round(Math.random() * (90 - 32) + 32);



33

return {



34

location,



35

temperature,



36

};



37

},



38

}),



39

},



40

});



41



42

return createUIMessageStreamResponse({



43

stream: toUIMessageStream({ stream: result.stream }),



44

});



45

},



46

},



47

},



48

});
```

In this updated code, you set `stopWhen` to be when `isStepCount(5)`, allowing the model to use up to 5 "steps" for any given generation.

Head back to the browser and ask about the weather in a location. You should now see the model using the weather tool results to answer your question.

By setting `stopWhen: isStepCount(5)`, you're allowing the model to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the model to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Celsius to Fahrenheit.

### [Add another tool](#add-another-tool)

Update your `src/routes/api/chat.ts` file to add a new tool to convert the temperature from Fahrenheit to Celsius:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

src/routes/api/chat.ts

```
1

import {



2

streamText,



3

UIMessage,



4

convertToModelMessages,



5

tool,



6

isStepCount,



7

createUIMessageStreamResponse,



8

toUIMessageStream,



9

} from 'ai';



10

import { createFileRoute } from '@tanstack/react-router';



11

import { z } from 'zod';



12



13

export const Route = createFileRoute('/api/chat')({



14

server: {



15

handlers: {



16

POST: async ({ request }) => {



17

const { messages }: { messages: UIMessage[] } = await request.json();



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages: await convertToModelMessages(messages),



22

stopWhen: isStepCount(5),



23

tools: {



24

weather: tool({



25

description: 'Get the weather in a location (fahrenheit)',



26

inputSchema: z.object({



27

location: z



28

.string()



29

.describe('The location to get the weather for'),



30

}),



31

execute: async ({ location }) => {



32

const temperature = Math.round(Math.random() * (90 - 32) + 32);



33

return {



34

location,



35

temperature,



36

};



37

},



38

}),



39

convertFahrenheitToCelsius: tool({



40

description: 'Convert a temperature in fahrenheit to celsius',



41

inputSchema: z.object({



42

temperature: z



43

.number()



44

.describe('The temperature in fahrenheit to convert'),



45

}),



46

execute: async ({ temperature }) => {



47

const celsius = Math.round((temperature - 32) * (5 / 9));



48

return {



49

celsius,



50

};



51

},



52

}),



53

},



54

});



55



56

return createUIMessageStreamResponse({



57

stream: toUIMessageStream({ stream: result.stream }),



58

});



59

},



60

},



61

},



62

});
```

### [Update Your Frontend](#update-your-frontend)

update your `src/routes/index.tsx` file to render the new temperature conversion tool:

src/routes/index.tsx

```
1

import { createFileRoute } from '@tanstack/react-router';



2

import { useChat } from '@ai-sdk/react';



3

import { useState } from 'react';



4



5

export const Route = createFileRoute('/')({



6

component: Chat,



7

});



8



9

function Chat() {



10

const [input, setInput] = useState('');



11

const { messages, sendMessage } = useChat();



12

return (



13

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



14

{messages.map(message => (



15

<div key={message.id} className="whitespace-pre-wrap">



16

{message.role === 'user' ? 'User: ' : 'AI: '}



17

{message.parts.map((part, i) => {



18

switch (part.type) {



19

case 'text':



20

return <div key={`${message.id}-${i}`}>{part.text}</div>;



21

case 'tool-weather':



22

case 'tool-convertFahrenheitToCelsius':



23

return (



24

<pre key={`${message.id}-${i}`}>



25

{JSON.stringify(part, null, 2)}



26

</pre>



27

);



28

}



29

})}



30

</div>



31

))}



32



33

<form



34

onSubmit={e => {



35

e.preventDefault();



36

sendMessage({ text: input });



37

setInput('');



38

}}



39

>



40

<input



41

className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"



42

value={input}



43

placeholder="Say something..."



44

onChange={e => setInput(e.currentTarget.value)}



45

/>



46

</form>



47

</div>



48

);



49

}
```

This update handles the new `tool-convertFahrenheitToCelsius` part type, displaying the temperature conversion tool calls and results in the UI.

Now, when you ask "What's the weather in New York in celsius?", you should see a more complete interaction:

1. The model will call the weather tool for New York.
2. You'll see the tool output displayed.
3. It will then call the temperature conversion tool to convert the temperature from Fahrenheit to Celsius.
4. The model will then use that information to provide a natural language response about the weather in New York.

This multi-step approach allows the model to gather information and use it to provide more accurate and contextual responses, making your chatbot considerably more useful.

This simple example demonstrates how tools can expand your model's capabilities. You can create more complex tools to integrate with real APIs, databases, or any other external systems, allowing the model to access and process real-world data in real-time. Tools bridge the gap between the model's knowledge cutoff and current information.

[Where to Next?](#where-to-next)
--------------------------------

You've built an AI chatbot using the AI SDK! From here, you have several paths to explore:

* To learn more about the AI SDK, read through the [documentation](/docs).
* If you're interested in diving deeper with guides, check out the [RAG (retrieval-augmented generation)](/cookbook/guides/rag-chatbot) and [multi-modal chatbot](/cookbook/guides/multi-modal-chatbot) guides.
* To jumpstart your first AI project, explore available [templates](https://vercel.com/templates?type=ai).

[Previous

Expo](/docs/getting-started/expo)[Next

Coding Agents](/docs/getting-started/coding-agents)
