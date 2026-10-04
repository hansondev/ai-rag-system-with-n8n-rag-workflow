---
title: "Tool Calling"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
section: ai-sdk-core
crawled: 2026-09-20
---

# Tool Calling

> Source: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling

[AI SDK Core](/docs/ai-sdk-core)Tool Calling


[Tool Calling](#tool-calling)
=============================

As covered under Foundations, [tools](/docs/foundations/tools) are objects that can be called by the model to perform a specific task.
Function tools and dynamic tools contain several core elements:

* **`description`**: An optional description of the tool that can influence when the tool is picked. It can be a string or a function that derives the description from the tool's context and experimental sandbox.
* **`inputSchema`**: A [Zod schema](/docs/foundations/tools#schemas) or a [JSON schema](/docs/reference/ai-sdk-core/json-schema) that defines the input parameters. The schema is consumed by the LLM, and also used to validate the LLM tool calls.
* **`execute`**: An optional async function that is called with the inputs from the tool call. It produces a value of type `RESULT` (generic type). It is optional because you might want to forward tool calls to the client or to a queue instead of executing them in the same process.
* **`strict`**: *(optional, boolean)* Enables strict tool calling when supported by the provider

You can use the [`tool`](/docs/reference/ai-sdk-core/tool) helper function to
infer the types of the `execute` parameters.

The `tools` parameter of `generateText` and `streamText` is an object that has the tool names as keys and the tools as values:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { z } from 'zod';



2

import { generateText, tool, isStepCount } from 'ai';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

tools: {



7

weather: tool({



8

description: 'Get the weather in a location',



9

inputSchema: z.object({



10

location: z.string().describe('The location to get the weather for'),



11

}),



12

execute: async ({ location }) => ({



13

location,



14

temperature: 72 + Math.floor(Math.random() * 21) - 10,



15

}),



16

}),



17

},



18

stopWhen: isStepCount(5),



19

prompt: 'What is the weather in San Francisco?',



20

});
```

When a model uses a tool, it is called a "tool call" and the output of the
tool is called a "tool result".

Tool calling is not restricted to only text generation.
You can also use it to render user interfaces (Generative UI).

[Dynamic Descriptions](#dynamic-descriptions)
---------------------------------------------

Tool descriptions can be fixed strings or functions. Use a function when the
description sent to the model should depend on the current tool context or
experimental sandbox, such as a tenant, project, environment, or workspace.

The description function is resolved before the tool definition is sent to the
model for each generation step. It receives the matching tool `context` from
`toolsContext` and the current `experimental_sandbox`, if one was provided. If `prepareStep`
updates `toolsContext` or `experimental_sandbox`, the next step uses those updated values.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const shell = tool({



5

contextSchema: z.object({



6

projectName: z.string(),



7

}),



8

description: ({ context, experimental_sandbox }) =>



9

[



10

`Run shell commands for the ${context.projectName} project.`,



11

experimental_sandbox != null



12

? `Sandbox: ${experimental_sandbox.description}`



13

: undefined,



14

]



15

.filter(Boolean)



16

.join('\n'),



17

inputSchema: z.object({



18

command: z.string(),



19

}),



20

execute: async ({ command }, { experimental_sandbox }) => {



21

if (!experimental_sandbox) {



22

throw new Error('Experimental sandbox is not available');



23

}



24



25

return experimental_sandbox.run({ command });



26

},



27

});



28



29

const result = await generateText({



30

model: "xai/grok-4.6",



31

tools: { shell },



32

toolsContext: {



33

shell: { projectName: 'web-app' },



34

},



35

experimental_sandbox,



36

prompt: 'List the project files.',



37

});
```

