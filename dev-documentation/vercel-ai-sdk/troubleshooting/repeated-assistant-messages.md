---
title: "Repeated assistant messages in useChat"
source_url: https://ai-sdk.dev/docs/troubleshooting/repeated-assistant-messages
section: troubleshooting
crawled: 2026-09-20
---

# Repeated assistant messages in useChat

> Source: https://ai-sdk.dev/docs/troubleshooting/repeated-assistant-messages

[Troubleshooting](/docs/troubleshooting)Repeated assistant messages in useChat


[Repeated assistant messages in useChat](#repeated-assistant-messages-in-usechat)
=================================================================================

[Issue](#issue)
---------------

When using `useChat` with `streamText` on the server, the assistant's messages appear duplicated in the UI - showing both the previous message and the new message, or showing the same message multiple times. This can occur when using tool calls or complex message flows.

```
1

// Server-side code that may experience assistant message duplication on the client



2

export async function POST(req: Request) {



3

const { messages } = await req.json();



4



5

const result = streamText({



6

model: 'openai/gpt-5-mini',



7

messages: await convertToModelMessages(messages),



8

tools: {



9

weather: {



10

description: 'Get the weather for a location',



11

inputSchema: z.object({



12

location: z.string(),



13

}),



14

execute: async ({ location }) => {



15

return { temperature: 72, condition: 'sunny' };



16

},



17

},



18

},



19

});



20



21

return createUIMessageStreamResponse({



22

stream: toUIMessageStream({ stream: result.stream }),



23

});



24

}
```

[Background](#background)
-------------------------

The duplication occurs because UI message streams generate new message IDs for each new message.

[Solution](#solution)
---------------------

Pass the original messages array to `toUIMessageStream` using the `originalMessages` option. By passing `originalMessages`, the helper can reuse existing message IDs instead of generating new ones, ensuring the client properly updates existing messages rather than creating duplicates.

```
1

export async function POST(req: Request) {



2

const { messages } = await req.json();



3



4

const result = streamText({



5

model: 'openai/gpt-5-mini',



6

messages: await convertToModelMessages(messages),



7

tools: {



8

weather: {



9

description: 'Get the weather for a location',



10

inputSchema: z.object({



11

location: z.string(),



12

}),



13

execute: async ({ location }) => {



14

return { temperature: 72, condition: 'sunny' };



15

},



16

},



17

},



18

});



19



20

return createUIMessageStreamResponse({



21

stream: toUIMessageStream({



22

stream: result.stream,



23

originalMessages: messages, // Pass the original messages here



24

generateMessageId: generateId,



25

onEnd: ({ messages }) => {



26

saveChat({ id, messages });



27

},



28

}),



29

});



30

}
```

[Previous

useChat "An error occurred"](/docs/troubleshooting/use-chat-an-error-occurred)[Next

onEnd not called when stream is aborted](/docs/troubleshooting/stream-abort-handling)
