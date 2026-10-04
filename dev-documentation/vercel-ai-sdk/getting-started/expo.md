---
title: "Expo Quickstart"
source_url: https://ai-sdk.dev/docs/getting-started/expo
section: getting-started
crawled: 2026-09-20
---

# Expo Quickstart

> Source: https://ai-sdk.dev/docs/getting-started/expo

[Getting Started](/docs/getting-started)Expo


[Expo Quickstart](#expo-quickstart)
===================================

In this quickstart tutorial, you'll build a simple agent with a streaming chat user interface with [Expo](https://expo.dev/). Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of [Prompt Engineering](/docs/advanced/prompt-engineering) and [HTTP Streaming](/docs/foundations/streaming), you can optionally read these documents first.

[Prerequisites](#prerequisites)
-------------------------------

To follow this quickstart, you'll need:

* Node.js 22+ and pnpm installed on your local development machine.
* A  [Vercel AI Gateway](https://vercel.com/ai-gateway)  API key.

If you haven't obtained your Vercel AI Gateway API key, you can do so by [signing up](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway) on the Vercel website.

[Create Your Application](#create-your-application)
---------------------------------------------------

Start by creating a new Expo application. This command will create a new directory named `my-ai-app` and set up a basic Expo application inside it.

```
pnpm create expo-app@latest my-ai-app
```

Navigate to the newly created directory:

```
cd my-ai-app
```

This guide requires Expo 52 or higher.

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
`AI_GATEWAY_API_KEY` environment variable.

[Create an API Route](#create-an-api-route)
-------------------------------------------

Create a route handler, `app/api/chat+api.ts` and add the following code:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat+api.ts

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

stream: toUIMessageStream({ stream: result.stream }),



19

headers: {



20

'Content-Type': 'application/octet-stream',



21

'Content-Encoding': 'none',



22

},



23

});



24

}
```

Let's take a look at what is happening in this code:

1. Define an asynchronous `POST` request handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation.
2. Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (imported from `ai`) and `messages` (defined in step 1). You can pass additional [settings](/docs/ai-sdk-core/settings) to further customize the model's behavior.
3. The `streamText` function returns a [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text#result-object). Pass its `stream` to `toUIMessageStream` and return it with `createUIMessageStreamResponse` to create a streamed response object.
4. Finally, return the result to the client to stream the response.

This API route creates a POST request endpoint at `/api/chat`.

If a deployed Expo API Route buffers the response despite the streaming
headers above, test the same handler without the deployment adapter to isolate
the cause. As a workaround, host the chat endpoint in a separate Vercel
Function and set `EXPO_PUBLIC_API_BASE_URL` to that function's base URL.

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

Now that you have an API route that can query an LLM, it's time to setup your frontend. The AI SDK's  [UI](/docs/ai-sdk-ui)  package abstracts the complexity of a chat interface into one hook, [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Update your root page (`app/(tabs)/index.tsx`) with the following code to show a list of chat messages and provide a user message input:

app/(tabs)/index.tsx

```
1

import { generateAPIUrl } from '@/utils';



2

import { useChat } from '@ai-sdk/react';



3

import { DefaultChatTransport } from 'ai';



4

import { fetch as expoFetch } from 'expo/fetch';



5

import { useState } from 'react';



6

import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';



7



8

export default function App() {



9

const [input, setInput] = useState('');



10

const { messages, error, sendMessage } = useChat({



11

transport: new DefaultChatTransport({



12

fetch: expoFetch as unknown as typeof globalThis.fetch,



13

api: generateAPIUrl('/api/chat'),



14

}),



15

onError: error => console.error(error, 'ERROR'),



16

});



17



18

if (error) return <Text>{error.message}</Text>;



19



20

return (



21

<SafeAreaView style={{ height: '100%' }}>



22

<View



23

style={{



24

height: '95%',



25

display: 'flex',



26

flexDirection: 'column',



27

paddingHorizontal: 8,



28

}}



29

>



30

<ScrollView style={{ flex: 1 }}>



31

{messages.map(m => (



32

<View key={m.id} style={{ marginVertical: 8 }}>



33

<View>



34

<Text style={{ fontWeight: 700 }}>{m.role}</Text>



35

{m.parts.map((part, i) => {



36

switch (part.type) {



37

case 'text':



38

return <Text key={`${m.id}-${i}`}>{part.text}</Text>;



39

}



40

})}



41

</View>



42

</View>



43

))}



44

</ScrollView>



45



46

<View style={{ marginTop: 8 }}>



47

<TextInput



48

style={{ backgroundColor: 'white', padding: 8 }}



49

placeholder="Say something..."



50

value={input}



51

onChange={e => setInput(e.nativeEvent.text)}



52

onSubmitEditing={e => {



53

e.preventDefault();



54

sendMessage({ text: input });



55

setInput('');



56

}}



57

autoFocus={true}



58

/>



59

</View>



60

</View>



61

</SafeAreaView>



62

);



63

}
```

This page utilizes the `useChat` hook, which will, by default, use the `POST` API route you created earlier (`/api/chat`). The hook provides functions and state for handling user input and form submission. The `useChat` hook provides multiple utility functions and state variables:

* `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
* `sendMessage` - a function to send a message to the chat API.

The component uses local state (`useState`) to manage the input field value, and handles form submission by calling `sendMessage` with the input text and then clearing the input field.

The LLM's response is accessed through the message `parts` array. Each message contains an ordered array of `parts` that represents everything the model generated in its response. These parts can include plain text, reasoning tokens, and more that you will see later. The `parts` array preserves the sequence of the model's outputs, allowing you to display or process each component in the order it was generated.

You use the expo/fetch function instead of the native node fetch to enable
streaming of chat responses. This requires Expo 52 or higher.

### [Create the API URL Generator](#create-the-api-url-generator)

Because you're using expo/fetch for streaming responses instead of the native fetch function, you'll need an API URL generator to ensure you are using the correct base url and format depending on the client environment (e.g. web or mobile). Create a new file called `utils.ts` in the root of your project and add the following code:

utils.ts

```
1

import Constants from 'expo-constants';



2



3

export const generateAPIUrl = (relativePath: string) => {



4

const origin = Constants.experienceUrl.replace('exp://', 'http://');



5



6

const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;



7



8

if (process.env.NODE_ENV === 'development') {



9

return origin.concat(path);



10

}



11



12

if (!process.env.EXPO_PUBLIC_API_BASE_URL) {



13

throw new Error(



14

'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',



15

);



16

}



17



18

return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);



19

};
```

This utility function handles URL generation for both development and production environments, ensuring your API calls work correctly across different devices and configurations.

Before deploying to production, you must set the `EXPO_PUBLIC_API_BASE_URL`
environment variable in your production environment. This variable should
point to the base URL of your API server.

[Running Your Application](#running-your-application)
-----------------------------------------------------

With that, you have built everything you need for your chatbot! To start your application, use the command:

```
pnpm expo
```

Head to your browser and open <http://localhost:8081>. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! The AI SDK makes it fast and easy to build AI chat interfaces with Expo.

If you experience "Property `structuredClone` doesn't exist" errors on mobile,
add the [polyfills described below](#polyfills).

[Enhance Your Chatbot with Tools](#enhance-your-chatbot-with-tools)
-------------------------------------------------------------------

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](/docs/ai-sdk-core/tools-and-tool-calling) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the model would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your chatbot by adding a simple weather tool.

### [Update Your API route](#update-your-api-route)

Modify your `app/api/chat+api.ts` file to include the new weather tool:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat+api.ts

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

import { z } from 'zod';



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

tools: {



18

weather: tool({



19

description: 'Get the weather in a location (fahrenheit)',



20

inputSchema: z.object({



21

location: z.string().describe('The location to get the weather for'),



22

}),



23

execute: async ({ location }) => {



24

const temperature = Math.round(Math.random() * (90 - 32) + 32);



25

return {



26

location,



27

temperature,



28

};



29

},



30

}),



31

},



32

});



33



34

return createUIMessageStreamResponse({



35

stream: toUIMessageStream({ stream: result.stream }),



36

headers: {



37

'Content-Type': 'application/octet-stream',



38

'Content-Encoding': 'none',



39

},



40

});



41

}
```

In this updated code:

1. You import the `tool` function from the `ai` package and `z` from `zod` for schema validation.
2. You define a `tools` object with a `weather` tool. This tool:
   * Has a description that helps the model understand when to use it.
   * Defines `inputSchema` using a Zod schema, specifying that it requires a `location` string to execute this tool. The model will attempt to extract this input from the context of the conversation. If it can't, it will ask the user for the missing information.
   * Defines an `execute` function that simulates getting weather data (in this case, it returns a random temperature). This is an asynchronous function running on the server so you can fetch real data from an external API.

Now your chatbot can "fetch" weather information for any location the user asks about. When the model determines it needs to use the weather tool, it will generate a tool call with the necessary input. The `execute` function will then be automatically run, and the tool output will be added to the `messages` as a `tool` message.

You may need to restart your development server for the changes to take
effect.

Try asking something like "What's the weather in New York?" and see how the model uses the new tool.

Notice the blank response in the UI? This is because instead of generating a text response, the model generated a tool call. You can access the tool call and subsequent tool result on the client via the `tool-weather` part of the `message.parts` array.

Tool parts are always named `tool-{toolName}`, where `{toolName}` is the key
you used when defining the tool. In this case, since we defined the tool as
`weather`, the part type is `tool-weather`.

### [Update the UI](#update-the-ui)

To display the weather tool invocation in your UI, update your `app/(tabs)/index.tsx` file:

app/(tabs)/index.tsx

```
1

import { generateAPIUrl } from '@/utils';



2

import { useChat } from '@ai-sdk/react';



3

import { DefaultChatTransport } from 'ai';



4

import { fetch as expoFetch } from 'expo/fetch';



5

import { useState } from 'react';



6

import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';



7



8

export default function App() {



9

const [input, setInput] = useState('');



10

const { messages, error, sendMessage } = useChat({



11

transport: new DefaultChatTransport({



12

fetch: expoFetch as unknown as typeof globalThis.fetch,



13

api: generateAPIUrl('/api/chat'),



14

}),



15

onError: error => console.error(error, 'ERROR'),



16

});



17



18

if (error) return <Text>{error.message}</Text>;



19



20

return (



21

<SafeAreaView style={{ height: '100%' }}>



22

<View



23

style={{



24

height: '95%',



25

display: 'flex',



26

flexDirection: 'column',



27

paddingHorizontal: 8,



28

}}



29

>



30

<ScrollView style={{ flex: 1 }}>



31

{messages.map(m => (



32

<View key={m.id} style={{ marginVertical: 8 }}>



33

<View>



34

<Text style={{ fontWeight: 700 }}>{m.role}</Text>



35

{m.parts.map((part, i) => {



36

switch (part.type) {



37

case 'text':



38

return <Text key={`${m.id}-${i}`}>{part.text}</Text>;



39

case 'tool-weather':



40

return (



41

<Text key={`${m.id}-${i}`}>



42

{JSON.stringify(part, null, 2)}



43

</Text>



44

);



45

}



46

})}



47

</View>



48

</View>



49

))}



50

</ScrollView>



51



52

<View style={{ marginTop: 8 }}>



53

<TextInput



54

style={{ backgroundColor: 'white', padding: 8 }}



55

placeholder="Say something..."



56

value={input}



57

onChange={e => setInput(e.nativeEvent.text)}



58

onSubmitEditing={e => {



59

e.preventDefault();



60

sendMessage({ text: input });



61

setInput('');



62

}}



63

autoFocus={true}



64

/>



65

</View>



66

</View>



67

</SafeAreaView>



68

);



69

}
```

You may need to restart your development server for the changes to take
effect.

With this change, you're updating the UI to handle different message parts. For text parts, you display the text content as before. For weather tool invocations, you display a JSON representation of the tool call and its result.

Now, when you ask about the weather, you'll see the tool call and its result displayed in your chat interface.

[Enabling Multi-Step Tool Calls](#enabling-multi-step-tool-calls)
-----------------------------------------------------------------

You may have noticed that while the tool results are visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. By default, `stopWhen` is set to `isStepCount(1)`, which means generation stops after the first step when there are tool results. By changing this condition, you can allow the model to automatically send tool results back to itself to trigger additional generations until your specified stopping condition is met. In this case, you want the model to continue generating so it can use the weather tool results to answer your original question.

### [Update Your API Route](#update-your-api-route-1)

Modify your `app/api/chat+api.ts` file to include the `stopWhen` condition:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat+api.ts

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

import { z } from 'zod';



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

stopWhen: isStepCount(5),



19

tools: {



20

weather: tool({



21

description: 'Get the weather in a location (fahrenheit)',



22

inputSchema: z.object({



23

location: z.string().describe('The location to get the weather for'),



24

}),



25

execute: async ({ location }) => {



26

const temperature = Math.round(Math.random() * (90 - 32) + 32);



27

return {



28

location,



29

temperature,



30

};



31

},



32

}),



33

},



34

});



35



36

return createUIMessageStreamResponse({



37

stream: toUIMessageStream({ stream: result.stream }),



38

headers: {



39

'Content-Type': 'application/octet-stream',



40

'Content-Encoding': 'none',



41

},



42

});



43

}
```

You may need to restart your development server for the changes to take
effect.

Head back to the Expo app and ask about the weather in a location. You should now see the model using the weather tool results to answer your question.

By setting `stopWhen: isStepCount(5)`, you're allowing the model to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the model to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Fahrenheit to Celsius.

### [Add More Tools](#add-more-tools)

Update your `app/api/chat+api.ts` file to add a new tool to convert the temperature from Fahrenheit to Celsius:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat+api.ts

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

import { z } from 'zod';



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

stopWhen: isStepCount(5),



19

tools: {



20

weather: tool({



21

description: 'Get the weather in a location (fahrenheit)',



22

inputSchema: z.object({



23

location: z.string().describe('The location to get the weather for'),



24

}),



25

execute: async ({ location }) => {



26

const temperature = Math.round(Math.random() * (90 - 32) + 32);



27

return {



28

location,



29

temperature,



30

};



31

},



32

}),



33

convertFahrenheitToCelsius: tool({



34

description: 'Convert a temperature in fahrenheit to celsius',



35

inputSchema: z.object({



36

temperature: z



37

.number()



38

.describe('The temperature in fahrenheit to convert'),



39

}),



40

execute: async ({ temperature }) => {



41

const celsius = Math.round((temperature - 32) * (5 / 9));



42

return {



43

celsius,



44

};



45

},



46

}),



47

},



48

});



