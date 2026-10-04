---
title: "useChat No Response"
source_url: https://ai-sdk.dev/docs/troubleshooting/use-chat-tools-no-response
section: troubleshooting
crawled: 2026-09-20
---

# useChat No Response

> Source: https://ai-sdk.dev/docs/troubleshooting/use-chat-tools-no-response

[Troubleshooting](/docs/troubleshooting)useChat No Response


[`useChat` No Response](#usechat-no-response)
=============================================

[Issue](#issue)
---------------

I am using [`useChat`](/docs/reference/ai-sdk-ui/use-chat).
When I log the incoming messages on the server, I can see the tool call and the tool result, but the model does not respond with anything.

[Solution](#solution)
---------------------

To resolve this issue, convert the incoming messages to the `ModelMessage` format using the [`convertToModelMessages`](/docs/reference/ai-sdk-ui/convert-to-model-messages) function.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { openai } from '@ai-sdk/openai';



2

import {



3

convertToModelMessages,



4

createUIMessageStreamResponse,



5

streamText,



6

toUIMessageStream,



7

} from 'ai';



8



9

export async function POST(req: Request) {



10

const { messages } = await req.json();



11



12

const result = streamText({



13

model: "xai/grok-4.6",



14

messages: await convertToModelMessages(messages),



15

});



16



17

return createUIMessageStreamResponse({



18

stream: toUIMessageStream({ stream: result.stream }),



19

});



20

}
```

[Previous

Server Action Plain Objects Error](/docs/troubleshooting/client-stream-error)[Next

Custom headers, body, and credentials not working with useChat](/docs/troubleshooting/use-chat-custom-request-options)
