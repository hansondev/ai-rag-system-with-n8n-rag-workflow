---
title: "useObject()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-object
section: reference
crawled: 2026-09-20
---

# useObject()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-object

[AI SDK UI](/docs/ai-sdk-ui)useObject


[`useObject()`](#useobject)
===========================

`useObject` is only available in React, Svelte, and Vue.

Allows you to consume text streams that represent a JSON object and parse them into a complete object based on a schema.
You can use it together with [`streamText`](/docs/reference/ai-sdk-core/stream-text) and [`Output.object()`](/docs/reference/ai-sdk-core/output#output-object) in the backend.

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

const { object, submit } = useObject({



7

api: '/api/use-object',



8

schema: z.object({ content: z.string() }),



9

});



10



11

return (



12

<div>



13

<button onClick={() => submit('example input')}>Generate</button>



14

{object?.content && <p>{object.content}</p>}



15

</div>



16

);



17

}
```

[Import](#import)
-----------------

ReactSvelteVue

```
import { useObject } from '@ai-sdk/react'
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### api:

string

### schema:

Zod Schema | JSON Schema

### id?:

string

### initialValue?:

DeepPartial<RESULT> | undefined

### fetch?:

FetchFunction

### headers?:

Record<string, string> | Headers

### credentials?:

RequestCredentials

### onError?:

(error: Error) => void

### onFinish?:

(result: OnFinishResult) => void

OnFinishResult

### object:

T | undefined

### error:

Error | undefined

### [Returns](#returns)

### submit:

(input: INPUT) => void

### object:

DeepPartial<RESULT> | undefined

### error:

Error | undefined

### isLoading:

boolean

### stop:

() => void

### clear:

() => void

[Examples](#examples)
---------------------

[Streaming Object Generation with useObject](/examples/next-pages/basics/streaming-object-generation)

[Previous

useCompletion](/docs/reference/ai-sdk-ui/use-completion)[Next

experimental\_useRealtime](/docs/reference/ai-sdk-ui/use-realtime)
