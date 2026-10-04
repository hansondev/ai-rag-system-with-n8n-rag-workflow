---
title: "Streaming Values"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/streaming-values
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Streaming Values

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/streaming-values

[AI SDK RSC](/docs/ai-sdk-rsc)Streaming Values


[Streaming Values](#streaming-values)
=====================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

The RSC API provides several utility functions to allow you to stream values from the server to the client. This is useful when you need more granular control over what you are streaming and how you are streaming it.

These utilities can also be paired with [AI SDK Core](/docs/ai-sdk-core)
functions like [`streamText`](/docs/reference/ai-sdk-core/stream-text) to
easily stream LLM generations from the server to the client.

There are two functions provided by the RSC API that allow you to create streamable values:

* [`createStreamableValue`](/docs/reference/ai-sdk-rsc/create-streamable-value) - creates a streamable (serializable) value, with full control over how you create, update, and close the stream.
* [`createStreamableUI`](/docs/reference/ai-sdk-rsc/create-streamable-ui) - creates a streamable React component, with full control over how you create, update, and close the stream.

[`createStreamableValue`](#createstreamablevalue)
-------------------------------------------------

The RSC API allows you to stream serializable JavaScript values from the server to the client using [`createStreamableValue`](/docs/reference/ai-sdk-rsc/create-streamable-value), such as strings, numbers, objects, and arrays.

This is useful when you want to stream:

* Text generations from the language model in real-time.
* Buffer values of image and audio generations from multi-modal models.
* Progress updates from multi-step agent runs.

[Creating a Streamable Value](#creating-a-streamable-value)
-----------------------------------------------------------

You can import `createStreamableValue` from `@ai-sdk/rsc` and use it to create a streamable value.

```
1

'use server';



2



3

import { createStreamableValue } from '@ai-sdk/rsc';



4



5

export const runThread = async () => {



6

const streamableStatus = createStreamableValue('thread.init');



7



8

setTimeout(() => {



9

streamableStatus.update('thread.run.create');



10

streamableStatus.update('thread.run.update');



11

streamableStatus.update('thread.run.end');



12

streamableStatus.done('thread.end');



13

}, 1000);



14



15

return {



16

status: streamableStatus.value,



17

};



18

};
```

[Reading a Streamable Value](#reading-a-streamable-value)
---------------------------------------------------------

You can read streamable values on the client using `readStreamableValue`. It returns an async iterator that yields the value of the streamable as it is updated:

```
1

import { readStreamableValue } from '@ai-sdk/rsc';



2

import { runThread } from '@/actions';



3



4

export default function Page() {



5

return (



6

<button



7

onClick={async () => {



8

const { status } = await runThread();



9



10

for await (const value of readStreamableValue(status)) {



11

console.log(value);



12

}



13

}}



14

>



15

Ask



16

</button>



17

);



18

}
```

Learn how to stream a text generation (with `streamText`) using the Next.js App Router and `createStreamableValue` in this [example](/examples/next-app/basics/streaming-text-generation).

[`createStreamableUI`](#createstreamableui)
-------------------------------------------

`createStreamableUI` creates a stream that holds a React component. Unlike AI SDK Core APIs, this function does not call a large language model. Instead, it provides a primitive that can be used to have granular control over streaming a React component.

[Using `createStreamableUI`](#using-createstreamableui)
-------------------------------------------------------

Let's look at how you can use the `createStreamableUI` function with a Server Action.

app/actions.tsx

```
1

'use server';



2



3

import { createStreamableUI } from '@ai-sdk/rsc';



4



5

export async function getWeather() {



6

const weatherUI = createStreamableUI();



7



8

weatherUI.update(<div style={{ color: 'gray' }}>Loading...</div>);



9



10

setTimeout(() => {



11

weatherUI.done(<div>It&apos;s a sunny day!</div>);



12

}, 1000);



13



14

return weatherUI.value;



15

}
```

First, you create a streamable UI with an empty state and then update it with a loading message. After 1 second, you mark the stream as done passing in the actual weather information as its final value. The `.value` property contains the actual UI that can be sent to the client.

[Reading a Streamable UI](#reading-a-streamable-ui)
---------------------------------------------------

On the client side, you can call the `getWeather` Server Action and render the returned UI like any other React component.

app/page.tsx

```
1

'use client';



2



3

import { useState } from 'react';



4

import { readStreamableValue } from '@ai-sdk/rsc';



5

import { getWeather } from '@/actions';



6



7

export default function Page() {



8

const [weather, setWeather] = useState<React.ReactNode | null>(null);



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

const weatherUI = await getWeather();



15

setWeather(weatherUI);



16

}}



17

>



18

What&apos;s the weather?



19

</button>



20



21

{weather}



22

</div>



23

);



24

}
```

When the button is clicked, the `getWeather` function is called, and the returned UI is set to the `weather` state and rendered on the page. Users will see the loading message first and then the actual weather information after 1 second.

Learn more about handling multiple streams in a single request in the [Multiple Streamables](/docs/advanced/multiple-streamables) guide.

Learn more about handling state for more complex use cases with  [AI/UI State](/docs/ai-sdk-rsc/generative-ui-state) .

[Previous

Multistep Interfaces](/docs/ai-sdk-rsc/multistep-interfaces)[Next

Handling Loading State](/docs/ai-sdk-rsc/loading-state)
