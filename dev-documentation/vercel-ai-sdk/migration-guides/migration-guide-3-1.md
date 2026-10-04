---
title: "Migrate AI SDK 3.0 to 3.1"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-3-1
section: migration-guides
crawled: 2026-09-20
---

# Migrate AI SDK 3.0 to 3.1

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-3-1

[Migration Guides](/docs/migration-guides)Migrate AI SDK 3.0 to 3.1


[Migrate AI SDK 3.0 to 3.1](#migrate-ai-sdk-30-to-31)
=====================================================

Check out the [AI SDK 3.1 release blog
post](https://vercel.com/blog/vercel-ai-sdk-3-1-modelfusion-joins-the-team)
for more information about the release.

This guide will help you:

* Upgrade to AI SDK 3.1
* Migrate from Legacy Providers to AI SDK Core
* Migrate from [`render`](/docs/reference/ai-sdk-rsc/render) to [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui)

Upgrading to AI SDK 3.1 does not require using the newly released AI SDK Core API or [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui) function.

[Upgrading](#upgrading)
-----------------------

### [AI SDK](#ai-sdk)

To update to AI SDK version 3.1, run the following command using your preferred package manager:

```
pnpm add ai@3.1
```

[Next Steps](#next-steps)
-------------------------

The release of AI SDK 3.1 introduces several new features that improve the way you build AI applications with the SDK:

* AI SDK Core, a brand new unified API for interacting with large language models (LLMs).
* [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui), a new abstraction, built upon AI SDK Core functions that simplifies building streaming UIs.

[Migrating from Legacy Providers to AI SDK Core](#migrating-from-legacy-providers-to-ai-sdk-core)
-------------------------------------------------------------------------------------------------

Prior to AI SDK Core, you had to use a model provider's SDK to query their models.

In the following Route Handler, you use the OpenAI SDK to query their model. You then pipe that response into the `OpenAIStream` function which returns a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) that you can pass to the client using a new `StreamingTextResponse`.

```
1

import OpenAI from 'openai';



2

import { OpenAIStream, StreamingTextResponse } from 'ai';



3



4

const openai = new OpenAI({



5

apiKey: process.env.OPENAI_API_KEY!,



6

});



7



8

export async function POST(req: Request) {



9

const { messages } = await req.json();



10



11

const response = await openai.chat.completions.create({



12

model: 'gpt-4.1',



13

stream: true,



14

messages,



15

});



16



17

const stream = OpenAIStream(response);



18



19

return new StreamingTextResponse(stream);



20

}
```

With AI SDK Core you have a unified API for any provider that implements the [AI SDK Language Model Specification](/providers/community-providers/custom-providers).

Let’s take a look at the example above, but refactored to utilize the AI SDK Core API alongside the AI SDK OpenAI provider. In this example, you import the LLM function you want to use from the `ai` package, import the OpenAI provider from `@ai-sdk/openai`, and then you call the model and return the response using the `toDataStreamResponse()` helper function.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

export async function POST(req: Request) {



5

const { messages } = await req.json();



6



7

const result = await streamText({



8

model: "xai/grok-4.6",



9

messages,



10

});



11



12

return result.toUIMessageStreamResponse();



13

}
```

[Migrating from `render` to `streamUI`](#migrating-from-render-to-streamui)
---------------------------------------------------------------------------

The AI SDK RSC API was launched as part of version 3.0. This API introduced the [`render`](/docs/reference/ai-sdk-rsc/render) function, a helper function to create streamable UIs with OpenAI models. With the new AI SDK Core API, it became possible to make streamable UIs possible with any compatible provider.

The following example Server Action uses the `render` function using the model provider directly from OpenAI. You first create an OpenAI provider instance with the OpenAI SDK. Then, you pass it to the provider key of the render function alongside a tool that returns a React Server Component, defined in the `render` key of the tool.

```
1

import { render } from '@ai-sdk/rsc';



2

import OpenAI from 'openai';



3

import { z } from 'zod';



4

import { Spinner, Weather } from '@/components';



5

import { getWeather } from '@/utils';



6



7

const openai = new OpenAI();



8



9

async function submitMessage(userInput = 'What is the weather in SF?') {



10

'use server';



11



12

return render({



13

provider: openai,



14

model: 'gpt-4.1',



15

messages: [



16

{ role: 'system', content: 'You are a helpful assistant' },



17

{ role: 'user', content: userInput },



18

],



19

text: ({ content }) => <p>{content}</p>,



20

tools: {



21

get_city_weather: {



22

description: 'Get the current weather for a city',



23

parameters: z



24

.object({



25

city: z.string().describe('the city'),



26

})



27

.required(),



28

render: async function* ({ city }) {



29

yield <Spinner />;



30

const weather = await getWeather(city);



31

return <Weather info={weather} />;



32

},



33

},



34

},



35

});



36

}
```

With the new [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui) function, you can now use any compatible AI SDK provider. In this example, you import the AI SDK OpenAI provider. Then, you pass it to the [`model`](/docs/reference/ai-sdk-rsc/stream-ui#model) key of the new [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui) function. Finally, you declare a tool and return a React Server Component, defined in the [`generate`](/docs/reference/ai-sdk-rsc/stream-ui#tools.tool.generate) key of the tool.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamUI } from '@ai-sdk/rsc';



2

import { openai } from '@ai-sdk/openai';



3

import { z } from 'zod';



4

import { Spinner, Weather } from '@/components';



5

import { getWeather } from '@/utils';



6



7

async function submitMessage(userInput = 'What is the weather in SF?') {



8

'use server';



9



10

const result = await streamUI({



11

model: "xai/grok-4.6",



12

system: 'You are a helpful assistant',



13

messages: [{ role: 'user', content: userInput }],



14

text: ({ content }) => <p>{content}</p>,



15

tools: {



16

get_city_weather: {



17

description: 'Get the current weather for a city',



18

parameters: z



19

.object({



20

city: z.string().describe('Name of the city'),



21

})



22

.required(),



23

generate: async function* ({ city }) {



24

yield <Spinner />;



25

const weather = await getWeather(city);



26

return <Weather info={weather} />;



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

return result.value;



33

}
```

[Previous

Migrate AI SDK 3.1 to 3.2](/docs/migration-guides/migration-guide-3-2)[Next

Troubleshooting](/docs/troubleshooting)
