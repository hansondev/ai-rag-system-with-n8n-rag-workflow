---
title: "Server Actions in Client Components"
source_url: https://ai-sdk.dev/docs/troubleshooting/server-actions-in-client-components
section: troubleshooting
crawled: 2026-09-20
---

# Server Actions in Client Components

> Source: https://ai-sdk.dev/docs/troubleshooting/server-actions-in-client-components

[Troubleshooting](/docs/troubleshooting)Server Actions in Client Components


[Server Actions in Client Components](#server-actions-in-client-components)
===========================================================================

You may use Server Actions in client components, but sometimes you may encounter the following issues.

[Issue](#issue)
---------------

It is not allowed to define inline `"use server"` annotated Server Actions in Client Components.

[Solution](#solution)
---------------------

To use Server Actions in a Client Component, you can either:

* Export them from a separate file with `"use server"` at the top.
* Pass them down through props from a Server Component.
* Implement a combination of [`createAI`](/docs/reference/ai-sdk-rsc/create-ai) and [`useActions`](/docs/reference/ai-sdk-rsc/use-actions) hooks to access them.

Learn more about [Server Actions and Mutations](https://nextjs.org/docs/app/api-reference/functions/server-actions#with-client-components).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

'use server';



2



3

import { generateText } from 'ai';



4



5

export async function getAnswer(question: string) {



6

'use server';



7



8

const { text } = await generateText({



9

model: "xai/grok-4.6",



10

prompt: question,



11

});



12



13

return { answer: text };



14

}
```

[Previous

Azure OpenAI Slow to Stream](/docs/troubleshooting/azure-stream-slow)[Next

useChat/useCompletion stream output contains 0:... instead of text](/docs/troubleshooting/strange-stream-output)
