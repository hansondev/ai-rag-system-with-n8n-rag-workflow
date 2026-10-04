---
title: "Error Handling"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/error-handling
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Error Handling

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/error-handling

[AI SDK RSC](/docs/ai-sdk-rsc)Error Handling


[Error Handling](#error-handling)
=================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Two categories of errors can occur when working with the RSC API: errors while streaming user interfaces and errors while streaming other values.

[Handling UI Errors](#handling-ui-errors)
-----------------------------------------

To handle errors while generating UI, the [`streamableUI`](/docs/reference/ai-sdk-rsc/create-streamable-ui) object exposes an `error()` method.

app/actions.tsx

```
1

'use server';



2



3

import { createStreamableUI } from '@ai-sdk/rsc';



4



5

export async function getStreamedUI() {



6

const ui = createStreamableUI();



7



8

(async () => {



9

ui.update(<div>loading</div>);



10

const data = await fetchData();



11

ui.done(<div>{data}</div>);



12

})().catch(e => {



13

ui.error(<div>Error: {e.message}</div>);



14

});



15



16

return ui.value;



17

}
```

With this method, you can catch any error with the stream, and return relevant UI. On the client, you can also use a [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) to wrap the streamed component and catch any additional errors.

app/page.tsx

```
1

import { getStreamedUI } from '@/actions';



2

import { useState } from 'react';



3

import { ErrorBoundary } from './ErrorBoundary';



4



5

export default function Page() {



6

const [streamedUI, setStreamedUI] = useState(null);



7



8

return (



9

<div>



10

<button



11

onClick={async () => {



12

const newUI = await getStreamedUI();



13

setStreamedUI(newUI);



14

}}



15

>



16

What does the new UI look like?



17

</button>



18

<ErrorBoundary>{streamedUI}</ErrorBoundary>



19

</div>



20

);



21

}
```

[Handling Other Errors](#handling-other-errors)
-----------------------------------------------

To handle other errors while streaming, you can return an error object that the receiver can use to determine why the failure occurred.

app/actions.tsx

```
1

'use server';



2



3

import { createStreamableValue } from '@ai-sdk/rsc';



4

import { fetchData, emptyData } from '../utils/data';



5



6

export const getStreamedData = async () => {



7

const streamableData = createStreamableValue<string>(emptyData);



8



9

(async () => {



10

const data1 = await fetchData();



11

streamableData.update(data1);



12



13

const data2 = await fetchData();



14

streamableData.update(data2);



15



16

const data3 = await fetchData();



17

streamableData.done(data3);



18

})().catch(e => {



19

streamableData.error(e);



20

});



21



22

return { data: streamableData.value };



23

};
```

[Previous

Handling Loading State](/docs/ai-sdk-rsc/loading-state)[Next

Handling Authentication](/docs/ai-sdk-rsc/authentication)
