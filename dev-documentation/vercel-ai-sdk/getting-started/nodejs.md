---
title: "Node.js Quickstart"
source_url: https://ai-sdk.dev/docs/getting-started/nodejs
section: getting-started
crawled: 2026-09-20
---

# Node.js Quickstart

> Source: https://ai-sdk.dev/docs/getting-started/nodejs

[Getting Started](/docs/getting-started)Node.js


[Node.js Quickstart](#nodejs-quickstart)
========================================

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

Start by creating a new directory using the `mkdir` command. Change into your new directory and then run the `pnpm init` command. This will create a `package.json` in your new directory.

```
1

mkdir my-ai-app



2

cd my-ai-app



3

pnpm init
```

### [Install Dependencies](#install-dependencies)

Install `ai`, the AI SDK, along with other necessary dependencies.

The AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about [available providers](/providers) and
[building custom providers](/providers/community-providers/custom-providers)
in the [providers](/providers) section.

```
1

pnpm add ai zod dotenv



2

pnpm add -D @types/node tsx typescript
```

The `ai` package contains the AI SDK. You will use `zod` to define type-safe schemas that you will pass to the large language model (LLM). You will use `dotenv` to access environment variables (your Vercel AI Gateway key) within your application. There are also three development dependencies, installed with the `-D` flag, that are necessary to run your TypeScript code.

### [Configure Vercel AI Gateway API key](#configure-vercel-ai-gateway-api-key)

Create a `.env` file in your project's root directory and add your Vercel AI Gateway API Key. This key is used to authenticate your application with the Vercel AI Gateway service.

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

The AI SDK will use the `AI_GATEWAY_API_KEY` environment variable to
authenticate with Vercel AI Gateway.

[Create Your Application](#create-your-application)
---------------------------------------------------

Create an `index.ts` file in the root of your project and add the following code:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

index.ts

```
1

import { ModelMessage, streamText } from 'ai';



2

import 'dotenv/config';



3

import * as readline from 'node:readline/promises';



4



5

const terminal = readline.createInterface({



6

input: process.stdin,



7

output: process.stdout,



8

});



9



10

const messages: ModelMessage[] = [];



11



12

async function main() {



13

while (true) {



14

const userInput = await terminal.question('You: ');



15



16

messages.push({ role: 'user', content: userInput });



17



18

const result = streamText({



19

model: "xai/grok-4.6",



20

messages,



21

});



22



23

let fullResponse = '';



24

process.stdout.write('\nAssistant: ');



25

for await (const delta of result.textStream) {



26

fullResponse += delta;



27

process.stdout.write(delta);



28

}



29

process.stdout.write('\n\n');



30



31

messages.push({ role: 'assistant', content: fullResponse });



32

}



33

}



34



35

main().catch(console.error);
```

Let's take a look at what is happening in this code:

1. Set up a readline interface to take input from the terminal, enabling interactive sessions directly from the command line.
2. Initialize an array called `messages` to store the history of your conversation. This history allows the agent to maintain context in ongoing dialogues.
3. In the `main` function:

* Prompt for and capture user input, storing it in `userInput`.
* Add user input to the `messages` array as a user message.
* Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider and `messages`.
* Iterate over the text stream returned by the `streamText` function (`result.textStream`) and print the contents of the stream to the terminal.
* Add the assistant's response to the `messages` array.

[Running Your Application](#running-your-application)
-----------------------------------------------------

With that, you have built everything you need for your agent! To start your application, use the command:

```
pnpm tsx index.ts
```

You should see a prompt in your terminal. Test it out by entering a message and see the AI agent respond in real-time! The AI SDK makes it fast and easy to build AI chat interfaces with Node.js.

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

[Enhance Your Agent with Tools](#enhance-your-agent-with-tools)
---------------------------------------------------------------

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](/docs/ai-sdk-core/tools-and-tool-calling) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the agent would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your agent by adding a simple weather tool.

### [Update Your Application](#update-your-application)

Modify your `index.ts` file to include the new weather tool:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

index.ts

```
1

import { ModelMessage, streamText, tool } from 'ai';



2

import 'dotenv/config';



3

import { z } from 'zod';



4

import * as readline from 'node:readline/promises';



5



6

const terminal = readline.createInterface({



7

input: process.stdin,



8

output: process.stdout,



9

});



10



11

const messages: ModelMessage[] = [];



12



13

async function main() {



14

while (true) {



15

const userInput = await terminal.question('You: ');



16



17

messages.push({ role: 'user', content: userInput });



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages,



22

tools: {



23

weather: tool({



24

description: 'Get the weather in a location (fahrenheit)',



25

inputSchema: z.object({



26

location: z



27

.string()



28

.describe('The location to get the weather for'),



29

}),



30

execute: async ({ location }) => {



31

const temperature = Math.round(Math.random() * (90 - 32) + 32);



32

return {



33

location,



34

temperature,



35

};



36

},



37

}),



38

},



39

});



40



41

let fullResponse = '';



42

process.stdout.write('\nAssistant: ');



43

for await (const delta of result.textStream) {



44

fullResponse += delta;



45

process.stdout.write(delta);



46

}



47

process.stdout.write('\n\n');



48



49

messages.push({ role: 'assistant', content: fullResponse });



50

}



51

}



52



53

main().catch(console.error);
```

In this updated code:

1. You import the `tool` function from the `ai` package.
2. You define a `tools` object with a `weather` tool. This tool:
   * Has a description that helps the agent understand when to use it.
   * Defines `inputSchema` using a Zod schema, specifying that it requires a `location` string to execute this tool. The agent will attempt to extract this input from the context of the conversation. If it can't, it will ask the user for the missing information.
   * Defines an `execute` function that simulates getting weather data (in this case, it returns a random temperature). This is an asynchronous function running on the server so you can fetch real data from an external API.

Now your agent can "fetch" weather information for any location the user asks about. When the agent determines it needs to use the weather tool, it will generate a tool call with the necessary parameters. The `execute` function will then be automatically run, and the results will be used by the agent to generate its response.

Try asking something like "What's the weather in New York?" and see how the agent uses the new tool.

Notice the blank "assistant" response? This is because instead of generating a text response, the agent generated a tool call. You can access the tool call and subsequent tool result in the `toolCall` and `toolResult` keys of the result object.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ModelMessage, streamText, tool } from 'ai';



2

import 'dotenv/config';



3

import { z } from 'zod';



4

import * as readline from 'node:readline/promises';



5



6

const terminal = readline.createInterface({



7

input: process.stdin,



8

output: process.stdout,



9

});



10



11

const messages: ModelMessage[] = [];



12



13

async function main() {



14

while (true) {



15

const userInput = await terminal.question('You: ');



16



17

messages.push({ role: 'user', content: userInput });



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages,



22

tools: {



23

weather: tool({



24

description: 'Get the weather in a location (fahrenheit)',



25

inputSchema: z.object({



26

location: z



27

.string()



28

.describe('The location to get the weather for'),



29

}),



30

execute: async ({ location }) => {



31

const temperature = Math.round(Math.random() * (90 - 32) + 32);



32

return {



33

location,



34

temperature,



35

};



36

},



37

}),



38

},



39

});



40



41

let fullResponse = '';



42

process.stdout.write('\nAssistant: ');



43

for await (const delta of result.textStream) {



44

fullResponse += delta;



45

process.stdout.write(delta);



46

}



47

process.stdout.write('\n\n');



48



49

console.log(await result.toolCalls);



50

console.log(await result.toolResults);



51

messages.push({ role: 'assistant', content: fullResponse });



52

}



53

}