49



50

return createUIMessageStreamResponse({



51

stream: toUIMessageStream({ stream: result.stream }),



52

headers: {



53

'Content-Type': 'application/octet-stream',



54

'Content-Encoding': 'none',



55

},



56

});



57

}
```

You may need to restart your development server for the changes to take
effect.

### [Update the UI for the new tool](#update-the-ui-for-the-new-tool)

To display the temperature conversion tool invocation in your UI, update your `app/(tabs)/index.tsx` file to handle the new tool part:

app/(tabs)/index.tsx

```
1

import { generateAPIUrl } from '@/utils';



2

import { useChat } from '@ai-sdk/react';



3

import { DefaultChatTransport } from 'ai';



4

import { fetch as expoFetch } from 'expo/fetch';



5

import { useState } from 'react';



6

import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';



7



8

export default function App() {



9

const [input, setInput] = useState('');



10

const { messages, error, sendMessage } = useChat({



11

transport: new DefaultChatTransport({



12

fetch: expoFetch as unknown as typeof globalThis.fetch,



13

api: generateAPIUrl('/api/chat'),



14

}),



15

onError: error => console.error(error, 'ERROR'),



16

});



17



18

if (error) return <Text>{error.message}</Text>;



19



20

return (



21

<SafeAreaView style={{ height: '100%' }}>



22

<View



23

style={{



24

height: '95%',



25

display: 'flex',



26

flexDirection: 'column',



27

paddingHorizontal: 8,



28

}}



29

>



30

<ScrollView style={{ flex: 1 }}>



31

{messages.map(m => (



32

<View key={m.id} style={{ marginVertical: 8 }}>



33

<View>



34

<Text style={{ fontWeight: 700 }}>{m.role}</Text>



35

{m.parts.map((part, i) => {



36

switch (part.type) {



37

case 'text':



38

return <Text key={`${m.id}-${i}`}>{part.text}</Text>;



39

case 'tool-weather':



40

case 'tool-convertFahrenheitToCelsius':



41

return (



42

<Text key={`${m.id}-${i}`}>



43

{JSON.stringify(part, null, 2)}



44

</Text>



45

);



46

}



47

})}



48

</View>



49

</View>



50

))}



51

</ScrollView>



52



53

<View style={{ marginTop: 8 }}>



54

<TextInput



55

style={{ backgroundColor: 'white', padding: 8 }}



56

placeholder="Say something..."



57

value={input}



58

onChange={e => setInput(e.nativeEvent.text)}



59

onSubmitEditing={e => {



60

e.preventDefault();



61

sendMessage({ text: input });



62

setInput('');



63

}}



64

autoFocus={true}



65

/>



66

</View>



67

</View>



68

</SafeAreaView>



69

);



70

}
```

You may need to restart your development server for the changes to take
effect.

Now, when you ask "What's the weather in New York in celsius?", you should see a more complete interaction:

1. The model will call the weather tool for New York.
2. You'll see the tool result displayed.
3. It will then call the temperature conversion tool to convert the temperature from Fahrenheit to Celsius.
4. The model will then use that information to provide a natural language response about the weather in New York.

This multi-step approach allows the model to gather information and use it to provide more accurate and contextual responses, making your chatbot considerably more useful.

This simple example demonstrates how tools can expand your model's capabilities. You can create more complex tools to integrate with real APIs, databases, or any other external systems, allowing the model to access and process real-world data in real-time. Tools bridge the gap between the model's knowledge cutoff and current information.

[Polyfills](#polyfills)
-----------------------

Several functions that are internally used by the AI SDK might not available in the Expo runtime depending on your configuration and the target platform.

First, install the following packages:

pnpmnpmbunyarn

```
pnpm add @ungap/structured-clone @stardazed/streams-text-encoding
```

Then create a new file in the root of your project with the following polyfills:

polyfills.js

```
1

