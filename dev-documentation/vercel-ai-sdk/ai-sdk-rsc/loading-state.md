---
title: "Handling Loading State"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/loading-state
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Handling Loading State

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/loading-state

[AI SDK RSC](/docs/ai-sdk-rsc)Handling Loading State


[Handling Loading State](#handling-loading-state)
=================================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Given that responses from language models can often take a while to complete, it's crucial to be able to show loading state to users. This provides visual feedback that the system is working on their request and helps maintain a positive user experience.

There are three approaches you can take to handle loading state with the AI SDK RSC:

* Managing loading state similar to how you would in a traditional Next.js application. This involves setting a loading state variable in the client and updating it when the response is received.
* Streaming loading state from the server to the client. This approach allows you to track loading state on a more granular level and provide more detailed feedback to the user.
* Streaming loading component from the server to the client. This approach allows you to stream a React Server Component to the client while awaiting the model's response.

[Handling Loading State on the Client](#handling-loading-state-on-the-client)
-----------------------------------------------------------------------------

### [Client](#client)

Let's create a simple Next.js page that will call the `generateResponse` function when the form is submitted. The function will take in the user's prompt (`input`) and then generate a response (`response`). To handle the loading state, use the `loading` state variable. When the form is submitted, set `loading` to `true`, and when the response is received, set it back to `false`. While the response is being streamed, the input field will be disabled.

app/page.tsx

```
1

'use client';



2



3

import { useState } from 'react';



4

import { generateResponse } from './actions';



5

import { readStreamableValue } from '@ai-sdk/rsc';



6



7

// Force the page to be dynamic and allow streaming responses up to 30 seconds



8

export const maxDuration = 30;



9



10

export default function Home() {



11

const [input, setInput] = useState<string>('');



12

const [generation, setGeneration] = useState<string>('');



13

const [loading, setLoading] = useState<boolean>(false);



14



15

return (



16

<div>



17

<div>{generation}</div>



18

<form



19

onSubmit={async e => {



20

e.preventDefault();



21

setLoading(true);



22

const response = await generateResponse(input);



23



24

let textContent = '';



25



26

for await (const delta of readStreamableValue(response)) {



27

textContent = `${textContent}${delta}`;



28

setGeneration(textContent);



29

}



30

setInput('');



31

setLoading(false);



32

}}



33

>



34

<input



35

type="text"



36

value={input}



37

disabled={loading}



38

className="disabled:opacity-50"



39

onChange={event => {



40

setInput(event.target.value);



41

}}



42

/>



43

<button>Send Message</button>



44

</form>



45

</div>



46

);



47

}
```

### [Server](#server)

Now let's implement the `generateResponse` function. Use the `streamText` function to generate a response to the input.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/actions.ts

```
1

'use server';



2



3

import { streamText } from 'ai';



4

import { createStreamableValue } from '@ai-sdk/rsc';



5



6

export async function generateResponse(prompt: string) {



7

const stream = createStreamableValue();



8



9

(async () => {



10

const { textStream } = streamText({



11

model: "xai/grok-4.6",



12

prompt,



13

});



14



15

for await (const text of textStream) {



16

stream.update(text);



17

}



18



19

stream.done();



20

})();



21



22

return stream.value;



23

}
```

[Streaming Loading State from the Server](#streaming-loading-state-from-the-server)
-----------------------------------------------------------------------------------

If you are looking to track loading state on a more granular level, you can create a new streamable value to store a custom variable and then read this on the frontend. Let's update the example to create a new streamable value for tracking loading state:

### [Server](#server-1)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/actions.ts

```
1

'use server';



2



3

import { streamText } from 'ai';



4

import { createStreamableValue } from '@ai-sdk/rsc';



5



6

export async function generateResponse(prompt: string) {



7

const stream = createStreamableValue();



8

const loadingState = createStreamableValue({ loading: true });



9



10

(async () => {



11

const { textStream } = streamText({



12

model: "xai/grok-4.6",



13

prompt,



14

});



15



16

for await (const text of textStream) {



17

stream.update(text);



18

}



19



20

stream.done();



21

loadingState.done({ loading: false });



22

})();



23



24

return { response: stream.value, loadingState: loadingState.value };



25

}
```

### [Client](#client-1)

app/page.tsx

```
1

'use client';



2



3

import { useState } from 'react';



4

import { generateResponse } from './actions';



5

import { readStreamableValue } from '@ai-sdk/rsc';



6



7

// Force the page to be dynamic and allow streaming responses up to 30 seconds



8

export const maxDuration = 30;



9



10

export default function Home() {



11

const [input, setInput] = useState<string>('');



12

const [generation, setGeneration] = useState<string>('');



13

const [loading, setLoading] = useState<boolean>(false);



14



15

return (



16

<div>



17

<div>{generation}</div>



18

<form



19

onSubmit={async e => {



20

e.preventDefault();



21

setLoading(true);



22

const { response, loadingState } = await generateResponse(input);



23



24

let textContent = '';



25



26

for await (const responseDelta of readStreamableValue(response)) {



27

textContent = `${textContent}${responseDelta}`;



28

setGeneration(textContent);



29

}



30

for await (const loadingDelta of readStreamableValue(loadingState)) {



31

if (loadingDelta) {



32

setLoading(loadingDelta.loading);



33

}



34

}



35

setInput('');



36

setLoading(false);



37

}}



38

>



39

<input



40

type="text"



41

value={input}



42

disabled={loading}



43

className="disabled:opacity-50"



44

onChange={event => {



45

setInput(event.target.value);



46

}}



47

/>



48

<button>Send Message</button>



49

</form>



50

</div>



51

);



52

}
```

This allows you to provide more detailed feedback about the generation process to your users.

[Streaming Loading Components with `streamUI`](#streaming-loading-components-with-streamui)
-------------------------------------------------------------------------------------------

If you are using the  [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui)  function, you can stream the loading state to the client in the form of a React component. `streamUI` supports the usage of  [JavaScript generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) , which allow you to yield some value (in this case a React component) while some other blocking work completes.

[Server](#server-2)
-------------------

```
1

'use server';



2



3

import { openai } from '@ai-sdk/openai';



4

import { streamUI } from '@ai-sdk/rsc';



5



6

export async function generateResponse(prompt: string) {



7

const result = await streamUI({



8

model: openai('gpt-4o'),



9

prompt,



10

text: async function* ({ content }) {



11

yield <div>loading...</div>;



12

return <div>{content}</div>;



13

},



14

});



15



16

return result.value;



17

}
```

Remember to update the file from `.ts` to `.tsx` because you are defining a
React component in the `streamUI` function.

[Client](#client-2)
-------------------

```
1

'use client';



2



3

import { useState } from 'react';



4

import { generateResponse } from './actions';



5

import { readStreamableValue } from '@ai-sdk/rsc';



6



7

// Force the page to be dynamic and allow streaming responses up to 30 seconds



8

export const maxDuration = 30;



9



10

export default function Home() {



11

const [input, setInput] = useState<string>('');



12

const [generation, setGeneration] = useState<React.ReactNode>();



13



14

return (



15

<div>



16

<div>{generation}</div>



17

<form



18

onSubmit={async e => {



19

e.preventDefault();



20

const result = await generateResponse(input);



21

setGeneration(result);



22

setInput('');



23

}}



24

>



25

<input



26

type="text"



27

value={input}



28

onChange={event => {



29

setInput(event.target.value);



30

}}



31

/>



32

<button>Send Message</button>



33

</form>



34

</div>



35

);



36

}
```

[Previous

Streaming Values](/docs/ai-sdk-rsc/streaming-values)[Next

Error Handling](/docs/ai-sdk-rsc/error-handling)
