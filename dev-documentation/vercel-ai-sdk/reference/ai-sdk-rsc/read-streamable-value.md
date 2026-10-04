---
title: "readStreamableValue"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/read-streamable-value
section: reference
crawled: 2026-09-20
---

# readStreamableValue

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/read-streamable-value

[AI SDK RSC](/docs/ai-sdk-rsc)readStreamableValue


[`readStreamableValue`](#readstreamablevalue)
=============================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

It is a function that helps you read the streamable value from the client that was originally created using [`createStreamableValue`](/docs/reference/ai-sdk-rsc/create-streamable-value) on the server.

[Import](#import)
-----------------

```
import { readStreamableValue } from "@ai-sdk/rsc"
```

[Example](#example)
-------------------

app/actions.ts

```
1

async function generate() {



2

'use server';



3

const streamable = createStreamableValue('');



4



5

streamable.append('Hello');



6

streamable.append(' ');



7

streamable.append('World');



8

streamable.done();



9



10

return streamable.value;



11

}
```

app/page.tsx

```
1

import { readStreamableValue } from '@ai-sdk/rsc';



2



3

export default function Page() {



4

const [generation, setGeneration] = useState('');



5



6

return (



7

<div>



8

<button



9

onClick={async () => {



10

const stream = await generate();



11



12

for await (const value of readStreamableValue(stream)) {



13

setGeneration(value);



14

}



15

}}



16

>



17

Generate



18

</button>



19

</div>



20

);



21

}
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### stream:

StreamableValue

### [Returns](#returns)

It returns an async iterator that contains the values emitted by the streamable value.

[Previous

createStreamableValue](/docs/reference/ai-sdk-rsc/create-streamable-value)[Next

getAIState](/docs/reference/ai-sdk-rsc/get-ai-state)
