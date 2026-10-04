---
title: "Object Generation"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/object-generation
section: ai-sdk-ui
crawled: 2026-09-20
---

# Object Generation

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/object-generation

[AI SDK UI](/docs/ai-sdk-ui)Object Generation


[Object Generation](#object-generation)
=======================================

`useObject` is only available in React, Svelte, and Vue.

The [`useObject`](/docs/reference/ai-sdk-ui/use-object) hook allows you to create interfaces that represent a structured JSON object that is being streamed.

In this guide, you will learn how to use the `useObject` hook in your application to generate UIs for structured data on the fly.

[Example](#example)
-------------------

The example shows a small notifications demo app that generates fake notifications in real-time.

### [Schema](#schema)

It is helpful to set up the schema in a separate file that is imported on both the client and server.

app/api/notifications/schema.ts

```
1

import { z } from 'zod';



2



3

// define a schema for the notifications



4

export const notificationSchema = z.object({



5

notifications: z.array(



6

z.object({



7

name: z.string().describe('Name of a fictional person.'),



8

message: z.string().describe('Message. Do not use emojis or links.'),



9

}),



10

),



11

});
```

### [Client](#client)

The client uses [`useObject`](/docs/reference/ai-sdk-ui/use-object) to stream the object generation process.

The results are partial and are displayed as they are received.
Please note the code for handling `undefined` values in the JSX.

app/page.tsx

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4

import { notificationSchema } from './api/notifications/schema';



5



6

export default function Page() {



7

const { object, submit } = useObject({



8

api: '/api/notifications',



9

schema: notificationSchema,



10

});



11



12

return (



13

<>



14

<button onClick={() => submit('Messages during finals week.')}>



15

Generate notifications



16

</button>



17



18

{object?.notifications?.map((notification, index) => (



19

<div key={index}>



20

<p>{notification?.name}</p>



21

<p>{notification?.message}</p>



22

</div>



23

))}



24

</>



25

);



26

}
```

### [Server](#server)

On the server, we use [`streamText`](/docs/reference/ai-sdk-core/stream-text) with [`Output.object()`](/docs/reference/ai-sdk-core/output#output-object) to stream the object generation process.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/notifications/route.ts

```
1

import { createTextStreamResponse, Output, streamText, toTextStream } from 'ai';



2

import { notificationSchema } from './schema';



3



4

// Allow streaming responses up to 30 seconds



5

export const maxDuration = 30;



6



7

export async function POST(req: Request) {



8

const context = await req.json();



9



10

const result = streamText({



11

model: "xai/grok-4.6",



12

output: Output.object({ schema: notificationSchema }),



13

prompt:



14

`Generate 3 notifications for a messages app in this context:` + context,



15

});



16



17

return createTextStreamResponse({



18

stream: toTextStream({ stream: result.stream }),



19

});



20

}
```

[Enum Output Mode](#enum-output-mode)
-------------------------------------

When you need to classify or categorize input into predefined options, you can use the `enum` output mode with `useObject`. This requires a specific schema structure where the object has `enum` as a key with `z.enum` containing your possible values.

### [Example: Text Classification](#example-text-classification)

This example shows how to build a simple text classifier that categorizes statements as true or false.

#### [Client](#client-1)

When using `useObject` with enum output mode, your schema must be an object with `enum` as the key:

app/classify/page.tsx

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4

import { z } from 'zod';



5



6

export default function ClassifyPage() {



7

const { object, submit, isLoading } = useObject({



8

api: '/api/classify',



9

schema: z.object({ enum: z.enum(['true', 'false']) }),



10

});



11



12

return (



13

<>



14

<button onClick={() => submit('The earth is flat')} disabled={isLoading}>



15

Classify statement



16

</button>



17



18

{object && <div>Classification: {object.enum}</div>}



19

</>



20

);



21

}
```

#### [Server](#server-1)

On the server, use `streamText` with `Output.choice()` to stream the classification result:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/classify/route.ts

```
1

import { createTextStreamResponse, Output, streamText, toTextStream } from 'ai';



2



3

export async function POST(req: Request) {



4

const context = await req.json();



5



6

const result = streamText({



7

model: "xai/grok-4.6",



8

output: Output.choice({ options: ['true', 'false'] }),



9

prompt: `Classify this statement as true or false: ${context}`,



10

});



11



12

return createTextStreamResponse({



13

stream: toTextStream({ stream: result.stream }),



14

});



15

}
```

[Customized UI](#customized-ui)
-------------------------------

`useObject` also provides ways to show loading and error states:

### [Loading State](#loading-state)

The `isLoading` state returned by the `useObject` hook can be used for several
purposes:

* To show a loading spinner while the object is generated.
* To disable the submit button.

app/page.tsx

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4



5

export default function Page() {



6

const { isLoading, object, submit } = useObject({



7

api: '/api/notifications',



8

schema: notificationSchema,



9

});



10



11

return (



12

<>



13

{isLoading && <Spinner />}



14



15

<button



16

onClick={() => submit('Messages during finals week.')}



17

disabled={isLoading}



18

>



19

Generate notifications



20

</button>



21



22

{object?.notifications?.map((notification, index) => (



23

<div key={index}>



24

<p>{notification?.name}</p>



25

<p>{notification?.message}</p>



26

</div>



27

))}



28

</>



29

);



30

}
```

### [Stop Handler](#stop-handler)

The `stop` function can be used to stop the object generation process. This can be useful if the user wants to cancel the request or if the server is taking too long to respond.

app/page.tsx

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4



5

export default function Page() {



6

const { isLoading, stop, object, submit } = useObject({



7

api: '/api/notifications',



8

schema: notificationSchema,



9

});



10



11

return (



12

<>



13

{isLoading && (



14

<button type="button" onClick={() => stop()}>



15

Stop



16

</button>



17

)}



18



19

<button onClick={() => submit('Messages during finals week.')}>



20

Generate notifications



21

</button>



22



23

{object?.notifications?.map((notification, index) => (



24

<div key={index}>



25

<p>{notification?.name}</p>



26

<p>{notification?.message}</p>



27

</div>



28

))}



29

</>



30

);



31

}
```

### [Error State](#error-state)

Similarly, the `error` state reflects the error object thrown during the fetch request.
It can be used to display an error message, or to disable the submit button:

We recommend showing a generic error message to the user, such as "Something
went wrong." This is a good practice to avoid leaking information from the
server.

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4



5

export default function Page() {



6

const { error, object, submit } = useObject({



7

api: '/api/notifications',



8

schema: notificationSchema,



9

});



10



11

return (



12

<>



13

{error && <div>An error occurred.</div>}



14



15

<button onClick={() => submit('Messages during finals week.')}>



16

Generate notifications



17

</button>



18



19

{object?.notifications?.map((notification, index) => (



20

<div key={index}>



21

<p>{notification?.name}</p>



22

<p>{notification?.message}</p>



23

</div>



24

))}



25

</>



26

);



27

}
```

[Event Callbacks](#event-callbacks)
-----------------------------------

`useObject` provides optional event callbacks that you can use to handle life-cycle events.

* `onFinish`: Called when the object generation is completed.
* `onError`: Called when an error occurs during the fetch request.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

app/page.tsx

```
1

'use client';



2



3

import { useObject } from '@ai-sdk/react';



4

import { notificationSchema } from './api/notifications/schema';



5



6

export default function Page() {



7

const { object, submit } = useObject({



8

api: '/api/notifications',



9

schema: notificationSchema,



10

onFinish({ object, error }) {



11

// typed object, undefined if schema validation fails:



12

console.log('Object generation completed:', object);



13



14

// error, undefined if schema validation succeeds:



15

console.log('Schema validation error:', error);



16

},



17

onError(error) {



18

// error during fetch request:



19

console.error('An error occurred:', error);



20

},



21

});



22



23

return (



24

<div>



25

<button onClick={() => submit('Messages during finals week.')}>



26

Generate notifications



27

</button>



28



29

{object?.notifications?.map((notification, index) => (



30

<div key={index}>



31

<p>{notification?.name}</p>



32

<p>{notification?.message}</p>



33

</div>



34

))}



35

</div>



36

);



37

}
```

[Configure Request Options](#configure-request-options)
-------------------------------------------------------

You can configure the API endpoint, optional headers and credentials using the `api`, `headers` and `credentials` settings.

```
1

const { submit, object } = useObject({



2

api: '/api/use-object',



3

headers: {



4

'X-Custom-Header': 'CustomValue',



5

},



6

credentials: 'include',



7

schema: yourSchema,



8

});
```

[Previous

Completion](/docs/ai-sdk-ui/completion)[Next

Streaming Custom Data](/docs/ai-sdk-ui/streaming-data)
