---
title: "Message Metadata"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/message-metadata
section: ai-sdk-ui
crawled: 2026-09-20
---

# Message Metadata

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/message-metadata

[AI SDK UI](/docs/ai-sdk-ui)Message Metadata


[Message Metadata](#message-metadata)
=====================================

Message metadata allows you to attach custom information to messages at the message level. This is useful for tracking timestamps, model information, token usage, user context, and other message-level data.

[Overview](#overview)
---------------------

Message metadata differs from [data parts](/docs/ai-sdk-ui/streaming-data) in that it's attached at the message level rather than being part of the message content. While data parts are ideal for dynamic content that forms part of the message, metadata is perfect for information about the message itself.

[Getting Started](#getting-started)
-----------------------------------

Here's a simple example of using message metadata to track timestamps and model information:

### [Defining Metadata Types](#defining-metadata-types)

First, define your metadata type for type safety:

app/types.ts

```
1

import { UIMessage } from 'ai';



2

import { z } from 'zod';



3



4

// Define your metadata schema



5

export const messageMetadataSchema = z.object({



6

createdAt: z.number().optional(),



7

model: z.string().optional(),



8

totalTokens: z.number().optional(),



9

});



10



11

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;



12



13

// Create a typed UIMessage



14

export type MyUIMessage = UIMessage<MessageMetadata>;
```

### [Sending Metadata from the Server](#sending-metadata-from-the-server)

Use the `messageMetadata` callback in `toUIMessageStream` to send metadata at different streaming stages:

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

import type { MyUIMessage } from '@/types';



8



9

export async function POST(req: Request) {



10

const { messages }: { messages: MyUIMessage[] } = await req.json();



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

stream: toUIMessageStream({



19

stream: result.stream,



20

originalMessages: messages, // pass this in for type-safe return objects



21

messageMetadata: ({ part }) => {



22

// Send metadata when streaming starts



23

if (part.type === 'start') {



24

return {



25

createdAt: Date.now(),



26

model: 'your-model-id',



27

};



28

}



29



30

// Send additional metadata when streaming completes



31

if (part.type === 'finish') {



32

return {



33

totalTokens: part.totalUsage.totalTokens,



34

};



35

}



36

},



37

}),



38

});



39

}
```

To enable type-safe metadata return object in `messageMetadata`, pass in the
`originalMessages` parameter typed to your UIMessage type.

### [Accessing Metadata on the Client](#accessing-metadata-on-the-client)

Access metadata through the `message.metadata` property:

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { DefaultChatTransport } from 'ai';



5

import type { MyUIMessage } from '@/types';



6



7

export default function Chat() {



8

const { messages } = useChat<MyUIMessage>({



9

transport: new DefaultChatTransport({



10

api: '/api/chat',



11

}),



12

});



13



14

return (



15

<div>



16

{messages.map(message => (



17

<div key={message.id}>



18

<div>



19

{message.role === 'user' ? 'User: ' : 'AI: '}



20

{message.metadata?.createdAt && (



21

<span className="text-sm text-gray-500">



22

{new Date(message.metadata.createdAt).toLocaleTimeString()}



23

</span>



24

)}



25

</div>



26



27

{/* Render message content */}



28

{message.parts.map((part, index) =>



29

part.type === 'text' ? <div key={index}>{part.text}</div> : null,



30

)}



31



32

{/* Display additional metadata */}



33

{message.metadata?.totalTokens && (



34

<div className="text-xs text-gray-400">



35

{message.metadata.totalTokens} tokens



36

</div>



37

)}



38

</div>



39

))}



40

</div>



41

);



42

}
```

For streaming arbitrary data that changes during generation, consider using
[data parts](/docs/ai-sdk-ui/streaming-data) instead.

[Common Use Cases](#common-use-cases)
-------------------------------------

Message metadata is ideal for:

* **Timestamps**: When messages were created or completed
* **Model Information**: Which AI model was used
* **Token Usage**: Track costs and usage limits
* **User Context**: User IDs, session information
* **Performance Metrics**: Generation time, time to first token
* **Quality Indicators**: Finish reason, confidence scores

[See Also](#see-also)
---------------------

* [Chatbot Guide](/docs/ai-sdk-ui/chatbot#message-metadata) - Message metadata in the context of building chatbots
* [Streaming Data](/docs/ai-sdk-ui/streaming-data#message-metadata-vs-data-parts) - Comparison with data parts
* [UIMessage Reference](/docs/reference/ai-sdk-core/ui-message) - Complete UIMessage type reference

[Previous

Reading UIMessage Streams](/docs/ai-sdk-ui/reading-ui-message-streams)[Next

Stream Protocols](/docs/ai-sdk-ui/stream-protocol)
