---
title: "Agent (interface)"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/agent
section: reference
crawled: 2026-09-20
---

# Agent (interface)

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/agent

[AI SDK Core](/docs/ai-sdk-core)Agent (Interface)


[`Agent` (interface)](#agent-interface)
=======================================

The `Agent` interface defines a contract for agents that can generate or stream AI-generated responses in response to prompts. Agents may encapsulate advanced logic such as tool usage, multi-step workflows, or prompt handling, enabling both simple and autonomous AI agents.

Implementations of the `Agent` interface—such as `ToolLoopAgent`—fulfill the same contract and integrate seamlessly with all SDK APIs and utilities that expect an agent. This design allows users to supply custom agent classes or wrappers for third-party chains, while maximizing compatibility with AI SDK features.

[Interface Definition](#interface-definition)
---------------------------------------------

```
1

import {



2

ModelMessage,



3

Experimental_SandboxSession,



4

} from '@ai-sdk/provider-utils';



5

import { ToolSet } from '../generate-text/tool-set';



6

import { Output } from '../generate-text/output';



7

import { GenerateTextResult } from '../generate-text/generate-text-result';



8

import { StreamTextResult } from '../generate-text/stream-text-result';



9



10

export type AgentCallParameters<CALL_OPTIONS, TOOLS extends ToolSet = {}> = ([



11

CALL_OPTIONS,



12

] extends [never]



13

? { options?: never }



14

: { options: CALL_OPTIONS }) &



15

(



16

| {



17

/**



18

* A prompt. It can be either a text prompt or a list of messages.



19

*



20

* You can either use `prompt` or `messages` but not both.



21

*/



22

prompt: string | Array<ModelMessage>;



23



24

/**



25

* A list of messages.



26

*



27

* You can either use `prompt` or `messages` but not both.



28

*/



29

messages?: never;



30

}



31

| {



32

/**



33

* A list of messages.



34

*



35

* You can either use `prompt` or `messages` but not both.



36

*/



37

messages: Array<ModelMessage>;



38



39

/**



40

* A prompt. It can be either a text prompt or a list of messages.



41

*



42

* You can either use `prompt` or `messages` but not both.



43

*/



44

prompt?: never;



45

}



46

) & {



47

/**



48

* Abort signal.



49

*/



50

abortSignal?: AbortSignal;



51

/**



52

* Timeout in milliseconds. Can be specified as a number or as an object with a totalMs property.



53

* The call will be aborted if it takes longer than the specified timeout.



54

* Can be used alongside abortSignal.



55

*/



56

timeout?: number | { totalMs?: number };



57

/**



58

* Experimental sandbox environment that is passed through to tool execution.



59

*/



60

experimental_sandbox?: Experimental_SandboxSession;



61

/**



62

* Callback that is called when the agent operation begins, before any LLM calls.



63

*/



64

onStart?: GenerateTextOnStartCallback<TOOLS>;



65

/**



66

* Callback that is called when a step (LLM call) begins, before the provider is called.



67

*/



68

onStepStart?: GenerateTextOnStepStartCallback<TOOLS>;



69

/**



70

* Callback that is called before each tool execution begins.



71

*/



72

onToolExecutionStart?: OnToolExecutionStartCallback<TOOLS>;



73

/**



74

* Callback that is called after each tool execution completes.



75

*/



76

onToolExecutionEnd?: OnToolExecutionEndCallback<TOOLS>;



77

/**



78

* Callback that is called when each step (LLM call) ends, including intermediate steps.



79

*/



80

onStepEnd?: GenerateTextOnStepEndCallback<TOOLS>;



81

/**



82

* Callback that is called when each step (LLM call) ends, including intermediate steps.



83

*



84

* @deprecated Use `onStepEnd` instead.



85

*/



86

onStepFinish?: GenerateTextOnStepFinishCallback<TOOLS>;



87

/**



88

* Callback that is called when all steps are finished and the response is complete.



89

*/



90

onEnd?: GenerateTextOnEndCallback<TOOLS>;



91

/**



92

* Callback that is called when all steps are finished and the response is complete.



93

*



94

* @deprecated Use `onEnd` instead.



95

*/



96

onFinish?: GenerateTextOnEndCallback<TOOLS>;



97

};



98



99

/**



100

* An Agent receives a prompt (text or messages) and generates or streams an output



101

* that consists of steps, tool calls, data parts, etc.



102

*



103

* You can implement your own Agent by implementing the `Agent` interface,



104

* or use the `ToolLoopAgent` class.



105

*/



106

export interface Agent<



107

CALL_OPTIONS = never,



108

TOOLS extends ToolSet = {},



109

OUTPUT extends Output = never,



110

> {



111

/**



112

* The specification version of the agent interface. This will enable



113

* us to evolve the agent interface and retain backwards compatibility.



114

*/



115

readonly version: 'agent-v1';



116



117

/**



118

* The id of the agent.



119

*/



120

readonly id: string | undefined;



121



122

/**



123

* The tools that the agent can use.



124

*/



125

readonly tools: TOOLS;



126



127

/**



128

* Generates an output from the agent (non-streaming).



129

*/



130

generate(



131

options: AgentCallParameters<CALL_OPTIONS, TOOLS>,



132

): PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>;



133



134

/**



135

* Streams an output from the agent (streaming).



136

*/



137

stream(



138

options: AgentStreamParameters<CALL_OPTIONS, TOOLS>,



139

): PromiseLike<StreamTextResult<TOOLS, OUTPUT>>;



140

}
```

[Core Properties & Methods](#core-properties--methods)
------------------------------------------------------

| Name | Type | Description |
| --- | --- | --- |
| `version` | `'agent-v1'` | Interface version for compatibility. |
| `id` | `string | undefined` | Optional agent identifier. |
| `tools` | `ToolSet` | The set of tools available to this agent. |
| `generate()` | `PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>` | Generates full, non-streaming output for a text prompt or messages. |
| `stream()` | `PromiseLike<StreamTextResult<TOOLS, OUTPUT>>` | Streams output (chunks or steps) for a text prompt or messages. |

[Generic Parameters](#generic-parameters)
-----------------------------------------

| Parameter | Default | Description |
| --- | --- | --- |
| `CALL_OPTIONS` | `never` | Optional type for additional call options that can be passed to the agent. |
| `TOOLS` | `{}` | The type of the tool set available to this agent. |
| `OUTPUT` | `never` | The type of additional output data that the agent can produce. |

[Method Parameters](#method-parameters)
---------------------------------------

Both `generate()` and `stream()` accept an `AgentCallParameters<CALL_OPTIONS, TOOLS>` object with:

* `prompt` (optional): A string prompt or array of `ModelMessage` objects
* `messages` (optional): An array of `ModelMessage` objects (mutually exclusive with `prompt`)
* `options` (optional): Additional call options when `CALL_OPTIONS` is not `never`
* `abortSignal` (optional): An `AbortSignal` to cancel the operation
* `timeout` (optional): A timeout in milliseconds. Can be specified as a number or as an object with a `totalMs` property. The call will be aborted if it takes longer than the specified timeout. Can be used alongside `abortSignal`.
* `experimental_sandbox` (optional): An experimental sandbox environment forwarded to tool execution.
* `onStart` (optional): Callback invoked when the agent operation begins, before any LLM calls.
* `onStepStart` (optional): Callback invoked when a step (LLM call) begins, before the provider is called.
* `onToolExecutionStart` (optional): Callback invoked right before a tool's execute function runs.
* `onToolExecutionEnd` (optional): Callback invoked right after a tool's execute function completes or errors.
* `onStepEnd` (optional): A callback invoked after each agent step (LLM/tool call) completes. Useful for tracking token usage, per-step performance, or logging.
* `onStepFinish` (optional): Deprecated alias for `onStepEnd`.
* `onEnd` (optional): A callback invoked when all steps are finished and the response is complete.
* `onFinish` (optional): Deprecated alias for `onEnd`.

[Example: Custom Agent Implementation](#example-custom-agent-implementation)
----------------------------------------------------------------------------

Here's how you might implement your own Agent:

```
1

import { Agent, GenerateTextResult, StreamTextResult } from 'ai';



2

import type { ModelMessage } from '@ai-sdk/provider-utils';



3



4

class MyEchoAgent implements Agent {



5

version = 'agent-v1' as const;



6

id = 'echo';



7

tools = {};



8



9

async generate({ prompt, messages, abortSignal }) {



10

const text = prompt ?? JSON.stringify(messages);



11

return { text, steps: [] };



12

}



13



14

async stream({ prompt, messages, abortSignal }) {



15

const text = prompt ?? JSON.stringify(messages);



16

return {



17

textStream: (async function* () {



18

yield text;



19

})(),



20

};



21

}



22

}
```

[Usage: Interacting with Agents](#usage-interacting-with-agents)
----------------------------------------------------------------

All SDK utilities that accept an agent—including [`createAgentUIStream`](/docs/reference/ai-sdk-core/create-agent-ui-stream), [`createAgentUIStreamResponse`](/docs/reference/ai-sdk-core/create-agent-ui-stream-response), and [`pipeAgentUIStreamToResponse`](/docs/reference/ai-sdk-core/pipe-agent-ui-stream-to-response)—expect an object adhering to the `Agent` interface.

You can use the official [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent) (recommended for multi-step AI workflows with tool use), or supply your own implementation:

```
1

import { ToolLoopAgent, createAgentUIStream } from "ai";



2



3

const agent = new ToolLoopAgent({ ... });



4



5

const stream = await createAgentUIStream({



6

agent,



7

messages: [{ role: "user", content: "What is the weather in NYC?" }]



8

});



9



10

for await (const chunk of stream) {



11

console.log(chunk);



12

}
```

[See Also](#see-also)
---------------------

* [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent) — Official multi-step agent implementation
* [`createAgentUIStream`](/docs/reference/ai-sdk-core/create-agent-ui-stream)
* [`GenerateTextResult`](/docs/reference/ai-sdk-core/generate-text)
* [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text)

[Notes](#notes)
---------------

* Agents should define their `tools` property, even if empty (`{}`), for compatibility with SDK utilities.
* The interface accepts both plain prompts and message arrays as input, but only one at a time.
* The `CALL_OPTIONS` generic parameter allows agents to accept additional call-specific options when needed.
* The `abortSignal` parameter enables cancellation of agent operations.
* This design is extensible for both complex autonomous agents and simple LLM wrappers.

[Previous

uploadSkill](/docs/reference/ai-sdk-core/upload-skill)[Next

ToolLoopAgent](/docs/reference/ai-sdk-core/tool-loop-agent)
