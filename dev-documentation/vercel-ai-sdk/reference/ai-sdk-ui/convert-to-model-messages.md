---
title: "convertToModelMessages()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-model-messages
section: reference
crawled: 2026-09-20
---

# convertToModelMessages()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-model-messages

[AI SDK UI](/docs/ai-sdk-ui)convertToModelMessages


[`convertToModelMessages()`](#converttomodelmessages)
=====================================================

The `convertToModelMessages` function is used to transform an array of UI messages from the `useChat` hook into an array of `ModelMessage` objects. These `ModelMessage` objects are compatible with AI core functions like `streamText`.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

streamText,



5

toUIMessageStream,



6

} from 'ai';



7



8

export async function POST(req: Request) {



9

const { messages } = await req.json();



10



11

const result = streamText({



12

model: "xai/grok-4.6",



13

messages: await convertToModelMessages(messages),



14

});



15



16

return createUIMessageStreamResponse({



17

stream: toUIMessageStream({ stream: result.stream }),



18

});



19

}
```

[Import](#import)
-----------------

```
import { convertToModelMessages } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### messages:

Message[]

### options:

{ tools?: ToolSet, ignoreIncompleteToolCalls?: boolean, convertDataPart?: (part: DataUIPart) => TextPart | FilePart | undefined }

### [Returns](#returns)

A Promise that resolves to an array of [`ModelMessage`](/docs/reference/ai-sdk-core/model-message) objects.

### Promise<ModelMessage[]>:

Promise

[Deprecated `rawInput` field](#deprecated-rawinput-field)
---------------------------------------------------------

Tool parts in the `output-error` state should store their tool arguments in
`input`. The legacy `rawInput` field remains supported for persisted messages,
but `convertToModelMessages` emits an AI SDK deprecation warning when it
encounters a defined value.

When both fields are present, `input` takes precedence when it is non-nullish.
For backward compatibility, `rawInput` remains the fallback when `input` is
`null` or `undefined`. Migrate stored messages to `input` before the next major
version, when `rawInput` will be removed.

[Tool Approval States](#tool-approval-states)
---------------------------------------------

`convertToModelMessages` preserves tool approval state from UI messages when converting them back into `ModelMessage`s for a follow-up `generateText` or `streamText` call.

* Tool parts with approval metadata produce `tool-approval-request` content parts. `approval.requestReason` is forwarded as the request `reason` when present.
* Tool parts in `approval-responded` state also become `tool-approval-response` content parts. The separate response `reason` is forwarded when present.
* Automatic approval metadata is preserved by forwarding `approval.isAutomatic` to the `tool-approval-request` part.
* Denied tool approvals also produce a synthetic `tool-result` with `output: { type: 'execution-denied', reason?: string }`, so the model receives a complete tool lifecycle and can respond to the denial in the next step.

[Multi-modal Tool Responses](#multi-modal-tool-responses)
---------------------------------------------------------

The `convertToModelMessages` function supports tools that can return multi-modal content. This is useful when tools need to return non-text content like images.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { tool } from 'ai';



2

import { z } from 'zod';



3



4

const screenshotTool = tool({



5

inputSchema: z.object({}),



6

execute: async () => 'imgbase64',



7

toModelOutput: ({ output }) => [



8

{ type: 'file-data', data: output, mediaType: 'image/png' },



9

],



10

});



11



12

const result = streamText({



13

model: "xai/grok-4.6",



14

messages: convertToModelMessages(messages, {



15

tools: {



16

screenshot: screenshotTool,



17

},



18

}),



19

});
```

Tools can implement the optional `toModelOutput` method to transform their results into multi-modal content. The content is an array of content parts, where each part has a `type` (e.g., 'text', 'image') and corresponding data.

[Custom Data Part Conversion](#custom-data-part-conversion)
-----------------------------------------------------------

The `convertToModelMessages` function supports converting custom data parts attached to user messages. This is useful when users need to include additional context (URLs, code files, JSON configs) with their messages.

### [Basic Usage](#basic-usage)

By default, data parts in user messages are filtered out during conversion. To include them, provide a `convertDataPart` callback that transforms data parts into text or file parts that the model can understand:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

streamText,



5

toUIMessageStream,



6

} from 'ai';



7



8

type CustomUIMessage = UIMessage<



9

never,



10

{



11

url: { url: string; title: string; content: string };



12

'code-file': { filename: string; code: string; language: string };



13

}



14

>;



15



16

export async function POST(req: Request) {



17

const { messages } = await req.json();



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages: convertToModelMessages<CustomUIMessage>(messages, {



22

convertDataPart: part => {



23

// Convert URL attachments to text



24

if (part.type === 'data-url') {



25

return {



26

type: 'text',



27

text: `[Reference: ${part.data.title}](${part.data.url})\n\n${part.data.content}`,



28

};



29

}



30



31

// Convert code file attachments



32

if (part.type === 'data-code-file') {



33

return {



34

type: 'text',



35

text: `\`\`\`${part.data.language}\n// ${part.data.filename}\n${part.data.code}\n\`\`\``,



36

};



37

}



38



39

// Other data parts are ignored



40

},



41

}),



42

});



43



44

return createUIMessageStreamResponse({



45

stream: toUIMessageStream({ stream: result.stream }),



46

});



47

}
```

### [Use Cases](#use-cases)

**Attaching URL Content**
Allow users to attach URLs to their messages, with the content fetched and formatted for the model:

```
1

// Client side



2

sendMessage({



3

parts: [



4

{ type: 'text', text: 'Analyze this article' },



5

{



6

type: 'data-url',



7

data: {



8

url: 'https://example.com/article',



9

title: 'Important Article',



10

content: '...',



11

},



12

},



13

],



14

});
```

**Including Code Files as Context**
Let users reference code files in their conversations:

```
1

convertDataPart: part => {



2

if (part.type === 'data-code-file') {



3

return {



4

type: 'text',



5

text: `\`\`\`${part.data.language}\n${part.data.code}\n\`\`\``,



6

};



7

}



8

};
```

**Selective Inclusion**
Only data parts for which you return a text or file model message part are included,
all other data parts are ignored.

```
1

const result = convertToModelMessages<



2

UIMessage<



3

unknown,



4

{



5

url: { url: string; title: string };



6

code: { code: string; language: string };



7

note: { text: string };



8

}



9

>



10

>(messages, {



11

convertDataPart: part => {



12

if (part.type === 'data-url') {



13

return {



14

type: 'text',



15

text: `[${part.data.title}](${part.data.url})`,



16

};



17

}



18



19

// data-code and data-node are ignored



20

},



21

});
```

### [Type Safety](#type-safety)

The generic parameter ensures full type safety for your custom data parts:

```
1

type MyUIMessage = UIMessage<



2

unknown,



3

{



4

url: { url: string; content: string };



5

config: { key: string; value: string };



6

}



7

>;



8



9

// TypeScript knows the exact shape of part.data



10

convertToModelMessages<MyUIMessage>(messages, {



11

convertDataPart: part => {



12

if (part.type === 'data-url') {



13

// part.data is typed as { url: string; content: string }



14

return { type: 'text', text: part.data.url };



15

}



16

// Return undefined to skip this part



17

},



18

});
```

[Previous

experimental\_useRealtime](/docs/reference/ai-sdk-ui/use-realtime)[Next

pruneMessages](/docs/reference/ai-sdk-ui/prune-messages)
