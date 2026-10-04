---
title: "Svelte Quickstart"
source_url: https://ai-sdk.dev/docs/getting-started/svelte
section: getting-started
crawled: 2026-09-20
---

# Svelte Quickstart

> Source: https://ai-sdk.dev/docs/getting-started/svelte

[Getting Started](/docs/getting-started)Svelte


[Svelte Quickstart](#svelte-quickstart)
=======================================

The AI SDK is a powerful TypeScript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple agent with a streaming chat user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of [Prompt Engineering](/docs/advanced/prompt-engineering) and [HTTP Streaming](/docs/foundations/streaming), you can optionally read these documents first.

[Prerequisites](#prerequisites)
-------------------------------

To follow this quickstart, you'll need:

* Node.js 22+ and pnpm installed on your local development machine.
* A  [Vercel AI Gateway](https://vercel.com/ai-gateway)  API key.

If you haven't obtained your Vercel AI Gateway API key, you can do so by [signing up](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway) on the Vercel website.

[Set Up Your Application](#set-up-your-application)
---------------------------------------------------

Start by creating a new SvelteKit application. This command will create a new directory named `my-ai-app` and set up a basic SvelteKit application inside it.

```
npx sv create my-ai-app
```

Navigate to the newly created directory:

```
cd my-ai-app
```

### [Install Dependencies](#install-dependencies)

Install `ai` and `@ai-sdk/svelte`, the AI package and AI SDK's Svelte bindings. The AI SDK's  [Vercel AI Gateway provider](/providers/ai-sdk-providers/ai-gateway)  ships with the `ai` package. You'll also install `zod`, a schema validation library used for defining tool inputs.

This guide uses the Vercel AI Gateway provider so you can access hundreds of
models from different providers with one API key, but you can switch to any
provider or model by installing its package. Check out available [AI SDK
providers](/providers/ai-sdk-providers) for more information.

pnpmnpmbunyarn

```
pnpm add -D ai @ai-sdk/svelte zod
```

### [Configure your AI Gateway API key](#configure-your-ai-gateway-api-key)

Create a `.env.local` file in your project root and add your AI Gateway API key. This key authenticates your application with the Vercel AI Gateway.

```
touch .env.local
```

Edit the `.env.local` file:

.env.local

```
1

AI_GATEWAY_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual Vercel AI Gateway API key.

The AI SDK's Vercel AI Gateway Provider will default to using the
`AI_GATEWAY_API_KEY` environment variable. Vite does not automatically load
environment variables onto `process.env`, so you'll need to import
`AI_GATEWAY_API_KEY` from `$env/static/private` in your code (see below).

[Create an API route](#create-an-api-route)
-------------------------------------------

Create a SvelteKit Endpoint, `src/routes/api/chat/+server.ts` and add the following code:

src/routes/api/chat/+server.ts

```
1

import {



2

streamText,



3

type UIMessage,



4

convertToModelMessages,



5

createGateway,



6

createUIMessageStreamResponse,



7

toUIMessageStream,



8

} from 'ai';



9



10

import { AI_GATEWAY_API_KEY } from '$env/static/private';



11



12

const gateway = createGateway({



13

apiKey: AI_GATEWAY_API_KEY,



14

});



15



16

export async function POST({ request }) {



17

const { messages }: { messages: UIMessage[] } = await request.json();



18



19

const result = streamText({



20

model: gateway('anthropic/claude-sonnet-4.5'),



21

messages: await convertToModelMessages(messages),



22

});



23



24

return createUIMessageStreamResponse({



25

stream: toUIMessageStream({ stream: result.stream }),



26

});



27

}
```

If you see type errors with `AI_GATEWAY_API_KEY` or your `POST` function, run
the dev server.

Let's take a look at what is happening in this code:

1. Create a gateway provider instance with the `createGateway` function from the `ai` package.
2. Define a `POST` request handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation. The `messages` are of UIMessage type, which are designed for use in application UI - they contain the entire message history and associated metadata like timestamps.
3. Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (defined in step 1) and `messages` (defined in step 2). You can pass additional [settings](/docs/ai-sdk-core/settings) to further customize the model's behavior. The `messages` key expects a `ModelMessage[]` array. This type is different from `UIMessage` in that it does not include metadata, such as timestamps or sender information. To convert between these types, we use the `convertToModelMessages` function, which strips the UI-specific metadata and transforms the `UIMessage[]` array into the `ModelMessage[]` format that the model expects.
4. The `streamText` function returns a [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text#result-object). Pass its `stream` to `toUIMessageStream` and return it with `createUIMessageStreamResponse` to create a streamed response object.
5. Return the result to the client to stream the response.

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

Now that you have an API route that can query an LLM, it's time to set up your frontend. The AI SDK's [UI](/docs/ai-sdk-ui) package abstracts the complexity of a chat interface into one class, `Chat`.
Its properties and API are largely the same as React's [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Update your root page (`src/routes/+page.svelte`) with the following code to show a list of chat messages and provide a user message input:

src/routes/+page.svelte

```
1

<script lang="ts">



2

import { Chat } from '@ai-sdk/svelte';



3



4

let input = '';



5

const chat = new Chat({});



6



7

function handleSubmit(event: SubmitEvent) {



8

event.preventDefault();



9

chat.sendMessage({ text: input });



10

input = '';



11

}



12

</script>



13



14

<main>



15

<ul>



16

{#each chat.messages as message, messageIndex (messageIndex)}



17

<li>



18

<div>{message.role}</div>



19

<div>



20

{#each message.parts as part, partIndex (partIndex)}



21

{#if part.type === 'text'}



22

<div>{part.text}</div>



23

{/if}



24

{/each}



25

</div>



26

</li>



27

{/each}



28

</ul>



29

<form onsubmit={handleSubmit}>



30

<input bind:value={input} />



31

<button type="submit">Send</button>



32

</form>



33

</main>
```

This page utilizes the `Chat` class, which will, by default, use the `POST` route handler you created earlier. The class provides functions and state for handling user input and form submission. The `Chat` class provides multiple utility functions and state variables:

* `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
* `sendMessage` - a function to send a message to the chat API.

The component uses local state to manage the input field value, and handles form submission by calling `sendMessage` with the input text and then clearing the input field.

The LLM's response is accessed through the message `parts` array. Each message contains an ordered array of `parts` that represents everything the model generated in its response. These parts can include plain text, reasoning tokens, and more that you will see later. The `parts` array preserves the sequence of the model's outputs, allowing you to display or process each component in the order it was generated.

[Running Your Application](#running-your-application)
-----------------------------------------------------

With that, you have built everything you need for your chatbot! To start your application, use the command:

```
pnpm run dev
```

Head to your browser and open <http://localhost:5173>. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! The AI SDK makes it fast and easy to build AI chat interfaces with Svelte.

[Enhance Your Chatbot with Tools](#enhance-your-chatbot-with-tools)
-------------------------------------------------------------------

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](/docs/ai-sdk-core/tools-and-tool-calling) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the model would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your chatbot by adding a simple weather tool.

### [Update Your API Route](#update-your-api-route)

Modify your `src/routes/api/chat/+server.ts` file to include the new weather tool:

src/routes/api/chat/+server.ts

```
1

import {



2

createGateway,



3

streamText,



4

type UIMessage,



5

convertToModelMessages,



6

tool,



7

isStepCount,



8

createUIMessageStreamResponse,



9

toUIMessageStream,



10

} from 'ai';



11

import { z } from 'zod';



12



13

import { AI_GATEWAY_API_KEY } from '$env/static/private';



14



15

const gateway = createGateway({



16

apiKey: AI_GATEWAY_API_KEY,



17

});



18



19

export async function POST({ request }) {



20

const { messages }: { messages: UIMessage[] } = await request.json();



21



22

const result = streamText({



23

model: gateway('anthropic/claude-sonnet-4.5'),



24

messages: await convertToModelMessages(messages),



25

tools: {



26

weather: tool({



27

description: 'Get the weather in a location (fahrenheit)',



28

inputSchema: z.object({



29

location: z.string().describe('The location to get the weather for'),



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

}
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

To display the tool invocation in your UI, update your `src/routes/+page.svelte` file:

src/routes/+page.svelte

```
1

<script lang="ts">



2

import { Chat } from '@ai-sdk/svelte';



3



4

let input = '';



5

const chat = new Chat({});



6



7

function handleSubmit(event: SubmitEvent) {



8

event.preventDefault();



9

chat.sendMessage({ text: input });



10

input = '';



11

}



12

</script>



13



14

<main>



15

<ul>



16

{#each chat.messages as message, messageIndex (messageIndex)}



17

<li>



18

<div>{message.role}</div>



19

<div>



20

{#each message.parts as part, partIndex (partIndex)}



21

{#if part.type === 'text'}



22

<div>{part.text}</div>



23

{:else if part.type === 'tool-weather'}



24

<pre>{JSON.stringify(part, null, 2)}</pre>



25

{/if}



26

{/each}



27

</div>



28

</li>



29

{/each}



30

</ul>



31

<form onsubmit={handleSubmit}>



32

<input bind:value={input} />



33

<button type="submit">Send</button>



34

</form>



35

</main>
```

With this change, you're updating the UI to handle different message parts. For text parts, you display the text content as before. For weather tool invocations, you display a JSON representation of the tool call and its result.

Now, when you ask about the weather, you'll see the tool call and its result displayed in your chat interface.

[Enabling Multi-Step Tool Calls](#enabling-multi-step-tool-calls)
-----------------------------------------------------------------

You may have noticed that while the tool is now visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. By default, `stopWhen` is set to `isStepCount(1)`, which means generation stops after the first step when there are tool results. By changing this condition, you can allow the model to automatically send tool results back to itself to trigger additional generations until your specified stopping condition is met. In this case, you want the model to continue generating so it can use the weather tool results to answer your original question.

### [Update Your API Route](#update-your-api-route-1)

Modify your `src/routes/api/chat/+server.ts` file to include the `stopWhen` condition:

src/routes/api/chat/+server.ts

```
1

import {



2

createGateway,



3

streamText,



4

type UIMessage,



5

convertToModelMessages,



6

tool,



7

isStepCount,



8

createUIMessageStreamResponse,



9

toUIMessageStream,



10

} from 'ai';



11

import { z } from 'zod';



12



13

import { AI_GATEWAY_API_KEY } from '$env/static/private';



14



15

const gateway = createGateway({



16

apiKey: AI_GATEWAY_API_KEY,



17

});



18



19

export async function POST({ request }) {



20

const { messages }: { messages: UIMessage[] } = await request.json();



21



22

const result = streamText({



23

model: gateway('anthropic/claude-sonnet-4.5'),



24

messages: await convertToModelMessages(messages),



25

stopWhen: isStepCount(5),



26

tools: {



27

weather: tool({



28

description: 'Get the weather in a location (fahrenheit)',



29

inputSchema: z.object({



30

location: z.string().describe('The location to get the weather for'),



31

}),



32

execute: async ({ location }) => {



33

const temperature = Math.round(Math.random() * (90 - 32) + 32);



34

return {



35

location,



36

temperature,



37

};



38

},



39

}),



40

},



41

});



42



43

return createUIMessageStreamResponse({



44

stream: toUIMessageStream({ stream: result.stream }),



45

});



46

}
```

Head back to the browser and ask about the weather in a location. You should now see the model using the weather tool results to answer your question.

By setting `stopWhen: isStepCount(5)`, you're allowing the model to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the model to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Fahrenheit to Celsius.

### [Add another tool](#add-another-tool)

Update your `src/routes/api/chat/+server.ts` file to add a new tool to convert the temperature from Fahrenheit to Celsius:

src/routes/api/chat/+server.ts

```
1

import {



2

createGateway,



3

streamText,



4

type UIMessage,



5

convertToModelMessages,



6

tool,



7

isStepCount,



8

createUIMessageStreamResponse,



9

toUIMessageStream,



10

} from 'ai';



11

import { z } from 'zod';



12



13

import { AI_GATEWAY_API_KEY } from '$env/static/private';



14



15

const gateway = createGateway({



16

apiKey: AI_GATEWAY_API_KEY,



17

});



18



19

export async function POST({ request }) {



20

const { messages }: { messages: UIMessage[] } = await request.json();



21



22

const result = streamText({



23

model: gateway('anthropic/claude-sonnet-4.5'),



24

messages: await convertToModelMessages(messages),



25

stopWhen: isStepCount(5),



26

tools: {



27

weather: tool({



28

description: 'Get the weather in a location (fahrenheit)',



29

inputSchema: z.object({



30

location: z.string().describe('The location to get the weather for'),



31

}),



32

execute: async ({ location }) => {



33

const temperature = Math.round(Math.random() * (90 - 32) + 32);



34

return {



35

location,



36

temperature,



37

};



38

},



39

}),



40

convertFahrenheitToCelsius: tool({



41

description: 'Convert a temperature in fahrenheit to celsius',



42

inputSchema: z.object({



43

temperature: z



44

.number()



45

.describe('The temperature in fahrenheit to convert'),



46

}),



47

execute: async ({ temperature }) => {



48

const celsius = Math.round((temperature - 32) * (5 / 9));



49

return {



50

celsius,



51

};



52

},



53

}),



54

},



55

});



56



57

return createUIMessageStreamResponse({



58

stream: toUIMessageStream({ stream: result.stream }),



59

});



60

}
```

### [Update Your Frontend](#update-your-frontend)

Update your UI to handle the new temperature conversion tool by modifying the tool part handling:

src/routes/+page.svelte

```
1

<script lang="ts">



2

import { Chat } from '@ai-sdk/svelte';



3



4

let input = '';



5

const chat = new Chat({});



6



7

function handleSubmit(event: SubmitEvent) {



8

event.preventDefault();



9

chat.sendMessage({ text: input });



10

input = '';



11

}



12

</script>



13



14

<main>



15

<ul>



16

{#each chat.messages as message, messageIndex (messageIndex)}



17

<li>



18

<div>{message.role}</div>



19

<div>



20

{#each message.parts as part, partIndex (partIndex)}



21

{#if part.type === 'text'}



22

<div>{part.text}</div>



23

{:else if part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'}



24

<pre>{JSON.stringify(part, null, 2)}</pre>



25

{/if}



26

{/each}



27

</div>



28

</li>



29

{/each}



30

</ul>



31

<form onsubmit={handleSubmit}>



32

<input bind:value={input} />



33

<button type="submit">Send</button>



34

</form>



35

</main>
```

This update handles the new `tool-convertFahrenheitToCelsius` part type, displaying the temperature conversion tool calls and results in the UI.

Now, when you ask "What's the weather in New York in celsius?", you should see a more complete interaction:

1. The model will call the weather tool for New York.
2. You'll see the tool output displayed.
3. It will then call the temperature conversion tool to convert the temperature from Fahrenheit to Celsius.
4. The model will then use that information to provide a natural language response about the weather in New York.

This multi-step approach allows the model to gather information and use it to provide more accurate and contextual responses, making your chatbot considerably more useful.

This simple example demonstrates how tools can expand your model's capabilities. You can create more complex tools to integrate with real APIs, databases, or any other external systems, allowing the model to access and process real-world data in real-time. Tools bridge the gap between the model's knowledge cutoff and current information.

[How does `@ai-sdk/svelte` differ from `@ai-sdk/react`?](#how-does-ai-sdksvelte-differ-from-ai-sdkreact)
--------------------------------------------------------------------------------------------------------

The surface-level difference is that Svelte uses classes to manage state, whereas React uses hooks, so `useChat` in React is `Chat` in Svelte. Other than that, there are a few things to keep in mind:

### [1. Arguments to classes aren't reactive by default](#1-arguments-to-classes-arent-reactive-by-default)

Unlike in React, where hooks are rerun any time their containing component is invalidated, code in the `script` block of a Svelte component is only run once when the component is created.
This means that, if you want arguments to your class to be reactive, you need to make sure you pass a *reference* into the class, rather than a value:

```
1

<script>



2

import { Chat } from '@ai-sdk/svelte';



3



4

let { id } = $props();



5



6

// won't work; the class instance will be created once, `id` will be copied by value, and won't update when $props.id changes



7

let chat = new Chat({ id });



8



9

// will work; passes `id` by reference, so `Chat` always has the latest value



10

let chat = new Chat({



11

get id() {



12

return id;



13

},



14

});



15

</script>
```

Keep in mind that this normally doesn't matter; most parameters you'll pass into the Chat class are static (for example, you typically wouldn't expect your `onError` handler to change).

### [2. You can't destructure class properties](#2-you-cant-destructure-class-properties)

In vanilla JavaScript, destructuring class properties copies them by value and "disconnects" them from their class instance:

```
1

const classInstance = new Whatever();



2

classInstance.foo = 'bar';



3

const { foo } = classInstance;



4

classInstance.foo = 'baz';



5



6

console.log(foo); // 'bar'
```

The same is true of classes in Svelte:

```
1

<script>



2

import { Chat } from '@ai-sdk/svelte';



3



4

const chat = new Chat({});



5

let { messages } = chat;



6



7

chat.sendMessage({ text: 'Hello, world!' }).then(() => {



8

console.log(messages); // []



9

console.log(chat.messages); // [{ id: '...', role: 'user', parts: [{ type: 'text', text: 'Hello, world!' }] }]



10

});



11

</script>
```

### [3. Instance synchronization requires context](#3-instance-synchronization-requires-context)

In React, hook instances with the same `id` are synchronized -- so two instances of `useChat` will have the same `messages`, `status`, etc. if they have the same `id`.
For most use cases, you probably don't need this behavior -- but if you do, you can create a context in your root layout file using `createAIContext`:

```
1

<script>



2

import { createAIContext } from '@ai-sdk/svelte';



3



4

let { children } = $props();



5



6

createAIContext();



7

// all hooks created after this or in components that are children of this component



8

// will have synchronized state



9

</script>



10



11

{@render children()}
```

[Where to Next?](#where-to-next)
--------------------------------

You've built an AI chatbot using the AI SDK! From here, you have several paths to explore:

* To learn more about the AI SDK, read through the [documentation](/docs).
* If you're interested in diving deeper with guides, check out the [RAG (retrieval-augmented generation)](/cookbook/guides/rag-chatbot) and [multi-modal chatbot](/cookbook/guides/multi-modal-chatbot) guides.
* To jumpstart your first AI project, explore available [templates](https://vercel.com/templates?type=ai).
* To learn more about Svelte, check out the [official documentation](https://svelte.dev/docs/svelte).

[Previous

Next.js Pages Router](/docs/getting-started/nextjs-pages-router)[Next

Vue.js (Nuxt)](/docs/getting-started/nuxt)
