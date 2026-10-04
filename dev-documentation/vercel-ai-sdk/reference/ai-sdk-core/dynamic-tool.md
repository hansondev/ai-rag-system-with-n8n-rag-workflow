---
title: "dynamicTool()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/dynamic-tool
section: reference
crawled: 2026-09-20
---

# dynamicTool()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/dynamic-tool

[AI SDK Core](/docs/ai-sdk-core)dynamicTool


[`dynamicTool()`](#dynamictool)
===============================

The `dynamicTool` function creates tools where the input and output types are not known at compile time. This is useful for scenarios such as:

* MCP (Model Context Protocol) tools without schemas
* User-defined functions loaded at runtime
* Tools loaded from external sources or databases
* Dynamic tool generation based on user input

Unlike the regular `tool` function, `dynamicTool` accepts and returns `unknown` types, allowing you to work with tools that have runtime-determined schemas.

```
1

import { dynamicTool } from 'ai';



2

import { z } from 'zod';



3



4

export const customTool = dynamicTool({



5

description: 'Execute a custom user-defined function',



6

inputSchema: z.object({}),



7

// input is typed as 'unknown'



8

execute: async input => {



9

const { action, parameters } = input as any;



10



11

// Execute your dynamic logic



12

return {



13

result: `Executed ${action} with ${JSON.stringify(parameters)}`,



14

};



15

},



16

});
```

[Import](#import)
-----------------

```
import { dynamicTool } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### tool:

Object

Object

### description?:

string | ((options: { context: Context; experimental\_sandbox?: Experimental\_SandboxSession }) => string)

### deferLoading?:

boolean

### title?:

string

### needsApproval?:

boolean | ((input: unknown, options: { toolCallId: string; messages: ModelMessage[]; context: Context }) => boolean | Promise<boolean>)

### inputSchema:

FlexibleSchema<unknown>

### execute:

ToolExecuteFunction<unknown, unknown, Context>

ToolExecutionOptions<Context>

### toolCallId:

string

### messages:

ModelMessage[]

### abortSignal?:

AbortSignal

### context:

Context

### outputSchema?:

Zod Schema | JSON Schema

### toModelOutput?:

({toolCallId: string; input: unknown; output: unknown}) => ToolResultOutput | PromiseLike<ToolResultOutput>

### onInputStart?:

(options: ToolExecutionOptions<Context>) => void | PromiseLike<void>

### onInputDelta?:

(options: { inputTextDelta: string } & ToolExecutionOptions<Context>) => void | PromiseLike<void>

### onInputAvailable?:

(options: { input: unknown } & ToolExecutionOptions<Context>) => void | PromiseLike<void>

### providerOptions?:

ProviderOptions

### metadata?:

JSONObject

### [Returns](#returns)

A `Tool<unknown, unknown>` with `type: 'dynamic'` that can be used with `generateText`, `streamText`, and other AI SDK functions.

[Type-Safe Usage](#type-safe-usage)
-----------------------------------

When using dynamic tools alongside static tools, you need to check the `dynamic` flag for proper type narrowing:

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

// Dynamic tool with unknown types



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

for (const toolCall of toolCalls) {



13

if (toolCall.dynamic) {



14

// Dynamic tool: input/output are 'unknown'



15

console.log('Dynamic tool:', toolCall.toolName);



16

console.log('Input:', toolCall.input);



17

continue;



18

}



19



20

// Static tools have full type inference



21

switch (toolCall.toolName) {



22

case 'weather':



23

// TypeScript knows the exact types



24

console.log(toolCall.input.location); // string



25

break;



26

}



27

}



28

},



29

});
```

[Usage with `useChat`](#usage-with-usechat)
-------------------------------------------

When used with useChat (`UIMessage` format), dynamic tools appear as `dynamic-tool` parts:

```
1

{



2

message.parts.map(part => {



3

switch (part.type) {



4

case 'dynamic-tool':



5

return (



6

<div>



7

<h4>Tool: {part.toolName}</h4>



8

<pre>{JSON.stringify(part.input, null, 2)}</pre>



9

</div>



10

);



11

// ... handle other part types



12

}



13

});



14

}
```

[Previous

experimental\_getBatchStatus](/docs/reference/ai-sdk-core/get-batch-status)[Next

experimental\_getBatchResults](/docs/reference/ai-sdk-core/get-batch-results)