54



55

main().catch(console.error);
```

Now, when you ask about the weather, you'll see the tool call and its result displayed in your chat interface.

[Enabling Multi-Step Tool Calls](#enabling-multi-step-tool-calls)
-----------------------------------------------------------------

You may have noticed that while the tool results are visible in the chat interface, the agent isn't using this information to answer your original query. This is because once the agent generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. This feature will automatically send tool results back to the agent to trigger an additional generation until the stopping condition you define is met. In this case, you want the agent to answer your question using the results from the weather tool.

### [Update Your Application](#update-your-application-1)

Modify your `index.ts` file to configure stopping conditions with `stopWhen`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

index.ts

```
1

import { ModelMessage, streamText, tool, isStepCount } from 'ai';



2

import 'dotenv/config';



3

import { z } from 'zod';



4

import * as readline from 'node:readline/promises';



5



6

const terminal = readline.createInterface({



7

input: process.stdin,



8

output: process.stdout,



9

});



10



11

const messages: ModelMessage[] = [];



12



13

async function main() {



14

while (true) {



15

const userInput = await terminal.question('You: ');



16



17

messages.push({ role: 'user', content: userInput });



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages,



22

tools: {



23

weather: tool({



24

description: 'Get the weather in a location (fahrenheit)',



25

inputSchema: z.object({



26

location: z



27

.string()



28

.describe('The location to get the weather for'),



29

}),



30

execute: async ({ location }) => {



31

const temperature = Math.round(Math.random() * (90 - 32) + 32);



32

return {



33

location,



34

temperature,



35

};



36

},



37

}),



38

},



39

stopWhen: isStepCount(5),



40

onStepEnd: async ({ toolResults }) => {



41

if (toolResults.length) {



42

console.log(JSON.stringify(toolResults, null, 2));



43

}



44

},



45

});