[Strict Mode](#strict-mode)
---------------------------

When enabled, language model providers that support strict tool calling will only generate tool calls that are valid according to your defined `inputSchema`.
This increases the reliability of tool calling.
However, not all schemas may be supported in strict mode, and what is supported depends on the specific provider.

By default, strict mode is disabled. You can enable it per-tool by setting `strict: true`:

```
1

tool({



2

description: 'Get the weather in a location',



3

inputSchema: z.object({



4

location: z.string(),



5

}),



6

strict: true, // Enable strict validation for this tool



7

execute: async ({ location }) => ({



8

// ...



9

}),



10

});
```

Not all providers or models support strict mode. For those that do not, this
option is ignored.

[Input Examples](#input-examples)
---------------------------------

You can specify example inputs for your tools to help guide the model on how input data should be structured.
When supported by providers, input examples can help when JSON schema itself does not fully specify the intended
usage or when there are optional values.

```
1

tool({



2

description: 'Get the weather in a location',



3

inputSchema: z.object({



4

location: z.string().describe('The location to get the weather for'),



5

}),



6

inputExamples: [



7

{ input: { location: 'San Francisco' } },



8

{ input: { location: 'London' } },



9

],



10

execute: async ({ location }) => {



11

// ...



12

},



13

});
```

Only the Anthropic providers supports tool input examples natively. Other
providers ignore the setting.

[Tool Execution Approval](#tool-execution-approval)
---------------------------------------------------

By default, tools with an `execute` function run automatically as the model calls them. Configure approval with `toolApproval` on `generateText`, `streamText`, or `ToolLoopAgent`.

`toolApproval` can be either:

* A `GenericToolApprovalFunction` for all tool calls
* A per-tool map of statuses and/or `SingleToolApprovalFunction` callbacks (either function may return `undefined` for the same effect as `'not-applicable'`)

The older `needsApproval` property on `tool()` definitions is deprecated. Existing code still works, but new code should move approval logic to `toolApproval`.

### [Configure `toolApproval`](#configure-toolapproval)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: { runCommand },



4

toolApproval: {



5

runCommand: 'user-approval',



6

},



7

prompt: 'Remove the most recent file in the downloads folder',



8

});
```

In the per-tool object form, each key can be one of four statuses, either as a
string or as an object with a `type` field:

* `'not-applicable'`: the tool is executed without an approval flow. This is the default behavior.
* `'approved'`: record an automatic approval by emitting approval request/response parts in the output, then execute the tool
* `'denied'`: record an automatic denial by emitting approval request/response parts in the output, then surface a denied tool output
* `'user-approval'`: emit an approval request and wait for an explicit response

Object statuses can also include a reason. For automatic approvals and denials,
the reason is emitted on the approval response. For manual approval, the reason
is emitted on the approval request so it can be shown to the approver:

```
1

toolApproval: {



2

runCommand: {



3

type: 'user-approval',



4

reason: 'filesystem changes require operator review',



5

},



6

}
```

#### [Generic `toolApproval` function](#generic-toolapproval-function)

Pass a `GenericToolApprovalFunction` as `toolApproval` to handle every tool
call in one place. The callback receives `toolCall`, `tools`, `toolsContext`,
`messages`, and `runtimeContext` (the same `runtimeContext` you pass to
`generateText` or `streamText`, typed as the second `ToolApprovalConfiguration`
type parameter; it defaults to `Context`). It may return `undefined` for the same effect as `'not-applicable'`.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: { runCommand },



4

toolApproval: ({



5

toolCall,



6

tools,



7

toolsContext,



8

messages,



9

runtimeContext,



10

}) => {



11

if (toolCall.toolName === 'runCommand' && !toolCall.dynamic) {



12

// Inspect toolCall.input, cross-tool state, messages, or runtimeContext for policy.



13

return 'user-approval';



14

}



15

return undefined; // or 'not-applicable'



16

},



17

prompt: 'Remove the most recent file in the downloads folder',



18

});
```

The same pattern works for `streamText` and for `toolApproval` on
[`ToolLoopAgent`](/docs/agents/building-agents#tools) when you need one policy
across all tools.

For a per-tool object instead, each key can be a `SingleToolApprovalFunction`
that receives the tool input and options `toolCallId`, `messages`, `toolContext`
(the same shape as tool execution `context`, without `abortSignal`), and
`runtimeContext`. Return `undefined` for the same effect as `'not-applicable'`.

This is useful for tools that perform sensitive operations like executing commands, processing payments, modifying data, and more potentially dangerous actions.

### [How It Works](#how-it-works)

When a tool requires manual approval, `generateText` and `streamText` don't pause execution. Instead, they complete and return `tool-approval-request` parts in the result content. This means the manual approval flow requires two calls to the model: the first returns the approval request, and the second (after receiving the approval response) either executes the tool or informs the model that approval was denied.

Manual approval comes from `toolApproval` returning `'user-approval'`. If the
tool should just execute normally, use `'not-applicable'`, return `undefined`
from a `GenericToolApprovalFunction` or `SingleToolApprovalFunction`, or omit
the setting entirely. If `toolApproval` returns `'approved'` or `'denied'` or
their object forms, the SDK records that decision automatically in the same
generation by emitting approval request/response parts. When you provide a
`reason` on an automatic approval or denial, that reason is included in the
emitted approval response and can be rendered in the UI.

Here's the manual approval flow:

1. Call `generateText` or `streamText` with `toolApproval`
2. The model generates a tool call
3. The call returns `tool-approval-request` parts in `result.content`
4. Your app requests approval and collects the user's decision
5. Add a `tool-approval-response` to the messages array
6. Call `generateText` or `streamText` again with the updated messages
7. If approved, the tool runs and returns a result. If denied, the model sees the denial and responds accordingly.

### [Handling Approval Requests](#handling-approval-requests)

After calling `generateText` or `streamText`, check `result.content` for `tool-approval-request` parts:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { type ModelMessage, generateText } from 'ai';



2



3

const messages: ModelMessage[] = [



4

{ role: 'user', content: 'Remove the most recent file' },



5

];



6

const result = await generateText({



7

model: "xai/grok-4.6",



8

tools: { runCommand },



9

messages,



10

});



11



12

messages.push(...result.responseMessages);



13



14

for (const part of result.content) {



15

if (part.type === 'tool-approval-request' && !part.isAutomatic) {



16

console.log(part.approvalId); // Unique ID for this approval request



17

console.log(part.toolCall); // Contains toolName, input, etc.



18

console.log(part.reason); // Why this tool call requires approval



19

}



20

}
```

To respond, create a `tool-approval-response` and add it to your messages:

```
1

import { type ToolApprovalResponse } from 'ai';



2



3

const approvals: ToolApprovalResponse[] = [];



4



5

for (const part of result.content) {



6

if (part.type === 'tool-approval-request' && !part.isAutomatic) {



7

const response: ToolApprovalResponse = {



8

type: 'tool-approval-response',



9

approvalId: part.approvalId,



10

approved: true, // or false to deny



11

reason: 'User confirmed the command', // Optional context for the model



12

};



13

approvals.push(response);



14

}



15

}



16



17

// add approvals to messages



18

messages.push({ role: 'tool', content: approvals });
```

Then call `generateText` or `streamText` again with the updated messages. If approved, the tool executes. If denied, the model receives the denial and can respond accordingly.

When the tool should execute without any approval metadata in the output, use
`'not-applicable'`, return `undefined` from an approval function, or omit `toolApproval`. Use `'approved'`, `'denied'`, or
their object forms only when you want the result to include an automatic
`tool-approval-request` with `isAutomatic: true` followed by a
`tool-approval-response`, so you can inspect or render the decision without
prompting the user again.

When a tool execution is denied, consider adding a system instruction like
"When a tool execution is not approved, do not retry it" to prevent the model
from attempting the same call again.

Provider-executed tools are executed provider-side without considering the
tool approval setting. `toolApproval` (and the deprecated `needsApproval`)
only control tools that the AI SDK executes locally.

### [Dynamic Approval](#dynamic-approval)

You can make approval decisions based on tool input by providing an async
function in a per-tool `toolApproval` object:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const paymentTool = tool({



2

description: 'Process a payment',



3

inputSchema: z.object({



4

amount: z.number(),



5

recipient: z.string(),



6

}),



7

execute: async ({ amount, recipient }) => {



8

return await processPayment(amount, recipient);



9

},



10

});



11



12

const result = await generateText({



13

model: "xai/grok-4.6",



14

tools: {



15

processPayment: paymentTool,



16

},



17

toolApproval: {



18

processPayment: async ({ amount }) =>



19

amount > 1000 ? 'user-approval' : undefined,



20

},



21

prompt: 'Send $1500 to the contractor',



22

});
```

In this example, only transactions over $1000 require approval. Smaller
transactions execute automatically.

You can use a `SingleToolApprovalFunction` in a per-tool `toolApproval` object when you want to return
`'not-applicable'`, `undefined` (equivalent to `'not-applicable'`), `'approved'`, `'denied'`, or `'user-approval'` at call time
instead of defining the default on the tool itself. For automatic approvals and
denials, the callback can also return `{ type, reason }`, for example
`{ type: 'denied', reason: 'blocked by policy' }`. For decisions that need the full `toolCall` or
several tools at once, pass a `GenericToolApprovalFunction` as `toolApproval` instead
of a per-tool map. The generic function can return `undefined` the same way.

### [Tool Execution Approval with useChat](#tool-execution-approval-with-usechat)

When using `useChat`, the approval flow is handled through UI state. See [Chatbot Tool Usage](/docs/ai-sdk-ui/chatbot-tool-usage#tool-execution-approval) for details on handling approvals in your UI with `addToolApprovalResponse`.

[Multi-Step Calls (using stopWhen)](#multi-step-calls-using-stopwhen)
---------------------------------------------------------------------

With the `stopWhen` setting, you can enable multi-step calls in `generateText` and `streamText`. When `stopWhen` is set and the model generates a tool call, the AI SDK will trigger a new generation passing in the tool result until there are no further tool calls or the stopping condition is met.

The AI SDK provides several built-in stopping conditions:

* `isStepCount(count)` — stops after a specified number of steps (default: `isStepCount(20)`)
* `hasToolCall(...toolNames)` — stops when any of the specified tools is called
* `isLoopFinished()` — never triggers, letting the loop run until naturally finished

You can also combine multiple conditions in an array or create custom conditions. See [Loop Control](/docs/agents/loop-control) for more details.

The `stopWhen` conditions are only evaluated when the last step contains tool
results.

By default, when you use `generateText` or `streamText`, it triggers a single generation. This works well for many use cases where you can rely on the model's training data to generate a response. However, when you provide tools, the model now has the choice to either generate a normal text response, or generate a tool call. If the model generates a tool call, its generation is complete and that step is finished.

You may want the model to generate text after the tool has been executed, either to summarize the tool results in the context of the users query. In many cases, you may also want the model to use multiple tools in a single response. This is where multi-step calls come in.

You can think of multi-step calls in a similar way to a conversation with a human. When you ask a question, if the person does not have the requisite knowledge in their common knowledge (a model's training data), the person may need to look up information (use a tool) before they can provide you with an answer. In the same way, the model may need to call a tool to get the information it needs to answer your question where each generation (tool call or text generation) is a step.

### [Example](#example)

In the following example, there are two steps:

1. **Step 1**
   1. The prompt `'What is the weather in San Francisco?'` is sent to the model.
   2. The model generates a tool call.
   3. The tool call is executed.
2. **Step 2**
   1. The tool result is sent to the model.
   2. The model generates a response considering the tool result.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { z } from 'zod';



2

import { generateText, tool, isStepCount } from 'ai';



3



4

const { text, steps } = await generateText({



5

model: "xai/grok-4.6",



6

tools: {



7

weather: tool({



8

description: 'Get the weather in a location',



9

inputSchema: z.object({



10

location: z.string().describe('The location to get the weather for'),



11

}),



12

execute: async ({ location }) => ({



13

location,



14

temperature: 72 + Math.floor(Math.random() * 21) - 10,



15

}),



16

}),



17

},



18

stopWhen: isStepCount(5), // stop after a maximum of 5 steps if tools were called



19

prompt: 'What is the weather in San Francisco?',



20

});
```

You can use `streamText` in a similar way.

### [Steps](#steps)

To access intermediate tool calls and results, you can use the `steps` property in the result object
or the `streamText` `onEnd` callback.
It contains all the text, tool calls, tool results, per-step `performance`, and more from each step.

#### [Example: Extract tool results from all steps](#example-extract-tool-results-from-all-steps)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const { steps } = await generateText({



4

model: "xai/grok-4.6",



5

stopWhen: isStepCount(10),



6

// ...



7

});



8



9

// extract all tool calls from the steps:



10

const allToolCalls = steps.flatMap(step => step.toolCalls);
```

### [`onStepEnd` callback](#onstepend-callback)

When using `generateText` or `streamText`, you can provide an `onStepEnd` callback that
is triggered when a step is finished,
i.e. all text deltas, tool calls, and tool results for the step are available.
When you have multiple steps, the callback is triggered for each step.

The callback receives a `stepNumber` (zero-based) to identify which step just completed:

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

// ...



5

onStepEnd({



6

stepNumber,



7

text,



8

toolCalls,



9

toolResults,



10

finishReason,



11

usage,



12

performance,



13

}) {



14

console.log(`Step ${stepNumber} finished (${finishReason})`, {



15

usage,



16

performance,



17

});



18

// your own logic, e.g. for saving the chat history or recording usage



19

},



20

});
```

### [Tool execution lifecycle callbacks](#tool-execution-lifecycle-callbacks)

You can use `onToolExecutionStart` and `onToolExecutionEnd` to observe tool execution.
These callbacks are called right before and after each tool's `execute` function, giving you
visibility into tool execution timing, inputs, outputs, and errors:

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

// ... model, tools, prompt



5

onToolExecutionStart({ toolCall }) {



6

console.log(`Calling tool: ${toolCall.toolName}`, {



7

toolCallId: toolCall.toolCallId,



8

input: toolCall.input,



9

});



10

},



11

onToolExecutionEnd({ toolCall, toolExecutionMs, toolOutput }) {



12

if (toolOutput.type === 'tool-error') {



13

console.error(



14

`Tool ${toolCall.toolName} failed after ${toolExecutionMs}ms:`,



15

toolOutput.error,



16

);



17

} else {



18

console.log(



19

`Tool ${toolCall.toolName} completed in ${toolExecutionMs}ms`,



20

{



21

output: toolOutput.output,



22

},



23

);



24

}



25

},



26

});
```

Errors thrown inside these callbacks are silently caught and do not break the generation flow.

### [`prepareStep` callback](#preparestep-callback)

The `prepareStep` callback is called before a step is started.

It is called with the following parameters:

* `model`: The model that was passed into `generateText`.
* `stopWhen`: The stopping condition that was passed into `generateText`.
* `stepNumber`: The number of the step that is being executed.
* `steps`: The steps that have been executed so far.
* `instructions`: The instructions that will be sent to the model for the current step. If `prepareStep` returns an `instructions` override, those instructions carry forward as the default for later steps.
* `initialInstructions`: The instructions that were passed into `generateText` or `streamText`.
* `messages`: The messages that will be sent to the model for the current step. Treat this as the loop's current message state. If `prepareStep` returns a `messages` override, those messages carry forward as the base for later steps.
* `initialMessages`: The messages that were passed into `generateText` or `streamText`.
* `responseMessages`: The accumulated assistant/tool response messages so far, including any tool results generated before the first model step from approved tool calls in the input messages.
* `runtimeContext`: The runtime context passed via the `runtimeContext` setting.
* `toolsContext`: The per-tool context map passed via the `toolsContext` setting.
* `experimental_sandbox`: The experimental sandbox passed via the `experimental_sandbox` setting.

You can use it to provide different settings for a step, including modifying the input messages.

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

// ...



5

prepareStep: async ({ model, stepNumber, steps, messages }) => {



6

if (stepNumber === 0) {



7

return {



8

// use a different model for this step:



9

model: modelForThisParticularStep,



10

// force a tool choice for this step:



11

toolChoice: { type: 'tool', toolName: 'tool1' },



12

// limit the tools that are available for this step:



13

activeTools: ['tool1'],



14

};



15

}



16



17

// when nothing is returned, the default settings are used



18

},



19

});
```

If you return `instructions`, those instructions carry forward to later steps until `prepareStep` returns another `instructions` or `system` override. Use `initialInstructions` when you need to restore or compare against the top-level instructions from the original call.

#### [Message Modification for Longer Agentic Loops](#message-modification-for-longer-agentic-loops)

In longer agentic loops, you can use the `messages` parameter to mutate the message state that will be used by later steps. This is particularly useful for context compaction, and you decide when compaction should happen.

The `messages` parameter contains the messages for the current step. By default, this is `initialMessages` followed by the accumulated `responseMessages`. If a previous `prepareStep` returned `messages`, later steps use those persisted messages plus the response messages from the previous step.

Use `initialMessages` when you need the original input messages and `responseMessages` when you need the discrete assistant/tool response messages from the model so far.

The `pruneMessages` helper provides a built-in way to remove selected messages or message parts. You can use it inside `prepareStep` when you want a simple compaction strategy.

```
1

import { generateText, pruneMessages, type ModelMessage } from 'ai';



2



3

const COMPACTION_THRESHOLD = 100_000;



4



5

const estimateTokens = (messages: ModelMessage[]) => {



6

return JSON.stringify(messages).length / 4;



7

};



8



9

const result = await generateText({



10

// ...



11

prepareStep: ({ messages }) => {



12

if (estimateTokens(messages) > COMPACTION_THRESHOLD) {



13

return {



14

messages: pruneMessages({



15

messages,



16

reasoning: 'all',



17

toolCalls: 'before-last-3-messages',



18

emptyMessages: 'remove',



19

}),



20

};



21

}



22

},



23

});
```

This example uses an estimated token threshold, but you can use any trigger. The key behavior is that returning `messages` mutates the message state for later steps.

Returned message changes persist across steps. If you want to derive each step's messages from the original input plus the discrete response messages instead of the persisted message state, rebuild them from `initialMessages` and `responseMessages` each time:

```
1

prepareStep: ({ initialMessages, responseMessages, stepNumber }) => {



2

if (stepNumber > 0) {



3

return {



4

messages: [...initialMessages, ...responseMessages.slice(-10)],



5

};



6

}



7

},
```

#### [Provider Options for Step Configuration](#provider-options-for-step-configuration)

You can use `providerOptions` in `prepareStep` to pass provider-specific configuration for each step. This is useful for features like Anthropic's code execution container persistence:

```
1

import { forwardAnthropicContainerIdFromLastStep } from '@ai-sdk/anthropic';



2



3

// Propagate container ID from previous step for code execution continuity



4

prepareStep: forwardAnthropicContainerIdFromLastStep,
```

[Response Messages](#response-messages)
---------------------------------------

Adding the generated assistant and tool messages to your conversation history is a common task,
especially if you are using multi-step tool calls.

Both `generateText` and `streamText` have a `responseMessages` property that you can use to
add the assistant and tool messages to your conversation history.
It is also available in the `onEnd` callback of `streamText`.

The `responseMessages` property contains the accumulated response messages from the call as an array of `ModelMessage` objects that you can add to your conversation history:

```
1

import { generateText, ModelMessage } from 'ai';



2



3

const messages: ModelMessage[] = [



4

// ...



5

];



6



7

const { responseMessages } = await generateText({



8

// ...



9

messages,



10

});



11



12

// add the response messages to your conversation history:



13

messages.push(...responseMessages); // streamText: ...(await result.responseMessages)
```

[Dynamic Tools](#dynamic-tools)
-------------------------------

AI SDK Core supports dynamic tools for scenarios where tool schemas are not known at compile time. This is useful for:

* MCP (Model Context Protocol) tools without schemas
* User-defined functions at runtime
* Tools loaded from external sources

### [Using dynamicTool](#using-dynamictool)

The `dynamicTool` helper creates tools with unknown input/output types:

```
1

import { dynamicTool } from 'ai';



2

import { z } from 'zod';



3



4

const customTool = dynamicTool({



5

description: 'Execute a custom function',



6

inputSchema: z.object({}),



7

execute: async input => {



8

// input is typed as 'unknown'



9

// You need to validate/cast it at runtime



10

const { action, parameters } = input as any;



11



12

// Execute your dynamic logic



13

return { result: `Executed ${action}` };



14

},



15

});
```

### [Type-Safe Handling](#type-safe-handling)

When using both static and dynamic tools, use the `dynamic` flag for type narrowing:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: {



4

// Static tool with known types



5

weather: weatherTool,



6

// Dynamic tool



7

custom: dynamicTool({



8

/* ... */



9

}),



10

},



11

onStepEnd: ({ toolCalls, toolResults }) => {



12

// Type-safe iteration



13

for (const toolCall of toolCalls) {



14

if (toolCall.dynamic) {



15

// Dynamic tool: input is 'unknown'



16

console.log('Dynamic:', toolCall.toolName, toolCall.input);



17

continue;



18

}



19



20

// Static tool: full type inference



21

switch (toolCall.toolName) {



22

case 'weather':



23

console.log(toolCall.input.location); // typed as string



24

break;



25

}



26

}



27

},



28

});
```

[Preliminary Tool Results](#preliminary-tool-results)
-----------------------------------------------------

You can return an `AsyncIterable` over multiple results.
In this case, the last value from the iterable is the final tool result.

This can be used in combination with generator functions to e.g. stream status information
during the tool execution:

```
1

tool({



2

description: 'Get the current weather.',



3

inputSchema: z.object({



4

location: z.string(),



5

}),



6

async *execute({ location }) {



7

yield {



8

status: 'loading' as const,



9

text: `Getting weather for ${location}`,



10

weather: undefined,



11

};



12



13

await new Promise(resolve => setTimeout(resolve, 3000));



14



15

const temperature = 72 + Math.floor(Math.random() * 21) - 10;



16



17

yield {



18

status: 'success' as const,



19

text: `The weather in ${location} is ${temperature}°F`,



20

temperature,



21

};



22

},



23

});
```

[Tool Choice](#tool-choice)
---------------------------

You can use the `toolChoice` setting to influence when a tool is selected.
It supports the following settings:

* `auto` (default): the model can choose whether and which tools to call.
* `required`: the model must call a tool. It can choose which tool to call.
* `none`: the model must not call tools
* `{ type: 'tool', toolName: string (typed) }`: the model must call the specified tool

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { z } from 'zod';



2

import { generateText, tool } from 'ai';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

tools: {



7

weather: tool({



8

description: 'Get the weather in a location',



9

inputSchema: z.object({



10

location: z.string().describe('The location to get the weather for'),



11

}),



12

execute: async ({ location }) => ({



13

location,



14

temperature: 72 + Math.floor(Math.random() * 21) - 10,



15

}),



16

}),



17

},



18

toolChoice: 'required', // force the model to call a tool



19

prompt: 'What is the weather in San Francisco?',



20

});
```

[Tool Execution Options](#tool-execution-options)
-------------------------------------------------

When tools are called, they receive additional options as a second parameter.

### [Tool Call ID](#tool-call-id)

The ID of the tool call is forwarded to the tool execution.
You can use it e.g. when sending tool-call related information with stream data.

```
1

import {



2

streamText,



3

tool,



4

createUIMessageStream,



5

createUIMessageStreamResponse,



6

toUIMessageStream,



7

} from 'ai';



8



9

export async function POST(req: Request) {



10

const { messages } = await req.json();



11



12

const stream = createUIMessageStream({



13

execute: ({ writer }) => {



14

const result = streamText({



15

// ...



16

messages,



17

tools: {



18

myTool: tool({



19

// ...



20

execute: async (args, { toolCallId }) => {



21

// return e.g. custom status for tool call



22

writer.write({



23

type: 'data-tool-status',



24

id: toolCallId,



25

data: {



26

name: 'myTool',



27

status: 'in-progress',



28

},



29

});



30

// ...



31

},



32

}),



33

},



34

});



35



36

writer.merge(toUIMessageStream({ stream: result.stream }));



37

},



38

});



39



40

return createUIMessageStreamResponse({ stream });



41

}
```

### [Messages](#messages)

The messages that were sent to the language model to initiate the response that contained the tool call are forwarded to the tool execution.
You can access them in the second parameter of the `execute` function.
In multi-step calls, the messages contain the text, tool calls, and tool results from all previous steps.

```
1

import { generateText, tool } from 'ai';



2



3

const result = await generateText({



4

// ...



5

tools: {



6

myTool: tool({



7

// ...



8

execute: async (args, { messages }) => {



9

// use the message history in e.g. calls to other language models



10

return { ... };



11

},



12

}),



13

},



14

});
```

### [Abort Signals](#abort-signals)

The abort signals from `generateText` and `streamText` are forwarded to the tool execution.
You can access them in the second parameter of the `execute` function and e.g. abort long-running computations or forward them to fetch calls inside tools.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { z } from 'zod';



2

import { generateText, tool } from 'ai';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

abortSignal: myAbortSignal, // signal that will be forwarded to tools



7

tools: {



8

weather: tool({



9

description: 'Get the weather in a location',



10

inputSchema: z.object({ location: z.string() }),



11

execute: async ({ location }, { abortSignal }) => {



12

return fetch(



13

`https://api.weatherapi.com/v1/current.json?q=${location}`,



14

{ signal: abortSignal }, // forward the abort signal to fetch



15

);



