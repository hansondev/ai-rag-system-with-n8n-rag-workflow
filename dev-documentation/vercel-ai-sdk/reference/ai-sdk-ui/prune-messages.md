---
title: "pruneMessages()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/prune-messages
section: reference
crawled: 2026-09-20
---

# pruneMessages()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/prune-messages

[AI SDK UI](/docs/ai-sdk-ui)pruneMessages


[`pruneMessages()`](#prunemessages)
===================================

The `pruneMessages` function is used to prune or filter an array of `ModelMessage` objects. This is useful for reducing message context (to save tokens), removing intermediate reasoning, or trimming tool calls and empty messages before sending to an LLM.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

createUIMessageStreamResponse,



3

pruneMessages,



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

const prunedMessages = pruneMessages({



12

messages,



13

reasoning: 'before-last-message',



14

toolCalls: 'before-last-2-messages',



15

emptyMessages: 'remove',



16

});



17



18

const result = streamText({



19

model: "xai/grok-4.6",



20

messages: prunedMessages,



21

});



22



23

return createUIMessageStreamResponse({



24

stream: toUIMessageStream({ stream: result.stream }),



25

});



26

}
```

[Import](#import)
-----------------

```
import { pruneMessages } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### messages:

ModelMessage[]

### reasoning:

'all' | 'before-last-message' | 'none'

### toolCalls:

'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | Array<{ type: 'all' | 'before-last-message' | 'before-last-${number}-messages'; tools?: string[] }>

### emptyMessages:

'keep' | 'remove'

### [Returns](#returns)

An array of [`ModelMessage`](/docs/reference/ai-sdk-core/model-message) objects, pruned according to the provided options.

### ModelMessage[]:

Array

[Example Usage](#example-usage)
-------------------------------

```
1

import { pruneMessages } from 'ai';



2



3

const pruned = pruneMessages({



4

messages,



5

reasoning: 'all', // Remove all reasoning parts



6

toolCalls: 'before-last-message', // Remove tool calls except those in the last message



7

});
```

[Pruning Options](#pruning-options)
-----------------------------------

* **reasoning:** Removes reasoning parts from assistant messages. Use `'all'` to remove all, `'before-last-message'` to keep reasoning in the last message, or `'none'` to retain all reasoning.
* **toolCalls:** Prune tool-call, tool-result, and tool-approval chunks from assistant/tool messages. Default is an empty array (no pruning). Options include:
  + `'all'`: Prune all such content.
  + `'before-last-message'`: Prune except in the last message.
  + `'before-last-N-messages'`: Prune except in the last N messages.
  + `'none'`: Do not prune.
  + Or provide an array for per-tool fine control, e.g., `[{ type: 'before-last-message', tools: ['search', 'calculator'] }]` to prune only specific tools.
* **emptyMessages:** Set to `'remove'` (default) to exclude messages that have no content after pruning.

> **Tip**: `pruneMessages` is typically used prior to sending a context window to an LLM to reduce message/token count, especially after a series of tool-calls and approvals.

For advanced usage and the full list of possible message parts, see [`ModelMessage`](/docs/reference/ai-sdk-core/model-message) and [`pruneMessages` implementation](https://github.com/vercel/ai/blob/main/packages/ai/src/generate-text/prune-messages.ts).

[Previous

convertToModelMessages](/docs/reference/ai-sdk-ui/convert-to-model-messages)[Next

createUIMessageStream](/docs/reference/ai-sdk-ui/create-ui-message-stream)