46



47

let fullResponse = '';



48

process.stdout.write('\nAssistant: ');



49

for await (const delta of result.textStream) {



50

fullResponse += delta;



51

process.stdout.write(delta);



52

}



53

process.stdout.write('\n\n');



54



55

messages.push({ role: 'assistant', content: fullResponse });



56

}



57

}



58



59

main().catch(console.error);
```

In this updated code:

1. You set `stopWhen` to be when `isStepCount` 5, allowing the agent to use up to 5 "steps" for any given generation.
2. You add an `onStepEnd` callback to log any `toolResults` from each step of the interaction, helping you understand the agent's tool usage. This means we can also delete the `toolCall` and `toolResult` `console.log` statements from the previous example.

Now, when you ask about the weather in a location, you should see the agent using the weather tool results to answer your question.

By setting `stopWhen: isStepCount(5)`, you're allowing the agent to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the agent to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Celsius to Fahrenheit.

### [Adding a second tool](#adding-a-second-tool)

Update your `index.ts` file to add a new tool to convert the temperature from Celsius to Fahrenheit:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

index.ts

```
1

import { ModelMessage, streamText, tool, isStepCount } from 'ai';



2

import 'dotenv/config';



3

import { z } from 'zod';



4

import * as readline from 'node:readline/promises';



5



6

const terminal = readline.createInterface({



7

input: process.stdin,



8

output: process.stdout,



9

});



10



11

const messages: ModelMessage[] = [];



12



13

async function main() {



14

while (true) {



15

const userInput = await terminal.question('You: ');



16



17

messages.push({ role: 'user', content: userInput });



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages,



22

tools: {



23

weather: tool({



24

description: 'Get the weather in a location (fahrenheit)',



25

inputSchema: z.object({



26

location: z



27

.string()



28

.describe('The location to get the weather for'),



29

}),



30

execute: async ({ location }) => {



31

const temperature = Math.round(Math.random() * (90 - 32) + 32);



32

return {



33

location,



34

temperature,



35

};



36

},



37

}),



38

convertFahrenheitToCelsius: tool({



39

description: 'Convert a temperature in fahrenheit to celsius',



40

inputSchema: z.object({



41

temperature: z



42

.number()



43

.describe('The temperature in fahrenheit to convert'),



44

}),



45

execute: async ({ temperature }) => {



46

const celsius = Math.round((temperature - 32) * (5 / 9));



47

return {



48

celsius,



49

};



50

},



51

}),



52

},



53

stopWhen: isStepCount(5),



54

onStepEnd: async ({ toolResults }) => {



55

if (toolResults.length) {



56

console.log(JSON.stringify(toolResults, null, 2));



57

}



58

},



59

});



60



61

let fullResponse = '';



62

process.stdout.write('\nAssistant: ');



63

for await (const delta of result.textStream) {



64

fullResponse += delta;



65

process.stdout.write(delta);



66

}



67

process.stdout.write('\n\n');



68



69

messages.push({ role: 'assistant', content: fullResponse });



70

}



71

}



72



73

main().catch(console.error);
```

Now, when you ask "What's the weather in New York in celsius?", you should see a more complete interaction:

1. The agent will call the weather tool for New York.
2. You'll see the tool result logged.
3. It will then call the temperature conversion tool to convert the temperature from Fahrenheit to Celsius.
4. The agent will then use that information to provide a natural language response about the weather in New York.

This multi-step approach allows the agent to gather information and use it to provide more accurate and contextual responses, making your agent considerably more useful.

This example demonstrates how tools can expand your agent's capabilities. You can create more complex tools to integrate with real APIs, databases, or any other external systems, allowing the agent to access and process real-world data in real-time and perform actions that interact with the outside world. Tools bridge the gap between the agent's knowledge cutoff and current information, while also enabling it to take meaningful actions beyond just generating text responses.

[Where to Next?](#where-to-next)
--------------------------------

You've built an AI agent using the AI SDK! From here, you have several paths to explore:

* To learn more about the AI SDK, read through the [documentation](/docs).
* If you're interested in diving deeper with guides, check out the [RAG (retrieval-augmented generation)](/cookbook/guides/rag-chatbot) and [multi-modal chatbot](/cookbook/guides/multi-modal-chatbot) guides.
* To jumpstart your first AI project, explore available [templates](https://vercel.com/templates?type=ai).

[Previous

Vue.js (Nuxt)](/docs/getting-started/nuxt)[Next

Expo](/docs/getting-started/expo)