16

},



17

}),



18

},



19

prompt: 'What is the weather in San Francisco?',



20

});
```

### [Experimental Sandbox](#experimental-sandbox)

Pass `experimental_sandbox` to `generateText`, `streamText`, or a `ToolLoopAgent`
call when a tool needs to run commands or code in an execution environment. The experimental sandbox is available to tool description functions and on the second parameter of the tool's `execute` function.

This API is experimental and can change in patch releases. Passing an
experimental sandbox does not sandbox the tool itself.

Tool code still runs wherever your application runs. Only the operations that your tool explicitly delegates to
the experimental sandbox, such as `experimental_sandbox.run(...)`,
run in the experimental sandbox environment.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

tools: {



7

shell: tool({



8

inputSchema: z.object({



9

command: z.string(),



10

workingDirectory: z.string().optional(),



11

}),



12

execute: async (



13

{ command, workingDirectory },



14

{ abortSignal, experimental_sandbox },



15

) => {



16

if (!experimental_sandbox) {



17

throw new Error('Experimental sandbox is not available');



18

}



19



20

return experimental_sandbox.run({



21

command,



22

workingDirectory,



23

abortSignal,



24

});



25

},



26

}),



27

},



28

experimental_sandbox,



29

prompt: 'List the files in the project.',



30

});
```

