---
title: "createAgentUIStream"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-agent-ui-stream
section: reference
crawled: 2026-09-20
---

# createAgentUIStream

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-agent-ui-stream

[AI SDK Core](/docs/ai-sdk-core)createAgentUIStream


[`createAgentUIStream`](#createagentuistream)
=============================================

The `createAgentUIStream` function executes an [Agent](/docs/reference/ai-sdk-core/agent), consumes an array of UI messages, and streams the agent's output as UI message chunks via an async iterable. This enables real-time, incremental rendering of AI assistant output with full access to tool use, intermediate reasoning, and interactive UI features in your own runtime—perfect for building chat APIs, dashboards, or bots powered by agents.

[Import](#import)
-----------------

```
import { createAgentUIStream } from "ai"
```

[Usage](#usage)
---------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, createAgentUIStream } from 'ai';



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

export async function* streamAgent(



10

uiMessages: unknown[],



11

abortSignal?: AbortSignal,



12

) {



13

const stream = await createAgentUIStream({



14

agent,



15

uiMessages,



16

abortSignal,



17

// experimental_sandbox, // optional: pass an experimental sandbox through to tool execution



18

// ...other options (see below)



19

});



20



21

for await (const chunk of stream) {



22

yield chunk; // Each chunk is a UI message output from the agent.



23

}



24

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

[Returns](#returns)
-------------------

A `Promise<AsyncIterableStream<UIMessageChunk>>`, where each yielded chunk is a UI message output from the agent (see [`UIMessage`](/docs/reference/ai-sdk-core/ui-message)). This can be consumed with any async iterator loop, or piped to a streaming HTTP response, socket, or any other sink.

[Example](#example)
-------------------

```
1

import { createAgentUIStream } from 'ai';



2



3

const controller = new AbortController();



4



5

const stream = await createAgentUIStream({



6

agent,



7

uiMessages: [{ role: 'user', content: 'What is the weather in SF today?' }],



8

abortSignal: controller.signal,



9

// experimental_sandbox, // optional



10

sendStart: true,



11

// ...other UIMessageStreamOptions



12

});



13



14

for await (const chunk of stream) {



15

// Each chunk is a UI message update — stream it to your client, dashboard, logs, etc.



16

console.log(chunk);



17

}



18



19

// Call controller.abort() to cancel the agent operation early.
```

[How It Works](#how-it-works)
-----------------------------

1. **UI Message Validation:** The input `uiMessages` array is validated and normalized using the agent's `tools` definition. Any invalid messages cause an error.
2. **Conversion to Model Messages:** The validated UI messages are converted into model-specific message format, as required by the agent.
3. **Agent Streaming:** The agent's `.stream({ prompt, ... })` method is invoked with the converted model messages, optional call options, abort signal, experimental\_sandbox, and any experimental transforms.
4. **UI Message Stream Building:** The result stream is converted and exposed as a streaming async iterable of UI message chunks for you to consume.

[Notes](#notes)
---------------

* The agent **must** implement the `.stream({ prompt, ... })` method and define its supported `tools` property.
* This utility returns an async iterable for maximal streaming flexibility. For HTTP responses, see [`createAgentUIStreamResponse`](/docs/reference/ai-sdk-core/create-agent-ui-stream-response) (Web) or [`pipeAgentUIStreamToResponse`](/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response) (Node.js).
* The `uiMessages` parameter is named `uiMessages`, **not** just `messages`.
* You can provide advanced options via `UIMessageStreamOptions` (for example, to include sources or usage).
* To cancel the stream, pass an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) via the `abortSignal` parameter.
* Pass `experimental_sandbox` when your agent tools need an experimental sandbox environment during execution.

[See Also](#see-also)
---------------------

* [`Agent`](/docs/reference/ai-sdk-core/agent)
* [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent)
* [`UIMessage`](/docs/reference/ai-sdk-core/ui-message)
* [`createAgentUIStreamResponse`](/docs/reference/ai-sdk-core/create-agent-ui-stream-response)
* [`pipeAgentUIStreamToResponse`](/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response)

[Previous

ToolLoopAgent](/docs/reference/ai-sdk-core/tool-loop-agent)[Next

createAgentUIStreamResponse](/docs/reference/ai-sdk-core/create-agent-ui-stream-response)
