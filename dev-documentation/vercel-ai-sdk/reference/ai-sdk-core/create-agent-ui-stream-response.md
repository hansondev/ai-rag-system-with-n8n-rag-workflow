---
title: "createAgentUIStreamResponse"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-agent-ui-stream-response
section: reference
crawled: 2026-09-20
---

# createAgentUIStreamResponse

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-agent-ui-stream-response

[AI SDK Core](/docs/ai-sdk-core)createAgentUIStreamResponse


[`createAgentUIStreamResponse`](#createagentuistreamresponse)
=============================================================

The `createAgentUIStreamResponse` function executes an [Agent](/docs/reference/ai-sdk-core/agent), runs its streaming output as a UI message stream, and returns an HTTP [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object whose body is the live, streaming UI message output. This is designed for API routes that deliver real-time agent results, such as chat endpoints or streaming tool-use operations.

[Import](#import)
-----------------

```
import { createAgentUIStreamResponse } from "ai"
```

[Usage](#usage)
---------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, createAgentUIStreamResponse } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

instructions: 'You are a helpful assistant.',



6

tools: { weather: weatherTool, calculator: calculatorTool },



7

});



8



9

export async function POST(request: Request) {



10

const { messages } = await request.json();



11



12

// Optional: support cancellation (aborts on disconnect, etc.)



13

const abortController = new AbortController();



14



15

return createAgentUIStreamResponse({



16

agent,



17

uiMessages: messages,



18

abortSignal: abortController.signal, // optional



19

// experimental_sandbox, // optional: passed through to tool execution



20

// ...other UIMessageStreamOptions like sendSources, experimental_transform, etc.



21

});



22

}
```

[Parameters](#parameters)
-------------------------

### agent:

Agent

### uiMessages:

unknown[]

### abortSignal:

AbortSignal

### timeout:

number | { totalMs?: number }

### experimental\_sandbox:

Experimental\_SandboxSession

### options:

CALL\_OPTIONS

### experimental\_transform:

StreamTextTransform | StreamTextTransform[]

### onStepEnd:

GenerateTextOnStepEndCallback

### onStepFinish:

GenerateTextOnStepFinishCallback

### ...UIMessageStreamOptions:

UIMessageStreamOptions

### headers:

HeadersInit

### status:

number

### statusText:

string

### consumeSseStream:

(options: { stream: ReadableStream<string> }) => PromiseLike<void> | void

[Returns](#returns)
-------------------

A `Promise<Response>` whose `body` is a streaming UI message output from the agent. Use this as the return value of API/server handlers in serverless, Next.js, Express, Hono, or edge runtime contexts.

[Example: Next.js API Route Handler](#example-nextjs-api-route-handler)
-----------------------------------------------------------------------

```
1

import { createAgentUIStreamResponse } from 'ai';



2

import { MyCustomAgent } from '@/agent/my-custom-agent';



3



4

export async function POST(request: Request) {



5

const { messages } = await request.json();



6



7

return createAgentUIStreamResponse({



8

agent: MyCustomAgent,



9

uiMessages: messages,



10

// experimental_sandbox, // optional



11

sendSources: true, // (optional)



12

// headers, status, abortSignal, and other UIMessageStreamOptions also supported



13

});



14

}
```

[How It Works](#how-it-works)
-----------------------------

* 1. **UI Message Validation:** Validates the incoming `uiMessages` array according to the agent's specified tools and requirements.
* 2. **Model Message Conversion:** Converts validated UI messages into the internal model message format for the agent.
* 3. **Streaming Agent Output:** Invokes the agent’s `.stream({ prompt, ... })` to get a stream of chunks (steps/UI messages), passing through options such as `experimental_sandbox`.
* 4. **HTTP Response Creation:** Wraps the output stream as a readable HTTP `Response` object that streams UI message chunks to the client.

[Notes](#notes)
---------------

* Your agent **must** implement `.stream({ prompt, ... })` and define a `tools` property (even if it's just `{}`) to work with this function.
* **Server Only:** This API should only be called in backend/server-side contexts (API routes, edge/serverless/server route handlers, etc.). Not for browser use.
* Pass `experimental_sandbox` when your agent tools need an experimental sandbox environment during execution.
* Additional options (`headers`, `status`, UI stream options, transforms, etc.) are available for advanced scenarios.
* This leverages [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) so your platform/client must support HTTP streaming consumption.

[See Also](#see-also)
---------------------

* [`Agent`](/docs/reference/ai-sdk-core/agent)
* [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent)
* [`UIMessage`](/docs/reference/ai-sdk-core/ui-message)
* [`createAgentUIStream`](/docs/reference/ai-sdk-core/create-agent-ui-stream)

[Previous

createAgentUIStream](/docs/reference/ai-sdk-core/create-agent-ui-stream)[Next

pipeAgentUIStreamToResponse](/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response)
