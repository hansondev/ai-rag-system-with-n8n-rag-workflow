---
title: "Streaming Status Shows But No Text Appears"
source_url: https://ai-sdk.dev/docs/troubleshooting/streaming-status-delay
section: troubleshooting
crawled: 2026-09-20
---

# Streaming Status Shows But No Text Appears

> Source: https://ai-sdk.dev/docs/troubleshooting/streaming-status-delay

[Troubleshooting](/docs/troubleshooting)Streaming Status Shows But No Text Appears


[Streaming Status Shows But No Text Appears](#streaming-status-shows-but-no-text-appears)
=========================================================================================

[Issue](#issue)
---------------

When using `useChat`, the status changes to "streaming" immediately, but no text appears for several seconds.

[Background](#background)
-------------------------

The status changes to "streaming" as soon as the connection to the server is established and streaming begins - this includes metadata streaming, not just the LLM's generated tokens.

[Solution](#solution)
---------------------

Create a custom loading state that checks if the last assistant message actually contains content:

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4



5

export default function Page() {



6

const { messages, status } = useChat();



7



8

const lastMessage = messages.at(-1);



9



10

const showLoader =



11

status === 'streaming' &&



12

lastMessage?.role === 'assistant' &&



13

lastMessage?.parts?.length === 0;



14



15

return (



16

<>



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



26

{showLoader && <div>Loading...</div>}



27

</>



28

);



29

}
```

You can also check for specific part types if you're waiting for something specific:

```
1

const showLoader =



2

status === 'streaming' &&



3

lastMessage?.role === 'assistant' &&



4

!lastMessage?.parts?.some(part => part.type === 'text');
```

[Related Issues](#related-issues)
---------------------------------

* [GitHub Issue #7586](https://github.com/vercel/ai/issues/7586)

[Previous

streamText fails silently](/docs/troubleshooting/stream-text-not-working)[Next

Stale body values with useChat](/docs/troubleshooting/use-chat-stale-body-data)
