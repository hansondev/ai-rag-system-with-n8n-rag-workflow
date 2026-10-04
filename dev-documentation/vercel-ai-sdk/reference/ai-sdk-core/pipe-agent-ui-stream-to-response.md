---
title: "pipeAgentUIStreamToResponse"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response
section: reference
crawled: 2026-09-20
---

# pipeAgentUIStreamToResponse

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response

[AI SDK Core](/docs/ai-sdk-core)pipeAgentUIStreamToResponse


[`pipeAgentUIStreamToResponse`](#pipeagentuistreamtoresponse)
=============================================================

The `pipeAgentUIStreamToResponse` function runs an [Agent](/docs/reference/ai-sdk-core/agent) and streams the resulting UI message output directly to a Node.js [`ServerResponse`](https://nodejs.org/api/http.html#class-httpserverresponse) object. This is ideal for building real-time streaming API endpoints (for chat, tool use, etc.) in Node.js-based frameworks like Express, Hono, or custom Node servers.

[Import](#import)
-----------------

```
import { pipeAgentUIStreamToResponse } from "ai"
```

[Usage](#usage)
---------------

```
1

import { pipeAgentUIStreamToResponse } from 'ai';



2

import { MyAgent } from './agent';



3



4

export async function handler(req, res) {



5

const { messages } = JSON.parse(req.body);



6



7

await pipeAgentUIStreamToResponse({



8

response: res, // Node.js ServerResponse



9

agent: MyAgent,



10

uiMessages: messages, // Required: array of input UI messages



11

// abortSignal: optional AbortSignal for cancellation



12

// experimental_sandbox: optional experimental sandbox passed through to tool execution



13

// status: 200,



14

// headers: { ... },



15

// ...other optional UI message stream options



16

});



17

}
```

[Parameters](#parameters)
-------------------------

### response:

ServerResponse

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

### ...UIMessageStreamResponseInit & UIMessageStreamOptions:

object

[Returns](#returns)
-------------------

A `Promise<void>`. The function completes when the UI message stream has been fully sent to the provided ServerResponse.

[Example: Express Route Handler](#example-express-route-handler)
----------------------------------------------------------------

```
1

import { pipeAgentUIStreamToResponse } from 'ai';



2

import { openaiWebSearchAgent } from './openai-web-search-agent';



3



4

app.post('/chat', async (req, res) => {



5

// Use req.body.messages as input UI messages



6

await pipeAgentUIStreamToResponse({



7

response: res,



8

agent: openaiWebSearchAgent,



9

uiMessages: req.body.messages,



10

// experimental_sandbox, // optional



11

// abortSignal: yourController.signal



12

// status: 200,



13

// headers: { ... },



14

// ...more options



15

});



16

});
```

[How It Works](#how-it-works)
-----------------------------

1. **Runs the Agent:** Calls the agent’s `.stream` method with the provided UI messages and options, converting them into model messages as needed and passing through options such as `experimental_sandbox`.
2. **Streams UI Message Output:** Pipes the agent output as a UI message stream to the `ServerResponse`, sending data via streaming HTTP responses (including appropriate headers).
3. **Abort Signal Handling:** If `abortSignal` is supplied, streaming is cancelled as soon as the signal is triggered (such as on client disconnect).
4. **No Response Return:** Unlike Edge/serverless APIs that return a `Response`, this function writes bytes directly to the ServerResponse and does not return a response object.

[Notes](#notes)
---------------

* **Abort Handling:** For best robustness, use an `AbortSignal` (for example, wired to Express/Hono client disconnects) to ensure quick cancellation of agent computation and streaming.
* **Node.js Only:** Only works with Node.js [ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) objects (e.g., in Express, Hono’s node adapter, etc.), not Edge/serverless/web Response APIs.
* **Streaming Support:** Make sure your client (and any proxies) correctly support streaming HTTP responses for full effect.
* **Parameter Names:** The property for input messages is `uiMessages` (not `messages`) for consistency with SDK agent utilities.
* Pass `experimental_sandbox` when your agent tools need an experimental sandbox environment during execution.

[See Also](#see-also)
---------------------

* [`createAgentUIStreamResponse`](/docs/reference/ai-sdk-core/create-agent-ui-stream-response)
* [`Agent`](/docs/reference/ai-sdk-core/agent)
* [`UIMessage`](/docs/reference/ai-sdk-core/ui-message)

[Previous

createAgentUIStreamResponse](/docs/reference/ai-sdk-core/create-agent-ui-stream-response)[Next

experimental\_startBatch](/docs/reference/ai-sdk-core/start-batch)