The experimental sandbox description is not added to the model prompt automatically. If the model should know about details such as the root directory, exposed ports, or public hostname, include `experimental_sandbox.description` in your system prompt,
instructions, user-visible context, or a tool description function.

`run` also accepts an optional `workingDirectory`, `env`, and `abortSignal`.
Use `workingDirectory` when a tool needs to run a command from a directory other
than the experimental sandbox implementation's default working directory. Use `env`
to set environment variables for the command. Forward
`abortSignal` from the tool execution options so the experimental sandbox can cancel the command if the overall operation is aborted or times out.

The AI SDK forwards your experimental sandbox object but does not create or isolate one for you.

The `Experimental_SandboxSession` interface is only a contract. Its isolation guarantees depend on your implementation or experimental sandbox provider. A local implementation that uses
`child_process.exec` with a working directory is not a security boundary because
commands can still access paths outside that directory. For untrusted commands
or user-directed coding agents, use a real isolation provider, restrict
available commands, set command timeouts, and combine experimental sandbox usage with [tool approval](#tool-execution-approval) for sensitive actions.

### [Runtime Context](#runtime-context)

You can pass in arbitrary runtime context from `generateText` or `streamText` via the `runtimeContext` setting.
This runtime context is available in `prepareStep`.

To avoid confusion with prompt context or retrieved context, the docs refer to this feature as runtime context.

This is useful for values like tenant information, feature flags, session data, or other server-side state that should influence step preparation without being embedded into the prompt.

Tool execution context is now separate. If a tool needs server-side values such as API keys, pass them via `toolsContext`, keyed by tool name. Each tool then receives only its own typed `context` value based on its `contextSchema`.

For the full mental model, examples, lifecycle details, and guidance on choosing
between prompt context, runtime context, and tool context, see
[Runtime and Tool Context](/docs/ai-sdk-core/runtime-and-tool-context).

### [Tool Context Telemetry](#tool-context-telemetry)

Tool context often contains server-side values such as API keys, access tokens, or internal identifiers.
Use `telemetry.includeToolsContext` to include selected top-level context properties in telemetry integrations:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const weatherTool = tool({



2

description: 'Get the weather in a location',



3

inputSchema: z.object({



4

location: z.string(),



5

}),



6

contextSchema: z.object({



7

weatherApiKey: z.string(),



8

defaultUnit: z.enum(['celsius', 'fahrenheit']),



9

}),



10

execute: async ({ location }, { context }) => {



11

return fetchWeather({



12

location,



13

apiKey: context.weatherApiKey,



14

unit: context.defaultUnit,



15

});



16

},



17

});



18



19

const result = await generateText({



20

model: "xai/grok-4.6",



21

tools: { weather: weatherTool },



22

toolsContext: {



23

weather: {



24

weatherApiKey: process.env.WEATHER_API_KEY,



25

defaultUnit: 'fahrenheit',



26

},



27

},



28

prompt: 'What is the weather in San Francisco?',



29

telemetry: {



30

includeToolsContext: {



31

weather: {



32

defaultUnit: true,



33

},



34

},



35

},



36

});
```

Telemetry integrations receive the `weather` tool context as `{ defaultUnit: 'fahrenheit' }`.
Properties set to `false` or omitted are excluded. If `telemetry.includeToolsContext` is omitted, no tool context properties are included.

`telemetry.includeToolsContext` only filters telemetry integrations. Tool
execution, lifecycle callbacks, and returned results still receive the full
typed tool context. See [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context) for how tool context
flows through execution and telemetry.

[Tool Input Lifecycle Hooks](#tool-input-lifecycle-hooks)
---------------------------------------------------------

The following tool input lifecycle hooks are available:

* **`onInputStart`**: Called when the model starts generating the input (arguments) for the tool call
* **`onInputDelta`**: Called for each chunk of text as the input is streamed
* **`onInputAvailable`**: Called when the complete input is available and validated

`onInputStart` is always called before `onInputAvailable`, including when using `generateText`. `onInputDelta` is only called in streaming contexts (when using `streamText`).

### [Example](#example-1)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const result = streamText({



5

model: "xai/grok-4.6",



6

tools: {



7

getWeather: tool({



8

description: 'Get the weather in a location',



9

inputSchema: z.object({



10

location: z.string().describe('The location to get the weather for'),



11

}),



12

execute: async ({ location }) => ({



13

temperature: 72 + Math.floor(Math.random() * 21) - 10,



14

}),



15

onInputStart: () => {



16

console.log('Tool call starting');



17

},



18

onInputDelta: ({ inputTextDelta }) => {



19

console.log('Received input chunk:', inputTextDelta);



20

},



21

onInputAvailable: ({ input }) => {



22

console.log('Complete input:', input);



23

},



24

}),



25

},



26

prompt: 'What is the weather in San Francisco?',



27

});
```

[Types](#types)
---------------

Modularizing your code often requires defining types to ensure type safety and reusability.
To enable this, the AI SDK provides several helper types for tools, tool calls, and tool results.

You can use them to strongly type your variables, function parameters, and return types
in parts of the code that are not directly related to `streamText` or `generateText`.

Each tool call is typed with `ToolCall<NAME extends string, ARGS>`, depending
on the tool that has been invoked.
Similarly, the tool results are typed with `ToolResult<NAME extends string, ARGS, RESULT>`.

The tools in `streamText` and `generateText` are defined as a `ToolSet`.
The type inference helpers `TypedToolCall<TOOLS extends ToolSet>`
and `TypedToolResult<TOOLS extends ToolSet>` can be used to
extract the tool call and tool result types from the tools.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { TypedToolCall, TypedToolResult, generateText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const myToolSet = {



5

firstTool: tool({



6

description: 'Greets the user',



7

inputSchema: z.object({ name: z.string() }),



8

execute: async ({ name }) => `Hello, ${name}!`,



9

}),



10

secondTool: tool({



11

description: 'Tells the user their age',



12

inputSchema: z.object({ age: z.number() }),



13

execute: async ({ age }) => `You are ${age} years old!`,



14

}),



15

};



16



17

type MyToolCall = TypedToolCall<typeof myToolSet>;



18

type MyToolResult = TypedToolResult<typeof myToolSet>;



19



20

async function generateSomething(prompt: string): Promise<{



21

text: string;



22

toolCalls: Array<MyToolCall>; // typed tool calls



23

toolResults: Array<MyToolResult>; // typed tool results



24

}> {



25

return generateText({



26

model: "xai/grok-4.6",



27

tools: myToolSet,



28

prompt,



29

});



30

}
```

[Handling Errors](#handling-errors)
-----------------------------------

The AI SDK has four tool-call related errors:

* [`NoSuchToolError`](/docs/reference/ai-sdk-errors/ai-no-such-tool-error): the model tries to call a tool that is not defined in the tools object
* [`InvalidToolInputError`](/docs/reference/ai-sdk-errors/ai-invalid-tool-input-error): the model calls a tool with inputs that do not match the tool's input schema
* [`ToolCallRepairError`](/docs/reference/ai-sdk-errors/ai-tool-call-repair-error): an error that occurred during tool call repair
* [`ToolChoiceViolationError`](/docs/reference/ai-sdk-errors/ai-tool-choice-violation-error): the `generateText` response does not satisfy a required or specifically selected tool choice

When tool execution fails (errors thrown by your tool's `execute` function), the AI SDK adds them as `tool-error` content parts to enable automated LLM roundtrips in multi-step scenarios.

### [`generateText`](#generatetext)

`generateText` throws errors for tool schema validation issues and other errors, and can be handled using a `try`/`catch` block. Tool execution errors appear as `tool-error` parts in the result steps:

```
1

try {



2

const result = await generateText({



3

//...



4

});



5

} catch (error) {



6

if (NoSuchToolError.isInstance(error)) {



7

// handle the no such tool error



8

} else if (InvalidToolInputError.isInstance(error)) {



9

// handle the invalid tool inputs error



10

} else {



11

// handle other errors



12

}



13

}
```

Tool execution errors are available in the result steps:

```
1

const { steps } = await generateText({



2

// ...



3

});



4



5

// check for tool errors in the steps



6

const toolErrors = steps.flatMap(step =>



7

step.content.filter(part => part.type === 'tool-error'),



8

);



9



10

toolErrors.forEach(toolError => {



11

console.log('Tool error:', toolError.error);



12

console.log('Tool name:', toolError.toolName);



13

console.log('Tool input:', toolError.input);



14

});
```

### [`streamText`](#streamtext)

`streamText` sends errors as part of the `stream` result. Tool execution errors appear as `tool-error` parts, while other errors appear as `error` parts.

When using `toUIMessageStream`, you can pass an `onError` function to extract the error message from the error part and forward it as part of the stream response:

```
1

const result = streamText({



2

// ...



3

});



4



5

return createUIMessageStreamResponse({



6

stream: toUIMessageStream({



7

stream: result.stream,



8

onError: error => {



9

if (NoSuchToolError.isInstance(error)) {



10

return 'The model tried to call a unknown tool.';



11

} else if (InvalidToolInputError.isInstance(error)) {



12

return 'The model called a tool with invalid inputs.';



13

} else {



14

return 'An unknown error occurred.';



15

}



16

},



17

}),



18

});
```

[Tool Call Repair](#tool-call-repair)
-------------------------------------

Language models sometimes fail to generate valid tool calls,
especially when the input schema is complex or the model is smaller.

If you use multiple steps, those failed tool calls will be sent back to the LLM
in the next step to give it an opportunity to fix it.
However, you may want to control how invalid tool calls are repaired without requiring
additional steps that pollute the message history.

You can use the `repairToolCall` function to attempt to repair the tool call
with a custom function.

You can use different strategies to repair the tool call:

* Use a model with structured outputs to generate the inputs.
* Send the messages, instructions, and tool schema to a stronger model to generate the inputs.
* Provide more specific repair instructions based on which tool was called.

### [Example: Use a model with structured outputs for repair](#example-use-a-model-with-structured-outputs-for-repair)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateText, NoSuchToolError, Output, tool } from 'ai';



3



4

const result = await generateText({



5

model,



6

tools,



7

prompt,



8



9

repairToolCall: async ({ toolCall, tools, inputSchema, error }) => {



10

if (NoSuchToolError.isInstance(error)) {



11

return null; // do not attempt to fix invalid tool names



12

}



13



14

const tool = tools[toolCall.toolName as keyof typeof tools];



15



16

const { output: repairedArgs } = await generateText({



17

model: "xai/grok-4.6",



18

output: Output.object({ schema: tool.inputSchema }),



19

prompt: [



20

`The model tried to call the tool "${toolCall.toolName}"` +



21

` with the following inputs:`,



22

JSON.stringify(toolCall.input),



23

`The tool accepts the following schema:`,



24

JSON.stringify(await inputSchema({ toolName: toolCall.toolName })),



25

'Please fix the inputs.',



26

].join('\n'),



27

});



28



29

return { ...toolCall, input: JSON.stringify(repairedArgs) };



30

},



31

});
```

### [Example: Use the re-ask strategy for repair](#example-use-the-re-ask-strategy-for-repair)

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateText, NoSuchToolError, tool } from 'ai';



3



4

const result = await generateText({



5

model,



6

tools,



7

prompt,



8



9

repairToolCall: async ({



10

toolCall,



11

tools,



12

error,



13

messages,



14

instructions,



15

}) => {



16

const result = await generateText({



17

model,



18

instructions,



19

messages: [



20

...messages,



21

{



22

role: 'assistant',



23

content: [



24

{



25

type: 'tool-call',



26

toolCallId: toolCall.toolCallId,



27

toolName: toolCall.toolName,



28

input: toolCall.input,



29

},



30

],



31

},



32

{



33

role: 'tool' as const,



34

content: [



35

{



36

type: 'tool-result',



37

toolCallId: toolCall.toolCallId,



38

toolName: toolCall.toolName,



39

output: error.message,



40

},



41

],



42

},



43

],



44

tools,



45

});



46



47

const newToolCall = result.toolCalls.find(



48

newToolCall => newToolCall.toolName === toolCall.toolName,



49

);



50



51

return newToolCall != null



52

? {



53

type: 'tool-call' as const,



54

toolCallId: toolCall.toolCallId,



55

toolName: toolCall.toolName,



56

input: JSON.stringify(newToolCall.input),



57

}



58

: null;



59

},



60

});
```

[Active Tools](#active-tools)
-----------------------------

Language models can only handle a limited number of tools at a time, depending on the model.
To allow for static typing using a large number of tools and limiting the available tools to the model at the same time,
the AI SDK provides the `activeTools` property.

It is an array of tool names that are currently active.
By default, the value is `undefined` and all tools are active.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateText } from 'ai';



3



4

const { text } = await generateText({



5

model: "xai/grok-4.6",



6

tools: myToolSet,



7

activeTools: ['firstTool'],



8

});
```

[Tool Order](#tool-order)
-------------------------

Some providers include tool definitions in the cached portion of a request.
If the order of those definitions changes between otherwise similar requests,
the provider may not be able to reuse the cached prefix as effectively.

Use `toolOrder` when you want a stable provider request shape for caching or
debugging. The list can be partial: tools listed in `toolOrder` are sent first
in that order, and any remaining tools are sent afterwards in alphabetical
order. Tool names are typed from your `tools` object.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const { text } = await generateText({



4

model: "xai/grok-4.6",



5

tools: myToolSet,



6

toolOrder: ['search', 'readFile'],



7

prompt: 'Summarize the latest project notes.',



8

});
```

`toolOrder` controls only the order of tool definitions sent to the provider.
It does not force the model to call a tool. Use [`toolChoice`](#tool-choice) to
control tool selection, and use [`activeTools`](#active-tools) when you want to
limit which tools are available. When both `activeTools` and `toolOrder` are
provided, `activeTools` filters the available tools first and `toolOrder`
orders the remaining tools.

[Multi-modal Tool Results](#multi-modal-tool-results)
-----------------------------------------------------

Multi-modal tool results are experimental and supported by Anthropic, OpenAI,
and Google (Gemini 3 models).

For Google, use base64 inline-data file parts
(`{ type: 'file', mediaType, data: { type: 'data', data } }`) or base64
`data:` URLs in URL-style file parts
(`{ type: 'file', mediaType, data: { type: 'url', url: new URL('data:...') } }`).
Remote HTTP(S) URLs in tool-result URL parts are not supported.

In order to send multi-modal tool results, e.g. screenshots, back to the model,
they need to be converted into a specific format.

AI SDK Core tools have an optional `toModelOutput` function
that converts the tool result into a content part.

Here is an example for converting a screenshot into a content part:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: {



4

computer: anthropic.tools.computer_20241022({



5

// ...



6

async execute({ action, coordinate, text }) {



7

switch (action) {



8

case 'screenshot': {



9

return {



10

type: 'file',



11

mediaType: 'image',



12

data: fs



13

.readFileSync('./data/screenshot-editor.png')



14

.toString('base64'),



15

};



16

}



17

default: {



18

return `executed ${action}`;



19

}



20

}



21

},



22



23

// map to tool result content for LLM consumption:



24

toModelOutput({ output }) {



25

return {



26

type: 'content',



27

value:



28

typeof output === 'string'



29

? [{ type: 'text', text: output }]



30

: [



31

{



32

type: 'file',



33

mediaType: 'image/png',



34

data: { type: 'data', data: output.data },



35

},



36

],



37

};



38

},



39

}),



40

},



41

// ...



42

});
```

[Extracting Tools](#extracting-tools)
-------------------------------------

Once you start having many tools, you might want to extract them into separate files.
The `tool` helper function is crucial for this, because it ensures correct type inference.

Here is an example of an extracted tool:

tools/weather-tool.ts

```
1

import { tool } from 'ai';



2

import { z } from 'zod';



3



4

// the `tool` helper function ensures correct type inference:



5

export const weatherTool = tool({



6

description: 'Get the weather in a location',



7

inputSchema: z.object({



8

location: z.string().describe('The location to get the weather for'),



9

}),



10

execute: async ({ location }) => ({



11

location,



12

temperature: 72 + Math.floor(Math.random() * 21) - 10,



13

}),



14

});
```

[MCP Tools](#mcp-tools)
-----------------------

The AI SDK supports connecting to Model Context Protocol (MCP) servers to access their tools.
MCP enables your AI applications to discover and use tools across various services through a standardized interface.

For detailed information about MCP tools, including initialization, transport options, and usage patterns, see the [MCP Tools documentation](/docs/ai-sdk-core/mcp-tools).

### [AI SDK Tools vs MCP Tools](#ai-sdk-tools-vs-mcp-tools)

In most cases, you should define your own AI SDK tools for production applications. They provide full control, type safety, and optimal performance. MCP tools are best suited for rapid development iteration and scenarios where users bring their own tools.

| Aspect | AI SDK Tools | MCP Tools |
| --- | --- | --- |
| **Type Safety** | Full static typing end-to-end | Dynamic discovery at runtime |
| **Execution** | Same process as your request (low latency) | Separate server (network overhead) |
| **Prompt Control** | Full control over descriptions and schemas | Controlled by MCP server owner |
| **Schema Control** | You define and optimize for your model | Controlled by MCP server owner |
| **Version Management** | Full visibility over updates | Can update independently (version skew risk) |
| **Authentication** | Same process, no additional auth required | Separate server introduces additional auth complexity |
| **Best For** | Production applications requiring control and performance | Development iteration, user-provided tools |

[Examples](#examples)
---------------------

You can see tools in action using various frameworks in the following examples:

[Learn to use tools in Node.js](/cookbook/node/call-tools)[Learn to use tools in Next.js with Route Handlers](/cookbook/next/call-tools)[Learn to use MCP tools in Node.js](/cookbook/node/mcp-tools)

[Previous

Generating Structured Data](/docs/ai-sdk-core/generating-structured-data)[Next

Model Context Protocol (MCP)](/docs/ai-sdk-core/mcp-tools)
