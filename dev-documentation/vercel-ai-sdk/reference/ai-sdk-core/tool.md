---
title: "tool()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/tool
section: reference
crawled: 2026-09-20
---

# tool()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/tool

[AI SDK Core](/docs/ai-sdk-core)tool


[`tool()`](#tool)
=================

Tool is a helper function that infers the tool input and context for its `execute` method and lifecycle callbacks.

It does not have any runtime behavior, but it helps TypeScript infer the types for the tool callbacks.

Without this helper function, TypeScript is unable to connect the `inputSchema` and `contextSchema` properties to the tool callbacks,
and the callback argument types cannot be inferred.

For the full model of `runtimeContext`, `toolsContext`, tool `context`, and
sensitive context filtering, see [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context).

The `Tool` type is a union of four tool kinds:

* `FunctionTool`: a user-defined function-style tool with known input and output types.
* `DynamicTool`: a function-style tool defined at runtime, with `unknown` input and output types.
* `ProviderDefinedTool`: a provider-defined tool that your code executes.
* `ProviderExecutedTool`: a provider-defined tool that the provider executes.

```
1

import { tool } from 'ai';



2

import { z } from 'zod';



3



4

export const weatherTool = tool({



5

description: 'Get the weather in a location',



6

inputSchema: z.object({



7

location: z.string().describe('The location to get the weather for'),



8

}),



9

// location below is inferred to be a string:



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

[Import](#import)
-----------------

```
import { tool } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### tool:

Tool

Tool

### description?:

string | ((options: { context: CONTEXT; experimental\_sandbox?: Experimental\_SandboxSession }) => string)

### deferLoading?:

boolean

### title?:

string

### needsApproval?:

boolean | ((input: INPUT, options: { toolCallId: string; messages: ModelMessage[]; context: CONTEXT }) => boolean | Promise<boolean>)

### inputSchema:

Zod Schema | JSON Schema

### inputExamples?:

Array<{ input: INPUT }>

### contextSchema?:

Zod Schema | JSON Schema

### strict?:

boolean

### execute?:

async (input: INPUT, options: ToolExecutionOptions<CONTEXT>) => RESULT | Promise<RESULT> | AsyncIterable<RESULT>

ToolExecutionOptions<CONTEXT>

### toolCallId:

string

### messages:

ModelMessage[]

### abortSignal?:

AbortSignal

### context:

CONTEXT

### experimental\_sandbox?:

Experimental\_SandboxSession

### outputSchema?:

Zod Schema | JSON Schema

### toModelOutput?:

({toolCallId: string; input: INPUT; output: OUTPUT}) => ToolResultOutput | PromiseLike<ToolResultOutput>

### onInputStart?:

(options: ToolExecutionOptions<CONTEXT>) => void | PromiseLike<void>

### onInputDelta?:

(options: { inputTextDelta: string } & ToolExecutionOptions<CONTEXT>) => void | PromiseLike<void>

### onInputAvailable?:

(options: { input: INPUT } & ToolExecutionOptions<CONTEXT>) => void | PromiseLike<void>

### providerOptions?:

ProviderOptions

### metadata?:

JSONObject

### type?:

'function' | 'dynamic' | 'provider'

### id?:

`${string}.${string}`

### isProviderExecuted?:

boolean

### args?:

Record<string, unknown>

### supportsDeferredResults?:

boolean

### [Returns](#returns)

The tool that was passed in.

[Previous

experimental\_startBatch](/docs/reference/ai-sdk-core/start-batch)[Next

experimental\_getBatchStatus](/docs/reference/ai-sdk-core/get-batch-status)
