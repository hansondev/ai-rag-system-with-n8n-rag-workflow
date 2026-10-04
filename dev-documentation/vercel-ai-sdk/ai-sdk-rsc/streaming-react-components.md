---
title: "Streaming React Components"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/streaming-react-components
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Streaming React Components

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/streaming-react-components

[AI SDK RSC](/docs/ai-sdk-rsc)Streaming React Components


[Streaming React Components](#streaming-react-components)
=========================================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

The RSC API allows you to stream React components from the server to the client with the [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui) function. This is useful when you want to go beyond raw text and stream components to the client in real-time.

Similar to  [AI SDK Core](/docs/ai-sdk-core/overview)  APIs (like  [`streamText`](/docs/reference/ai-sdk-core/stream-text) ), `streamUI` provides a single function to call a model and allow it to respond with React Server Components.
It supports the same model interfaces as AI SDK Core APIs.

### [Concepts](#concepts)

To give the model the ability to respond to a user's prompt with a React component, you can leverage [tools](/docs/ai-sdk-core/tools-and-tool-calling).

Remember, tools are like programs you can give to the model, and the model can
decide as and when to use based on the context of the conversation.

With the `streamUI` function, **you provide tools that return React components**. With the ability to stream components, the model is akin to a dynamic router that is able to understand the user's intention and display relevant UI.

At a high level, the `streamUI` works like other AI SDK Core functions: you can provide the model with a prompt or some conversation history and, optionally, some tools. If the model decides, based on the context of the conversation, to call a tool, it will generate a tool call. The `streamUI` function will then run the respective tool, returning a React component. If the model doesn't have a relevant tool to use, it will return a text generation, which will be passed to the `text` function, for you to handle (render and return as a React component).

Remember, the `streamUI` function must return a React component.

```
1

const result = await streamUI({



2

model: openai('gpt-4o'),



3

prompt: 'Get the weather for San Francisco',



4

text: ({ content }) => <div>{content}</div>,



5

tools: {},



6

});
```

This example calls the `streamUI` function using OpenAI's `gpt-4o` model, passes a prompt, specifies how the model's plain text response (`content`) should be rendered, and then provides an empty object for tools. Even though this example does not define any tools, it will stream the model's response as a `div` rather than plain text.

### [Adding A Tool](#adding-a-tool)

Using tools with `streamUI` is similar to how you use tools with `generateText` and `streamText`.
A tool is an object that has:

* `description`: a string telling the model what the tool does and when to use it
* `inputSchema`: a Zod schema describing what the tool needs in order to run
* `generate`: an asynchronous function that will be run if the model calls the tool. This must return a React component

Let's expand the previous example to add a tool.

```
1

const result = await streamUI({



2

model: openai('gpt-4o'),



3

prompt: 'Get the weather for San Francisco',



4

text: ({ content }) => <div>{content}</div>,



5

tools: {



6

getWeather: {



7

description: 'Get the weather for a location',



8

inputSchema: z.object({ location: z.string() }),



9

generate: async function* ({ location }) {



10

yield <LoadingComponent />;



11

const weather = await getWeather(location);



12

return <WeatherComponent weather={weather} location={location} />;



13

},



14

},



15

},



16

});
```

This tool would be run if the user asks for the weather for their location. If the user hasn't specified a location, the model will ask for it before calling the tool. When the model calls the tool, the generate function will initially return a loading component. This component will show until the awaited call to `getWeather` is resolved, at which point, the model will stream the `<WeatherComponent />` to the user.

Note: This example uses a  [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
(`function*`), which allows you to pause its execution and return a value,
then resume from where it left off on the next call. This is useful for
handling data streams, as you can fetch and return data from an asynchronous
source like an API, then resume the function to fetch the next chunk when
needed. By yielding values one at a time, generator functions enable efficient
processing of streaming data without blocking the main thread.

[Using `streamUI` with Next.js](#using-streamui-with-nextjs)
------------------------------------------------------------

Let's see how you can use the example above in a Next.js application.

To use `streamUI` in a Next.js application, you will need two things:

1. A Server Action (where you will call `streamUI`)
2. A page to call the Server Action and render the resulting components

### [Step 1: Create a Server Action](#step-1-create-a-server-action)

Server Actions are server-side functions that you can call directly from the
frontend. For more info, see [the
documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#with-client-components).

Create a Server Action at `app/actions.tsx` and add the following code:

app/actions.tsx

```
1

'use server';



2



3

import { streamUI } from '@ai-sdk/rsc';



4

import { openai } from '@ai-sdk/openai';



5

import { z } from 'zod';



6



7

const LoadingComponent = () => (



8

<div className="animate-pulse p-4">getting weather...</div>



9

);



10



11

const getWeather = async (location: string) => {



12

await new Promise(resolve => setTimeout(resolve, 2000));



13

return '82°F️ ☀️';



14

};



15



16

interface WeatherProps {



17

location: string;



18

weather: string;



19

}



20



21

const WeatherComponent = (props: WeatherProps) => (



22

<div className="border border-neutral-200 p-4 rounded-lg max-w-fit">



23

The weather in {props.location} is {props.weather}



24

</div>



25

);



26



27

export async function streamComponent() {



28

const result = await streamUI({



29

model: openai('gpt-4o'),



30

prompt: 'Get the weather for San Francisco',



31

text: ({ content }) => <div>{content}</div>,



32

tools: {



33

getWeather: {



34

description: 'Get the weather for a location',



35

inputSchema: z.object({



36

location: z.string(),



37

}),



38

generate: async function* ({ location }) {



39

yield <LoadingComponent />;



40

const weather = await getWeather(location);



41

return <WeatherComponent weather={weather} location={location} />;



42

},



43

},



44

},



45

});



46



47

return result.value;



48

}
```

The `getWeather` tool should look familiar as it is identical to the example in the previous section. In order for this tool to work:

1. First define a `LoadingComponent`, which renders a pulsing `div` that will show some loading text.
2. Next, define a `getWeather` function that will timeout for 2 seconds (to simulate fetching the weather externally) before returning the "weather" for a `location`. Note: you could run any asynchronous TypeScript code here.
3. Finally, define a `WeatherComponent` which takes in `location` and `weather` as props, which are then rendered within a `div`.

Your Server Action is an asynchronous function called `streamComponent` that takes no inputs, and returns a `ReactNode`. Within the action, you call the `streamUI` function, specifying the model (`gpt-4o`), the prompt, the component that should be rendered if the model chooses to return text, and finally, your `getWeather` tool. Last but not least, you return the resulting component generated by the model with `result.value`.

To call this Server Action and display the resulting React Component, you will need a page.

### [Step 2: Create a Page](#step-2-create-a-page)

Create or update your root page (`app/page.tsx`) with the following code:

app/page.tsx

```
1

'use client';



2



3

import { useState } from 'react';



4

import { Button } from '@/components/ui/button';



5

import { streamComponent } from './actions';



6



7

export default function Page() {



8

const [component, setComponent] = useState<React.ReactNode>();



9



10

return (



11

<div>



12

<form



13

onSubmit={async e => {



14

e.preventDefault();



15

setComponent(await streamComponent());



16

}}



17

>



18

<Button>Stream Component</Button>



19

</form>



20

<div>{component}</div>



21

</div>



22

);



23

}
```

This page is first marked as a client component with the `"use client";` directive given it will be using hooks and interactivity. On the page, you render a form. When that form is submitted, you call the `streamComponent` action created in the previous step (just like any other function). The `streamComponent` action returns a `ReactNode` that you can then render on the page using React state (`setComponent`).

[Going beyond a single prompt](#going-beyond-a-single-prompt)
-------------------------------------------------------------

You can now allow the model to respond to your prompt with a React component. However, this example is limited to a static prompt that is set within your Server Action. You could make this example interactive by turning it into a chatbot.

Learn how to stream React components with the Next.js App Router using `streamUI` with this [example](/examples/next-app/interface/route-components).

[Previous

Overview](/docs/ai-sdk-rsc/overview)[Next

Managing Generative UI State](/docs/ai-sdk-rsc/generative-ui-state)
