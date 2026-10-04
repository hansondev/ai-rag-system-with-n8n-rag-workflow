---
title: "Runtime and Tool Context"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/runtime-and-tool-context
section: ai-sdk-core
crawled: 2026-09-20
---

# Runtime and Tool Context

> Source: https://ai-sdk.dev/docs/ai-sdk-core/runtime-and-tool-context

[AI SDK Core](/docs/ai-sdk-core)Runtime and Tool Context


[Runtime and Tool Context](#runtime-and-tool-context)
=====================================================

Context lets you pass server-side state through a generation or agent loop
without putting that state into the prompt. The AI SDK separates shared runtime
state from per-tool execution state so agents can keep track of their work while
tools only receive the values they need.

Use context for values such as tenant information, feature flags, session data,
request IDs, API credentials, access tokens, or other application state that
should affect execution.

[Context Types](#context-types)
-------------------------------

| Concept | Where you define it | Where you read it | Use it for |
| --- | --- | --- | --- |
| `runtimeContext` | `generateText`, `streamText`, or `ToolLoopAgent` calls | `prepareStep`, lifecycle callbacks, step results, and telemetry | Shared generation or agent state |
| `toolsContext` | `generateText`, `streamText`, or `ToolLoopAgent` calls | `prepareStep`, approval callbacks, tool context resolution, and tool description functions | A map of per-tool context values keyed by tool name |
| tool `context` | Each tool's `toolsContext` entry, validated by its `contextSchema` | Tool description functions, tool `execute`, `needsApproval`, and tool input lifecycle callbacks | Values needed by one tool |
| `toolContext` | Derived from one tool's context | Tool approval callbacks and tool execution events | The event/callback name for one tool's context |
| `telemetry.includeRuntimeContext` | The generation or agent call | Telemetry filtering | Top-level `runtimeContext` properties to include in telemetry |
| `telemetry.includeToolsContext` | The generation or agent call | Telemetry filtering | Top-level tool context properties to include in telemetry |

In agents, `runtimeContext` is the agent's shared runtime state. It flows
through the loop and can be read or updated in `prepareStep` between model
calls. Tool-specific data stays in `toolsContext`, where each tool receives only
its own validated `context`.

```
1

generateText / streamText / ToolLoopAgent



2

-> runtimeContext



3

-> prepareStep, lifecycle callbacks, step results



4

-> telemetry, filtered by telemetry.includeRuntimeContext



5

-> toolsContext



6

-> prepareStep



7

-> one tool's context / toolContext



8

-> execute, approval callbacks, tool events



9

-> telemetry, filtered by telemetry.includeToolsContext
```

[Runtime Context](#runtime-context)
-----------------------------------

Pass `runtimeContext` when you need shared state for the whole generation or
agent loop. It is not added to the model prompt automatically. Use it to
configure step preparation, track server-side state, or correlate lifecycle
events.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Help the user plan their trip.',



4

runtimeContext: {



5

tenantId: 'tenant_123',



6

plan: 'enterprise',



7

requestId: 'req_abc',



8

},



9

prepareStep: async ({ runtimeContext }) => {



10

if (runtimeContext.plan === 'enterprise') {



11

return { temperature: 0.2 };



12

}



13



14

return {};



15

},



16

});
```

`prepareStep` can return a new `runtimeContext`. The new value affects the
current step and all subsequent steps, which makes it the right place to update
agent state between turns of the loop.

[Tool Context](#tool-context)
-----------------------------

Use `toolsContext` for values that belong to a specific tool. Each tool declares
the context it expects with `contextSchema`; the matching `toolsContext` entry is
validated and passed to the tool as `context`.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const weatherTool = tool({



5

description: 'Get the weather in a location',



6

inputSchema: z.object({



7

location: z.string(),



8

}),



9

contextSchema: z.object({



10

weatherApiKey: z.string(),



11

defaultUnit: z.enum(['celsius', 'fahrenheit']),



12

}),



13

execute: async ({ location }, { context }) => {



14

return fetchWeather({



15

location,



16

apiKey: context.weatherApiKey,



17

unit: context.defaultUnit,



18

});



19

},



20

});



21



22

const result = await generateText({



23

model: "xai/grok-4.6",



24

tools: { weather: weatherTool },



25

toolsContext: {



26

weather: {



27

weatherApiKey: process.env.WEATHER_API_KEY!,



28

defaultUnit: 'fahrenheit',



29

},



30

},



31

prompt: 'What is the weather in San Francisco?',



32

});
```

When at least one tool declares `contextSchema`, `toolsContext` is required for
the tools that need context. A tool receives only its own context, not the full
`toolsContext` map. Tool description functions receive the same typed `context`
before each model call, so descriptions can change with the current tool
context.

Treat tool context as immutable inside tools. If you need to change tool context
between steps, inspect the previous step in `prepareStep` and return an updated
`toolsContext`.

[Telemetry Context Filtering](#telemetry-context-filtering)
-----------------------------------------------------------

Context often contains values that are useful inside your application but should
not be sent to telemetry providers. Use `telemetry.includeRuntimeContext` to
include selected top-level runtime context properties in telemetry, and
`telemetry.includeToolsContext` to include selected top-level tool context
properties per tool.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const customerLookup = tool({



5

description: 'Look up customer account details',



6

inputSchema: z.object({



7

customerId: z.string(),



8

}),



9

contextSchema: z.object({



10

apiKey: z.string(),



11

region: z.string(),



12

}),



13

execute: async ({ customerId }, { context }) => {



14

return lookupCustomer({



15

customerId,



16

apiKey: context.apiKey,



17

region: context.region,



18

});



19

},



20

});



21



22

const agent = new ToolLoopAgent({



23

model: "xai/grok-4.6",



24

tools: { customerLookup },



25

});



26



27

const result = await agent.generate({



28

prompt: 'Check whether customer cust_123 is eligible for priority support.',



29

runtimeContext: {



30

requestId: 'req_abc',



31

tenantId: 'tenant_123',



32

userId: 'user_123',



33

},



34

telemetry: {



35

includeRuntimeContext: {



36

requestId: true,



37

},



38

includeToolsContext: {



39

customerLookup: {



40

region: true,



41

},



42

},



43

},



44

toolsContext: {



45

customerLookup: {



46

apiKey: process.env.CUSTOMER_API_KEY!,



47

region: 'us',



48

},



49

},



50

});
```

In this example, telemetry receives `runtimeContext` with only `requestId` and the
`customerLookup` context with only `region`.

Context filters only affect telemetry integrations, including OpenTelemetry
integrations. Tool execution, lifecycle callbacks, and returned results still
receive the full context values.

Context telemetry filtering is shallow. For `telemetry.includeRuntimeContext`, only
top-level properties marked as `true` are sent when it is configured; if it is
omitted, no runtime context properties are sent. For
`telemetry.includeToolsContext`, only top-level tool context properties marked as
`true` are sent when it is configured; if it is omitted, no tool context
properties are sent.

[Where Context Is Available](#where-context-is-available)
---------------------------------------------------------

| Location | `runtimeContext` | `toolsContext` | Tool `context` / `toolContext` |
| --- | --- | --- | --- |
| `prepareStep` | Read and update | Read and update | Not directly |
| Tool description functions | Not passed directly | Not passed directly | Read one tool's validated `context` |
| Tool `execute` | Not passed directly | Not passed directly | Read one tool's validated `context` |
| Tool approval | Read in generic and per-tool callbacks | Read in generic callbacks | Read as `toolContext` in per-tool callbacks |
| Tool execution events | Not included | Not included | Read as `toolContext` |
| Step results and finish callbacks | Read final or per-step state | Read final or per-step state | Available through the per-tool entries in `toolsContext` |
| Telemetry | Filtered by `telemetry.includeRuntimeContext` | Filtered by `telemetry.includeToolsContext` | Filtered by `telemetry.includeToolsContext` |

[Choosing the Right Context](#choosing-the-right-context)
---------------------------------------------------------

* Use `runtimeContext` for state shared by the whole generation or agent loop,
  such as request metadata, tenant settings, feature flags, or agent progress.
* Use `toolsContext` and `contextSchema` for values needed by a specific tool,
  such as API keys, scoped clients, user permissions, or default tool settings.
* Use prompt messages for information the model should reason about or mention
  in its answer.
* Use `telemetry.includeRuntimeContext` and `telemetry.includeToolsContext` to
  reduce telemetry exposure, not as a general security boundary.

Learn more about [tools and tool calling](/docs/ai-sdk-core/tools-and-tool-calling),
[lifecycle callbacks](/docs/ai-sdk-core/lifecycle-callbacks), and
[telemetry](/docs/ai-sdk-core/telemetry).

[Previous

MCP Apps](/docs/ai-sdk-core/mcp-apps)[Next

Code Mode](/docs/ai-sdk-core/code-mode)
