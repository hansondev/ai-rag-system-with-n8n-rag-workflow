---
title: "Vue.js (Nuxt) Quickstart"
source_url: https://ai-sdk.dev/docs/getting-started/nuxt
section: getting-started
crawled: 2026-09-20
---

# Vue.js (Nuxt) Quickstart

> Source: https://ai-sdk.dev/docs/getting-started/nuxt

[Getting Started](/docs/getting-started)Vue.js (Nuxt)


[Vue.js (Nuxt) Quickstart](#vuejs-nuxt-quickstart)
==================================================

The AI SDK is a powerful TypeScript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple agent with a streaming chat user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of [Prompt Engineering](/docs/advanced/prompt-engineering) and [HTTP Streaming](/docs/foundations/streaming), you can optionally read these documents first.

[Prerequisites](#prerequisites)
-------------------------------

To follow this quickstart, you'll need:

* Node.js 22+ and pnpm installed on your local development machine.
* A  [Vercel AI Gateway](https://vercel.com/ai-gateway)  API key.

If you haven't obtained your Vercel AI Gateway API key, you can do so by [signing up](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway) on the Vercel website.

[Setup Your Application](#setup-your-application)
-------------------------------------------------

Start by creating a new Nuxt application. This command will create a new directory named `my-ai-app` and set up a basic Nuxt application inside it.

```
pnpm create nuxt my-ai-app
```

Navigate to the newly created directory:

```
cd my-ai-app
```

### [Install dependencies](#install-dependencies)

Install `ai` and `@ai-sdk/vue`. The Vercel AI Gateway provider ships with the `ai` package.

The AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about [available providers](/providers) and
[building custom providers](/providers/community-providers/custom-providers)
in the [providers](/providers) section.

pnpmnpmbunyarn

```
pnpm add ai @ai-sdk/vue zod
```

### [Configure Vercel AI Gateway API key](#configure-vercel-ai-gateway-api-key)

Create a `.env` file in your project root and add your Vercel AI Gateway API Key. This key is used to authenticate your application with the Vercel AI Gateway service.

```
touch .env
```

Edit the `.env` file:

.env

```
1

NUXT_AI_GATEWAY_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual Vercel AI Gateway API key and configure the environment variable in `nuxt.config.ts`:

nuxt.config.ts

```
1

export default defineNuxtConfig({



2

// rest of your nuxt config



3

runtimeConfig: {



4

aiGatewayApiKey: '',



5

},



6

});
```

This guide uses Nuxt's runtime config to manage the API key. The `NUXT_`
prefix in the environment variable allows Nuxt to automatically load it into
the runtime config. While the AI Gateway Provider also supports a default
`AI_GATEWAY_API_KEY` environment variable, this approach provides better
integration with Nuxt's configuration system.

[Create an API route](#create-an-api-route)
-------------------------------------------

Create an API route, `server/api/chat.ts` and add the following code:

server/api/chat.ts

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

createGateway,



6

createUIMessageStreamResponse,



7

toUIMessageStream,



8

} from 'ai';



9



10

export default defineLazyEventHandler(async () => {



11

const apiKey = useRuntimeConfig().aiGatewayApiKey;



12

if (!apiKey) throw new Error('Missing AI Gateway API key');



13

const gateway = createGateway({



14

apiKey: apiKey,



15

});



16



17

return defineEventHandler(async (event: any) => {



18

const { messages }: { messages: UIMessage[] } = await readBody(event);



19



20

const result = streamText({



21

model: gateway('anthropic/claude-sonnet-4.5'),



22

messages: await convertToModelMessages(messages),



23

});



24



25

return createUIMessageStreamResponse({



26

stream: toUIMessageStream({ stream: result.stream }),



27

});



28

});



29

});
```

Let's take a look at what is happening in this code:

1. Create a gateway provider instance with the `createGateway` function from the `ai` package.
2. Define an Event Handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation. The `messages` are of UIMessage type, which are designed for use in application UI - they contain the entire message history and associated metadata like timestamps.
3. Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (defined in step 1) and `messages` (defined in step 2). You can pass additional [settings](/docs/ai-sdk-core/settings) to further customize the model's behavior. The `messages` key expects a `ModelMessage[]` array. This type is different from `UIMessage` in that it does not include metadata, such as timestamps or sender information. To convert between these types, we use the `convertToModelMessages` function, which strips the UI-specific metadata and transforms the `UIMessage[]` array into the `ModelMessage[]` format that the model expects.
4. The `streamText` function returns a [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text#result). Pass its `stream` to `toUIMessageStream` and return it with `createUIMessageStreamResponse` to create a streamed response object.
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

[Wire up the UI](#wire-up-the-ui)
---------------------------------

Now that you have an API route that can query an LLM, it's time to setup your frontend. The AI SDK's  [UI](/docs/ai-sdk-ui/overview)  package abstract the complexity of a chat interface into one hook, [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Update your root page (`pages/index.vue`) with the following code to show a list of chat messages and provide a user message input:

pages/index.vue

```
1

<script setup lang="ts">



2

import { useChat } from "@ai-sdk/vue";



3

import { ref } from "vue";



4



5

const input = ref("");



6

const { messages, sendMessage } = useChat();



7



8

const handleSubmit = (e: Event) => {



9

e.preventDefault();



10

sendMessage({ text: input.value });



11

input.value = "";



12

};



13

</script>



14



15

<template>



16

<div>



17

<div v-for="(m, index) in messages" :key="m.id ? m.id : index">



18

{{ m.role === "user" ? "User: " : "AI: " }}



19

<div



20

v-for="(part, index) in m.parts"



21

:key="`${m.id}-${part.type}-${index}`"



22

>



23

<div v-if="part.type === 'text'">{{ part.text }}</div>



24

</div>



25

</div>



26



27

<form @submit="handleSubmit">



28

<input v-model="input" placeholder="Say something..." />



29

</form>



30

</div>



31

</template>
```

If your project has `app.vue` instead of `pages/index.vue`, delete the
`app.vue` file and create a new `pages/index.vue` file with the code above.

This page utilizes the `useChat` hook, which will, by default, use the API route you created earlier (`/api/chat`). The hook provides functions and state for handling user input and form submission. The `useChat` hook provides multiple utility functions and state variables:

* `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
* `sendMessage` - a function to send a message to the chat API.

The component uses local state (`ref`) to manage the input field value, and handles form submission by calling `sendMessage` with the input text and then clearing the input field.

The LLM's response is accessed through the message `parts` array. Each message contains an ordered array of `parts` that represents everything the model generated in its response. These parts can include plain text, reasoning tokens, and more that you will see later. The `parts` array preserves the sequence of the model's outputs, allowing you to display or process each component in the order it was generated.

[Running Your Application](#running-your-application)
-----------------------------------------------------

With that, you have built everything you need for your chatbot! To start your application, use the command:

```
pnpm run dev
```

Head to your browser and open <http://localhost:3000>. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! The AI SDK makes it fast and easy to build AI chat interfaces with Nuxt.

[Enhance Your Chatbot with Tools](#enhance-your-chatbot-with-tools)
-------------------------------------------------------------------

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](/docs/ai-sdk-core/tools-and-tool-calling) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the model would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your chatbot by adding a simple weather tool.

### [Update Your API Route](#update-your-api-route)

Modify your `server/api/chat.ts` file to include the new weather tool:

server/api/chat.ts

```
1

import {



2

createGateway,



3

streamText,



4

UIMessage,



5

convertToModelMessages,



6

tool,



7

createUIMessageStreamResponse,



8

toUIMessageStream,



9

} from 'ai';



10

import { z } from 'zod';



11



12

export default defineLazyEventHandler(async () => {



13

const apiKey = useRuntimeConfig().aiGatewayApiKey;



14

if (!apiKey) throw new Error('Missing AI Gateway API key');



15

const gateway = createGateway({



16

apiKey: apiKey,



17

});



18



19

return defineEventHandler(async (event: any) => {



20

const { messages }: { messages: UIMessage[] } = await readBody(event);



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

location: z



30

.string()



31

.describe('The location to get the weather for'),



32

}),



33

execute: async ({ location }) => {



34

const temperature = Math.round(Math.random() * (90 - 32) + 32);



35

return {



36

location,



37

temperature,



38

};



39

},



40

}),



41

},



42

});



43



44

return createUIMessageStreamResponse({



45

stream: toUIMessageStream({ stream: result.stream }),



46

});



47

});



48

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

To display the tool invocation in your UI, update your `pages/index.vue` file:

pages/index.vue

```
1

<script setup lang="ts">



2

import { useChat } from "@ai-sdk/vue";



3

import { ref } from "vue";



4



5

const input = ref("");



6

const { messages, sendMessage } = useChat();



7



8

const handleSubmit = (e: Event) => {



9

e.preventDefault();



10

sendMessage({ text: input.value });



11

input.value = "";



12

};



13

</script>



14



15

<template>



16

<div>



17

<div v-for="(m, index) in messages" :key="m.id ? m.id : index">



18

{{ m.role === "user" ? "User: " : "AI: " }}



19

<div



20

v-for="(part, index) in m.parts"



21

:key="`${m.id}-${part.type}-${index}`"



22

>



23

<div v-if="part.type === 'text'">{{ part.text }}</div>



24

<pre v-if="part.type === 'tool-weather'">{{ JSON.stringify(part, null, 2) }}</pre>



25

</div>



26

</div>



27



28

<form @submit="handleSubmit">



29

<input v-model="input" placeholder="Say something..." />



30

</form>



31

</div>



32

</template>
```

With this change, you're updating the UI to handle different message parts. For text parts, you display the text content as before. For weather tool invocations, you display a JSON representation of the tool call and its result.

Now, when you ask about the weather, you'll see the tool call and its result displayed in your chat interface.

[Enabling Multi-Step Tool Calls](#enabling-multi-step-tool-calls)
-----------------------------------------------------------------

You may have noticed that while the tool is now visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. By default, `stopWhen` is set to `isStepCount(1)`, which means generation stops after the first step when there are tool results. By changing this condition, you can allow the model to automatically send tool results back to itself to trigger additional generations until your specified stopping condition is met. In this case, you want the model to continue generating so it can use the weather tool results to answer your original question.

### [Update Your API Route](#update-your-api-route-1)

Modify your `server/api/chat.ts` file to include the `stopWhen` condition:

server/api/chat.ts

```
1

import {



2

createGateway,



3

streamText,



4

UIMessage,



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

export default defineLazyEventHandler(async () => {



14

const apiKey = useRuntimeConfig().aiGatewayApiKey;



15

if (!apiKey) throw new Error('Missing AI Gateway API key');



16

const gateway = createGateway({



17

apiKey: apiKey,



18

});



19



20

return defineEventHandler(async (event: any) => {



21

const { messages }: { messages: UIMessage[] } = await readBody(event);



22



23

const result = streamText({



24

model: gateway('anthropic/claude-sonnet-4.5'),



25

messages: await convertToModelMessages(messages),



26

stopWhen: isStepCount(5),



27

tools: {



28

weather: tool({



29

description: 'Get the weather in a location (fahrenheit)',



30

inputSchema: z.object({



31

location: z



32

.string()



33

.describe('The location to get the weather for'),



34

}),



35

execute: async ({ location }) => {



36

const temperature = Math.round(Math.random() * (90 - 32) + 32);



37

return {



38

location,



39

temperature,



40

};



41

},



42

}),



43

},



44

});



45



46

return createUIMessageStreamResponse({



47

stream: toUIMessageStream({ stream: result.stream }),



48

});



49

});



50

});
```

Head back to the browser and ask about the weather in a location. You should now see the model using the weather tool results to answer your question.

By setting `stopWhen: isStepCount(5)`, you're allowing the model to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the model to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Fahrenheit to Celsius.

### [Add another tool](#add-another-tool)

Update your `server/api/chat.ts` file to add a new tool to convert the temperature from Fahrenheit to Celsius:

server/api/chat.ts

```
1

import {



2

createGateway,



3

streamText,



4

UIMessage,



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

export default defineLazyEventHandler(async () => {



14

const apiKey = useRuntimeConfig().aiGatewayApiKey;



15

if (!apiKey) throw new Error('Missing AI Gateway API key');



16

const gateway = createGateway({



17

apiKey: apiKey,



18

});



19



20

return defineEventHandler(async (event: any) => {



21

const { messages }: { messages: UIMessage[] } = await readBody(event);



22



23

const result = streamText({



24

model: gateway('anthropic/claude-sonnet-4.5'),



25

messages: await convertToModelMessages(messages),



26

stopWhen: isStepCount(5),



27

tools: {



28

weather: tool({



29

description: 'Get the weather in a location (fahrenheit)',



30

inputSchema: z.object({



31

location: z



32

.string()



33

.describe('The location to get the weather for'),



34

}),



35

execute: async ({ location }) => {



36

const temperature = Math.round(Math.random() * (90 - 32) + 32);



37

return {



38

location,



39

temperature,



40

};



41

},



42

}),



43

convertFahrenheitToCelsius: tool({



44

description: 'Convert a temperature in fahrenheit to celsius',



45

inputSchema: z.object({



46

temperature: z



47

.number()



48

.describe('The temperature in fahrenheit to convert'),



49

}),



50

execute: async ({ temperature }) => {



51

const celsius = Math.round((temperature - 32) * (5 / 9));



52

return {



53

celsius,



54

};



55

},



56

}),



57

},



58

});



59



60

return createUIMessageStreamResponse({



61

stream: toUIMessageStream({ stream: result.stream }),



62

});



63

});



64

});
```

### [Update Your Frontend](#update-your-frontend)

Update your UI to handle the new temperature conversion tool by modifying the tool part handling:

pages/index.vue

```
1

<script setup lang="ts">



2

import { useChat } from "@ai-sdk/vue";



3

import { ref } from "vue";



4



5

const input = ref("");



6

const { messages, sendMessage } = useChat();



7



8

const handleSubmit = (e: Event) => {



9

e.preventDefault();



10

sendMessage({ text: input.value });



11

input.value = "";



12

};



13

</script>



14



15

<template>



16

<div>



17

<div v-for="(m, index) in messages" :key="m.id ? m.id : index">



18

{{ m.role === "user" ? "User: " : "AI: " }}



19

<div



20

v-for="(part, index) in m.parts"



21

:key="`${m.id}-${part.type}-${index}`"



22

>



23

<div v-if="part.type === 'text'">{{ part.text }}</div>



24

<pre



25

v-if="



26

part.type === 'tool-weather' ||



27

part.type === 'tool-convertFahrenheitToCelsius'



28

"



29

>{{ JSON.stringify(part, null, 2) }}</pre



30

>



31

</div>



32

</div>



33



34

<form @submit="handleSubmit">



35

<input v-model="input" placeholder="Say something..." />



36

</form>



37

</div>



38

</template>
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

Svelte](/docs/getting-started/svelte)[Next

Node.js](/docs/getting-started/nodejs)
