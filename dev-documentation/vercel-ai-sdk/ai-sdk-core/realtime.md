---
title: "Realtime"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/realtime
section: ai-sdk-core
crawled: 2026-09-20
---

# Realtime

> Source: https://ai-sdk.dev/docs/ai-sdk-core/realtime

[AI SDK Core](/docs/ai-sdk-core)Realtime


[Realtime](#realtime)
=====================

Realtime is an experimental feature.

This guide covers legacy token-based, turn-based realtime conversations over
WebSockets. These sessions run in the browser and connect
directly to the provider using a short-lived token that you create on your
server. You can also route the connection through [AI Gateway](/providers/ai-sdk-providers/ai-gateway#realtime).

For OpenAI Live's continuous JSON/PCM16 WSS relay runtime and application-handled
client delegation, see
[`experimental_useRealtime`](/docs/reference/ai-sdk-ui/use-realtime#continuous-conversations).

The typical flow is:

1. The browser calls your setup endpoint.
2. Your server creates a short-lived realtime token with `experimental_realtime.getToken()`.
3. The browser opens a WebSocket connection to the provider or AI Gateway.
4. The model streams audio, text, and tool calls back to the browser.
5. Tool calls are handled by your application with `onToolCall`.

For continuous **OpenAI Live** conversations, use an application-owned WebSocket
relay or optional WebRTC via `api.session`. Live uses client delegation: your
application handles delegated work and submits context rather than using the
turn-based tool loop below. See the
[`experimental_useRealtime` reference](/docs/reference/ai-sdk-ui/use-realtime)
for SDP setup, server-owned permissions, capture ownership, and graceful close.

[Setup Endpoint](#setup-endpoint)
---------------------------------

Create a setup endpoint that returns a short-lived token for the realtime
provider. This endpoint can also attach tool definitions to the session.

app/api/realtime/setup/route.ts

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_getRealtimeToolDefinitions, tool } from 'ai';



3

import { z } from 'zod';



4



5

const tools = {



6

getWeather: tool({



7

description: 'Get the current weather for a city',



8

inputSchema: z.object({



9

city: z.string().describe('The city to get weather for'),



10

}),



11

}),



12

};



13



14

export async function POST(request: Request) {



15

const body = await request.json().catch(() => ({}));



16

const toolDefinitions = await experimental_getRealtimeToolDefinitions({



17

tools,



18

});



19



20

const token = await openai.experimental_realtime.getToken({



21

model: 'gpt-realtime',



22

sessionConfig: {



23

...body.sessionConfig,



24

tools: toolDefinitions,



25

},



26

});



27



28

return Response.json({



29

...token,



30

tools: toolDefinitions,



31

});



32

}
```

In production, authenticate and rate-limit your setup endpoint. It creates
realtime sessions using your server-side API key.

[AI Gateway](#ai-gateway)
-------------------------

Use [AI Gateway](/providers/ai-sdk-providers/ai-gateway) when you want the same
realtime client code to work across supported upstream providers. The Gateway
normalizes realtime events server-side, and the browser still receives only a
short-lived client secret.

Create the short-lived Gateway realtime token from a server-side setup endpoint:

app/api/realtime/setup/route.ts

```
1

import { gateway } from 'ai';



2



3

export async function POST() {



4

const token = await gateway.experimental_realtime.getToken({



5

model: 'openai/gpt-realtime-2',



6

});



7



8

return Response.json(token);



9

}
```

Then use the matching Gateway realtime model in the browser:

app/realtime/page.tsx

```
1

'use client';



2



3

import { experimental_useRealtime } from '@ai-sdk/react';



4

import { gateway } from 'ai';



5



6

const model = gateway.experimental_realtime('openai/gpt-realtime-2');



7

const sessionConfig = {



8

instructions: 'You are a helpful assistant. Be concise.',



9

inputAudioTranscription: {},



10

voice: 'alloy',



11

turnDetection: { type: 'server-vad' as const },



12

};



13



14

export default function RealtimePage() {



15

const realtime = experimental_useRealtime({



16

model,



17

api: {



18

token: '/api/realtime/setup',



19

},



20

sessionConfig,



21

});



22



23

// ...



24

}
```

`gateway.experimental_realtime.getToken()` must run on your server because it
uses your Gateway credential to mint a `vcst_` client secret. Creating the
realtime model with `gateway.experimental_realtime()` is safe in the browser.

Tool definitions work the same way with AI Gateway: convert AI SDK tools with
`experimental_getRealtimeToolDefinitions()` in your setup endpoint and return
the definitions alongside the token. The hook includes them in the session
update after the WebSocket opens.

[Client Session](#client-session)
---------------------------------

Use the `experimental_useRealtime` hook to connect to a realtime model, capture
microphone audio, play model audio, send text messages, and render messages.

app/realtime/page.tsx

```
1

'use client';



2



3

import { openai } from '@ai-sdk/openai';



4

import { experimental_useRealtime } from '@ai-sdk/react';



5



6

const model = openai.experimental_realtime('gpt-realtime');



7

const sessionConfig = {



8

instructions: 'You are a helpful assistant. Be concise.',



9

inputAudioTranscription: {},



10

voice: 'alloy',



11

turnDetection: { type: 'server-vad' as const },



12

};



13



14

export default function RealtimePage() {



15

const realtime = experimental_useRealtime({



16

model,



17

api: {



18

token: '/api/realtime/setup',



19

},



20

sessionConfig,



21

});



22



23

return (



24

<div>



25

<button onClick={realtime.connect}>Connect</button>



26

<button onClick={realtime.disconnect}>Disconnect</button>



27



28

{realtime.messages.map(message => (



29

<div key={message.id}>



30

<strong>{message.role}</strong>



31

{message.parts.map((part, index) =>



32

part.type === 'text' ? <span key={index}>{part.text}</span> : null,



33

)}



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

Keep model and session configuration objects stable across renders. Use module
scope as above, or `useMemo` when configuration depends on props. Replacing either
object replaces the hook's session.

[Tool Calling](#tool-calling)
-----------------------------

Realtime tool execution is client-driven. The provider sends tool calls over the
WebSocket, and your application handles them with `onToolCall`. If the result is
available immediately, return it from `onToolCall`. The SDK sends it back to the
provider as tool output.

For server-backed tools, call an app-specific API endpoint from `onToolCall`.
Avoid generic "execute tool by name" routes. App-specific endpoints are easier
to secure because they can use your normal authentication, authorization,
validation, and rate limiting rules.

### [Server-Backed Tool Endpoint](#server-backed-tool-endpoint)

app/api/weather/route.ts

```
1

import { z } from 'zod';



2



3

const inputSchema = z.object({



4

city: z.string(),



5

});



6



7

export async function POST(request: Request) {



8

const input = inputSchema.safeParse(await request.json());



9



10

if (!input.success) {



11

return Response.json({ error: 'Invalid input' }, { status: 400 });



12

}



13



14

return Response.json({



15

city: input.data.city,



16

temperature: 72,



17

condition: 'sunny',



18

});



19

}
```

### [Client Tool Handler](#client-tool-handler)

app/realtime/page.tsx

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_useRealtime } from '@ai-sdk/react';



3



4

const model = openai.experimental_realtime('gpt-realtime');



5



6

export default function RealtimePage() {



7

const realtime = experimental_useRealtime({



8

model,



9

api: {



10

token: '/api/realtime/setup',



11

},



12

onToolCall: async ({ toolCall }) => {



13

if (toolCall.toolName === 'getWeather') {



14

const response = await fetch('/api/weather', {



15

method: 'POST',



16

headers: { 'Content-Type': 'application/json' },



17

body: JSON.stringify(toolCall.args),



18

});



19



20

if (!response.ok) {



21

throw new Error('Weather lookup failed');



22

}



23



24

return response.json();



25

}



26

},



27

});



28



29

// ...



30

}
```

You can also submit tool output manually with `addToolOutput` when the tool
requires user interaction or another asynchronous process:

```
1

realtime.addToolOutput(toolCallId, {



2

approved: true,



3

});
```

[Supported Providers](#supported-providers)
-------------------------------------------

Realtime models are available on providers that expose realtime WebSocket APIs:

```
1

import { openai } from '@ai-sdk/openai';



2

import { google } from '@ai-sdk/google';



3

import { xai } from '@ai-sdk/xai';



4



5

const openaiModel = openai.experimental_realtime('gpt-realtime');



6

const googleModel = google.experimental_realtime(



7

'gemini-3.1-flash-live-preview',



8

);



9

const xaiModel = xai.experimental_realtime('grok-voice-latest');
```

You can also route realtime through the [AI Gateway](/providers/ai-sdk-providers/ai-gateway#realtime), which normalizes the
session so the same client code works across upstream providers:

```
1

import { gateway } from '@ai-sdk/gateway';



2



3

const gatewayModel = gateway.experimental_realtime('openai/gpt-realtime-2');
```

`gateway.experimental_realtime.getToken()` mints a short-lived Gateway client
secret on your server. The browser uses that token to open the Gateway
WebSocket; the SDK handles the Gateway-specific WebSocket subprotocols for you.
See the [AI Gateway realtime docs](/providers/ai-sdk-providers/ai-gateway#realtime)
for Gateway-specific token and provider option details.

[Previous

Image Generation](/docs/ai-sdk-core/image-generation)[Next

Transcription](/docs/ai-sdk-core/transcription)