import { Platform } from 'react-native';



2

import structuredClone from '@ungap/structured-clone';



3



4

if (Platform.OS !== 'web') {



5

const setupPolyfills = async () => {



6

const { polyfillGlobal } =



7

await import('react-native/Libraries/Utilities/PolyfillFunctions');



8



9

const { TextEncoderStream, TextDecoderStream } =



10

await import('@stardazed/streams-text-encoding');



11



12

if (!('structuredClone' in global)) {



13

polyfillGlobal('structuredClone', () => structuredClone);



14

}



15



16

polyfillGlobal('TextEncoderStream', () => TextEncoderStream);



17

polyfillGlobal('TextDecoderStream', () => TextDecoderStream);



18

};



19



20

setupPolyfills();



21

}



22



23

export {};
```

Finally, import the polyfills in your root `_layout.tsx`:

\_layout.tsx

```
1

import '@/polyfills';
```

[Where to Next?](#where-to-next)
--------------------------------

You've built an AI chatbot using the AI SDK! From here, you have several paths to explore:

* To learn more about the AI SDK, read through the [documentation](/docs).
* If you're interested in diving deeper with guides, check out the [RAG (retrieval-augmented generation)](/cookbook/guides/rag-chatbot) and [multi-modal chatbot](/cookbook/guides/multi-modal-chatbot) guides.
* To jumpstart your first AI project, explore available [templates](https://vercel.com/templates?type=ai).

[Previous

Node.js](/docs/getting-started/nodejs)[Next

TanStack Start](/docs/getting-started/tanstack-start)
