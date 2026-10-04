---
title: "Code Mode"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/code-mode
section: ai-sdk-core
crawled: 2026-09-20
---

# Code Mode

> Source: https://ai-sdk.dev/docs/ai-sdk-core/code-mode

[AI SDK Core](/docs/ai-sdk-core)Code Mode


[Code Mode](#code-mode)
=======================

Code mode lets a model write JavaScript or TypeScript that calls your AI SDK
tools. The generated code runs in an isolated QuickJS sandbox and returns a JSON-serializable result.

Instead of calling tools one at a time, a model can use code mode to:

* call independent tools concurrently
* transform and combine tool results
* filter large tool responses before returning them to the model
* use JavaScript control flow for multi-step operations

Code mode is provided by the `@ai-sdk/code-mode` package.

Code mode is experimental and its APIs may change in future releases. It
requires Node.js 22 or newer and is not available in browser or edge runtimes.

[Installation](#installation)
-----------------------------

```
1

pnpm add ai @ai-sdk/code-mode zod
```

[Using Code Mode with `generateText`](#using-code-mode-with-generatetext)
-------------------------------------------------------------------------

Define your tools in one tool set and use `experimental_toolCallers` to select
which tools code mode can call:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import {



2

DIRECT_TOOL_CALL,



3

experimental_codeModeTool as codeModeTool,



4

} from '@ai-sdk/code-mode';



5

import { generateText, isStepCount, tool } from 'ai';



6

import { z } from 'zod';



7



8

const getInventory = tool({



9

description: 'Get available inventory for a product.',



10

inputSchema: z.object({



11

productId: z.string(),



12

}),



13

outputSchema: z.object({



14

productId: z.string(),



15

availableUnits: z.number(),



16

}),



17

execute: async ({ productId }) => ({



18

productId,



19

availableUnits: 42,



20

}),



21

});



22



23

const getDemand = tool({



24

description: 'Get requested units for a product.',



25

inputSchema: z.object({



26

productId: z.string(),



27

}),



28

outputSchema: z.object({



29

productId: z.string(),



30

requestedUnits: z.number(),



31

}),



32

execute: async ({ productId }) => ({



33

productId,



34

requestedUnits: 31,



35

}),



36

});



37



38

const tools = {



39

code_mode: codeModeTool({



40

executionPolicy: {



41

timeoutMs: 30_000,



42

},



43

}),



44

getInventory,



45

getDemand,



46

} as const;



47



48

const result = await generateText({



49

model: "xai/grok-4.6",



50

tools,



51

experimental_toolCallers: {



52

getInventory: ['code_mode'],



53

getDemand: ['code_mode'],



54

},



55

stopWhen: isStepCount(10),



56

prompt: 'Compare inventory and demand for product sku_123.',



57

});
```

The keys in `experimental_toolCallers` are the tools being governed.
The values identify their allowed callers. In this example, `getInventory` and
`getDemand` are available through `code_mode`, but they are not exposed to the
model as directly callable tools. Include `DIRECT_TOOL_CALL` when a tool should
also be callable directly:

```
1

experimental_toolCallers: {



2

getInventory: ['code_mode', DIRECT_TOOL_CALL],



3

};
```

Tools without an `experimental_toolCallers` entry keep their existing direct
tool-calling behavior.

The code mode tool description includes TypeScript signatures generated from
the input and output schemas of its allowed tools. Descriptions,
`inputExamples`, and precise schemas help the model write correct code.

### [Discovering Tools Through Conversation](#discovering-tools-through-conversation)

By default, changing the tools routed through code mode also changes the
provider-visible `code_mode` tool description. Set `toolDiscovery` to
`'conversation'` to keep that tool definition stable and provide the current
host-tool catalog in a user message instead:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const codeMode = codeModeTool({



2

toolDiscovery: 'conversation',



3

});



4



5

const tools = {



6

code_mode: codeMode,



7

getInventory,



8

getDemand,



9

} as const;



10



11

const result = await generateText({



12

model: "xai/grok-4.6",



13

tools,



14

experimental_toolCallers: {



15

getInventory: ['code_mode'],



16

getDemand: ['code_mode'],



17

},



18

prompt: 'Compare inventory and demand for product sku_123.',



19

});
```

The AI SDK adds a complete code mode capability catalog to the conversation
before calling the model. The catalog contains TypeScript signatures and call
examples for the tools routed through code mode. When the effective tools or
their definitions change in a later step or generation call, the SDK adds a
new catalog that replaces earlier catalogs.

This mode can improve prompt-cache reuse because the provider-visible tool
definition stays unchanged. Actual cache behavior depends on the model
provider.

For the example above, the model can generate a program like:

```
1

const [inventory, demand] = await Promise.all([



2

tools.getInventory({ productId: 'sku_123' }),



3

tools.getDemand({ productId: 'sku_123' }),



4

]);



5



6

return {



7

sufficient: inventory.availableUnits >= demand.requestedUnits,



8

remaining: inventory.availableUnits - demand.requestedUnits,



9

};
```

Each provided tool is available through the global `tools` object. Tool names
that are not valid JavaScript identifiers use bracket notation:

```
1

const user = await tools['lookup-user']({ userId: 'user_123' });



2

return { id: user.id, plan: user.plan };
```

### [Searching Deferred Tools](#searching-deferred-tools)

Use `toolSearch()` with `deferLoading: true` to expose tools only when the model
needs them. With `toolDiscovery: 'conversation'`, discovered definitions arrive
in user messages, preserving the tool-definition cache by keeping the
provider-visible code mode tool unchanged. Actual prompt-cache reuse depends on
the provider.

See [Tool Search](/docs/ai-sdk-core/tool-search) for direct-calling and code mode
examples.

[Writing Code Mode Programs](#writing-code-mode-programs)
---------------------------------------------------------

Generated programs support:

* JavaScript and type-stripped TypeScript
* top-level `await` and `return`
* standard JavaScript control flow and data transformations
* `Promise.all` for concurrent tool calls
* `JSON.parse` and `JSON.stringify`
* `console.log`, `console.info`, `console.debug`, and `console.error`

Every tool call is asynchronous and must be awaited or otherwise observed.
Returning while tool calls are still detached fails the invocation and aborts
the outstanding work.

Programs and tool inputs and outputs cross the sandbox boundary as JSON. Return
only JSON-serializable values. TypeScript support is limited to removing type
syntax; code mode does not perform type checking or provide a full TypeScript
compiler.

[Direct Execution](#direct-execution)
-------------------------------------

Use `experimental_runCodeMode` when you want to execute a program directly
instead of exposing code mode to a model:

```
1

import { experimental_runCodeMode as runCodeMode } from '@ai-sdk/code-mode';



2



3

const result = await runCodeMode({



4

js: `



5

const inventory = await tools.getInventory({



6

productId: 'sku_123',



7

});



8



9

return {



10

productId: inventory.productId,



11

available: inventory.availableUnits > 0,



12

};



13

`,



14

tools: { getInventory },



15

});
```

`runCodeMode` returns the value returned by the program. It uses the same
sandbox and execution limits as the AI SDK tool.

[Tool Approval](#tool-approval)
-------------------------------

Code mode does not currently integrate with AI SDK tool approval flows. Tool
calls made by generated code are nested inside the code mode invocation, so
they cannot pause the generation and surface a tool approval request to your
application.

Do not expose tools that rely on user approval to code mode. Keep those tools
directly callable by the model instead. If a nested tool requires approval,
the call is rejected rather than executed.

[Execution Limits](#execution-limits)
-------------------------------------

Every invocation has limits for runtime, memory, source size, results, tool
payloads, console output, and tool calls. Override them with
`executionPolicy`:

```
1

const codeMode = codeModeTool({



2

executionPolicy: {



3

timeoutMs: 30_000,



4

memoryLimitBytes: 64 * 1024 * 1024,



5

maxResultBytes: 1024 * 1024,



6

maxBridgeRequests: 100,



7

maxInFlightBridgeRequests: 10,



8

},



9

});
```

The available limits are:

* `timeoutMs`: total execution time
* `memoryLimitBytes`: QuickJS memory
* `maxStackSizeBytes`: QuickJS stack
* `maxSourceBytes`: generated source code
* `maxResultBytes`: returned result
* `maxConsoleOutputBytes`: combined console output
* `maxToolInputBytes`: input for each tool call
* `maxToolOutputBytes`: output from each tool call
* `maxBridgeRequests`: total tool calls
* `maxInFlightBridgeRequests`: concurrent tool calls

Use `experimental_setMaxWorkers` to set a process-wide cap on concurrent code
mode workers:

```
1

import { experimental_setMaxWorkers as setMaxWorkers } from '@ai-sdk/code-mode';



2



3

setMaxWorkers(4);
```

Without an explicit cap, code mode chooses one based on available memory, up to
32 workers.

[Isolation and Tool Access](#isolation-and-tool-access)
-------------------------------------------------------

Each invocation receives a fresh QuickJS context. Sandboxed code cannot access:

* Node.js globals such as `process`, `require`, or `module`
* the host file system or module loader
* `fetch`, WebCrypto, or performance APIs
* `eval` or dynamic `Function` construction

Network or system access must be implemented in a tool and explicitly provided
to code mode.

Treat the sandbox as defense in depth. Generated code and tool arguments are
untrusted. Tools execute in your host application, outside the QuickJS
sandbox, and every capability exposed by a provided tool is available to the
generated program. Enforce authorization and validate inputs inside each tool.

Tool input schemas are validated before their `execute` functions run. Abort
signals and AI SDK tool execution context are forwarded to nested tool calls.

[Previous

Runtime and Tool Context](/docs/ai-sdk-core/runtime-and-tool-context)[Next

Tool Search](/docs/ai-sdk-core/tool-search)
