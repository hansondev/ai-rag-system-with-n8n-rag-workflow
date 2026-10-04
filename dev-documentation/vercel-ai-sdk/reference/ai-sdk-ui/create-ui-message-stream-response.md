---
title: "createUIMessageStreamResponse"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream-response
section: reference
crawled: 2026-09-20
---

# createUIMessageStreamResponse

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream-response

[AI SDK UI](/docs/ai-sdk-ui)createUIMessageStreamResponse


[`createUIMessageStreamResponse`](#createuimessagestreamresponse)
=================================================================

The `createUIMessageStreamResponse` function creates a Response object that streams UI messages to the client.

[Import](#import)
-----------------

```
import { createUIMessageStreamResponse } from "ai"
```

[Example](#example)
-------------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import {



2

createUIMessageStream,



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

const response = createUIMessageStreamResponse({



9

status: 200,



10

statusText: 'OK',



11

headers: {



12

'Custom-Header': 'value',



13

},



14

stream: createUIMessageStream({



15

execute({ writer }) {



16

// The outer stream owns the assistant message lifecycle.



17

writer.write({ type: 'start' });



18



19

// Write custom data (type must be 'data-<name>')



20

writer.write({



21

type: 'data-message',



22

data: { content: 'Hello' },



23

});



24



25

// Write text content using start/delta/end pattern



26

writer.write({



27

type: 'text-start',



28

id: 'greeting-text',



29

});



30

writer.write({



31

type: 'text-delta',



32

id: 'greeting-text',



33

delta: 'Hello, world!',



34

});



35

writer.write({



36

type: 'text-end',



37

id: 'greeting-text',



38

});



39



40

// Write source information (flat properties, not nested)



41

writer.write({



42

type: 'source-url',



43

sourceId: 'source-1',



44

url: 'https://example.com',



45

title: 'Example Source',



46

});



47



48

// Merge with LLM stream



49

const result = streamText({



50

model: "xai/grok-4.6",



51

prompt: 'Say hello',



52

});



53



54

writer.merge(



55

toUIMessageStream({ stream: result.stream, sendStart: false }),



56

);



57

},



58

}),



59

});
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### stream:

ReadableStream<UIMessageChunk>

### status?:

number

### statusText?:

string

### headers?:

Headers | Record<string, string>

### consumeSseStream?:

(options: { stream: ReadableStream<string> }) => PromiseLike<void> | void

### [Returns](#returns)

`Response`

A Response object that streams UI message chunks with the specified status, headers, and content.

[Previous

createUIMessageStream](/docs/reference/ai-sdk-ui/create-ui-message-stream)[Next

pipeUIMessageStreamToResponse](/docs/reference/ai-sdk-ui/pipe-ui-message-stream-to-response)
