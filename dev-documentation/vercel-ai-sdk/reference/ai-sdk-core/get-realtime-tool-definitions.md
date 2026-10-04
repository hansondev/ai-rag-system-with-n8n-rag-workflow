---
title: "experimental_getRealtimeToolDefinitions()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/get-realtime-tool-definitions
section: reference
crawled: 2026-09-20
---

# experimental_getRealtimeToolDefinitions()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/get-realtime-tool-definitions

[AI SDK Core](/docs/ai-sdk-core)experimental\_getRealtimeToolDefinitions


[`experimental_getRealtimeToolDefinitions()`](#experimental_getrealtimetooldefinitions)
=======================================================================================

`experimental_getRealtimeToolDefinitions` is part of the experimental realtime
API.

Converts an AI SDK `ToolSet` into provider-neutral realtime tool definitions
that can be passed to a realtime session setup request.

Use it in the server-side setup endpoint that creates a short-lived realtime
provider token.

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

city: z.string(),



10

}),



11

}),



12

};



13



14

const toolDefinitions = await experimental_getRealtimeToolDefinitions({



15

tools,



16

});



17



18

const token = await openai.experimental_realtime.getToken({



19

model: 'gpt-realtime',



20

sessionConfig: {



21

tools: toolDefinitions,



22

},



23

});
```

[Import](#import)
-----------------

```
import { experimental_getRealtimeToolDefinitions } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### options:

Object

Object

### tools:

ToolSet

### toolsContext?:

InferToolSetContext<TOOLS>

### [Returns](#returns)

A `Promise<Experimental_RealtimeToolDefinition[]>`.

Each returned definition contains:

### type:

'function'

### name:

string

### description:

string | undefined

### parameters:

JSONSchema7

[Notes](#notes)
---------------

* Tool execution is not handled by `experimental_getRealtimeToolDefinitions`. Use
  [`experimental_useRealtime`](/docs/reference/ai-sdk-ui/use-realtime)
  `onToolCall` and `addToolOutput` to execute tools and return results.
* Provider tools are skipped because realtime providers expect regular function
  definitions in the session config.
* Dynamic tool descriptions are resolved with the matching value from
  `toolsContext` before the definitions are returned.

[Previous

createMCPClient](/docs/reference/ai-sdk-core/create-mcp-client)[Next

toolSearch](/docs/reference/ai-sdk-core/tool-search)
