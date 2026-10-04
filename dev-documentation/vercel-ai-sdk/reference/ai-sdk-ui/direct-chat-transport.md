---
title: "DirectChatTransport"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/direct-chat-transport
section: reference
crawled: 2026-09-20
---

# DirectChatTransport

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/direct-chat-transport

[AI SDK UI](/docs/ai-sdk-ui)DirectChatTransport


[`DirectChatTransport`](#directchattransport)
=============================================

A transport that directly communicates with an [Agent](/docs/reference/ai-sdk-core/agent) in-process, without going through HTTP. This is useful for:

* Server-side rendering scenarios
* Testing without network
* Single-process applications

Unlike `DefaultChatTransport` which sends HTTP requests to an API endpoint, `DirectChatTransport` invokes the agent's `stream()` method directly and converts the result to a UI message stream.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { useChat } from '@ai-sdk/react';



2

import { DirectChatTransport, ToolLoopAgent } from 'ai';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

instructions: 'You are a helpful assistant.',



7

});



8



9

export default function Chat() {



10

const { messages, sendMessage, status } = useChat({



11

transport: new DirectChatTransport({ agent }),



12

});



13



14

// ... render chat UI



15

}
```

[Import](#import)
-----------------

```
import { DirectChatTransport } from "ai"
```

[Constructor](#constructor)
---------------------------

### [Parameters](#parameters)

### agent:

Agent

### options?:

CALL\_OPTIONS

### originalMessages?:

UIMessage[]

### generateMessageId?:

IdGenerator

### messageMetadata?:

(options: { part: TextStreamPart }) => METADATA | undefined

### sendReasoning?:

boolean

### sendSources?:

boolean

### sendFinish?:

boolean

### sendStart?:

boolean

### onError?:

(error: unknown) => string

[Methods](#methods)
-------------------

### [`sendMessages()`](#sendmessages)

Sends messages to the agent and returns a streaming response. This method validates and converts UI messages to model messages, calls the agent's `stream()` method, and returns the result as a UI message stream.

```
1

const stream = await transport.sendMessages({



2

chatId: 'chat-123',



3

trigger: 'submit-message',



4

messages: [...],



5

abortSignal: controller.signal,



6

});
```

### chatId:

string

### trigger:

'submit-message' | 'regenerate-message'

### messageId:

string | undefined

### messages:

UIMessage[]

### abortSignal:

AbortSignal | undefined

### headers?:

Record<string, string> | Headers

### body?:

object

### metadata?:

unknown

#### [Returns](#returns)

Returns a `Promise<ReadableStream<UIMessageChunk>>` - a stream of UI message chunks that can be processed by the chat UI.

### [`reconnectToStream()`](#reconnecttostream)

Direct transport does not support reconnection since there is no persistent server-side stream to reconnect to.

#### [Returns](#returns-1)

Always returns `Promise<null>`.

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

```
1

import { useChat } from '@ai-sdk/react';



2

import { DirectChatTransport, ToolLoopAgent } from 'ai';



3

import { openai } from '@ai-sdk/openai';



4



5

const agent = new ToolLoopAgent({



6

model: openai('gpt-4o'),



7

instructions: 'You are a helpful assistant.',



8

});



9



10

export default function Chat() {



11

const { messages, sendMessage, status } = useChat({



12

transport: new DirectChatTransport({ agent }),



13

});



14



15

return (



16

<div>



17

{messages.map(message => (



18

<div key={message.id}>



19

{message.role === 'user' ? 'User: ' : 'AI: '}



20

{message.parts.map((part, index) =>



21

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



22

)}



23

</div>



24

))}



25

<button onClick={() => sendMessage({ text: 'Hello!' })}>Send</button>



26

</div>



27

);



28

}
```

### [With Agent Tools](#with-agent-tools)

```
1

import { useChat } from '@ai-sdk/react';



2

import { DirectChatTransport, ToolLoopAgent, tool } from 'ai';



3

import { openai } from '@ai-sdk/openai';



4

import { z } from 'zod';



5



6

const weatherTool = tool({



7

description: 'Get the current weather',



8

inputSchema: z.object({



9

location: z.string().describe('The city and state'),



10

}),



11

execute: async ({ location }) => {



12

return `The weather in ${location} is sunny and 72°F.`;



13

},



14

});



15



16

const agent = new ToolLoopAgent({



17

model: openai('gpt-4o'),



18

instructions: 'You are a helpful assistant with access to weather data.',



19

tools: { weather: weatherTool },



20

});



21



22

export default function Chat() {



23

const { messages, sendMessage } = useChat({



24

transport: new DirectChatTransport({ agent }),



25

});



26



27

// ... render chat UI with tool results



28

}
```

### [With Custom Agent Options](#with-custom-agent-options)

```
1

import { useChat } from '@ai-sdk/react';



2

import { DirectChatTransport, ToolLoopAgent } from 'ai';



3

import { openai } from '@ai-sdk/openai';



4



5

const agent = new ToolLoopAgent<{ userId: string }>({



6

model: openai('gpt-4o'),



7

prepareCall: ({ options, ...rest }) => ({



8

...rest,



9

providerOptions: {



10

openai: { user: options.userId },



11

},



12

}),



13

});



14



15

export default function Chat({ userId }: { userId: string }) {



16

const { messages, sendMessage } = useChat({



17

transport: new DirectChatTransport({



18

agent,



19

options: { userId },



20

}),



21

});



22



23

// ... render chat UI



24

}
```

### [With Reasoning](#with-reasoning)

```
1

import { useChat } from '@ai-sdk/react';



2

import { DirectChatTransport, ToolLoopAgent } from 'ai';



3

import { openai } from '@ai-sdk/openai';



4



5

const agent = new ToolLoopAgent({



6

model: openai('o1-preview'),



7

});



8



9

export default function Chat() {



10

const { messages, sendMessage } = useChat({



11

transport: new DirectChatTransport({



12

agent,



13

sendReasoning: true,



14

}),



15

});



16



17

return (



18

<div>



19

{messages.map(message => (



20

<div key={message.id}>



21

{message.parts.map((part, index) => {



22

if (part.type === 'text') {



23

return <p key={index}>{part.text}</p>;



24

}



25

if (part.type === 'reasoning') {



26

return (



27

<pre key={index} style={{ opacity: 0.6 }}>



28

{part.text}



29

</pre>



30

);



31

}



32

return null;



33

})}



34

</div>



35

))}



36

</div>



37

);



38

}
```

[Previous

experimental\_MCPAppRenderer](/docs/reference/ai-sdk-ui/mcp-app-renderer)[Next

AI SDK RSC](/docs/reference/ai-sdk-rsc)
