---
title: "InferUITool"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/infer-ui-tool
section: reference
crawled: 2026-09-20
---

# InferUITool

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/infer-ui-tool

[AI SDK UI](/docs/ai-sdk-ui)InferUITool


[InferUITool](#inferuitool)
===========================

Infers the input and output types of a tool.

This type helper is useful when working with individual tools to ensure type safety for your tool inputs and outputs in `UIMessage`s.

[Import](#import)
-----------------

```
1

import { InferUITool } from 'ai';
```

[API Signature](#api-signature)
-------------------------------

### [Type Parameters](#type-parameters)

### TOOL:

Tool

### [Returns](#returns)

A type that contains the inferred input and output types of the tool.

The resulting type has the shape:

```
1

{



2

input: InferToolInput<TOOL>;



3

output: InferToolOutput<TOOL>;



4

}
```

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

```
1

import { InferUITool } from 'ai';



2

import { z } from 'zod';



3



4

const weatherTool = {



5

description: 'Get the current weather',



6

inputSchema: z.object({



7

location: z.string().describe('The city and state'),



8

}),



9

execute: async ({ location }) => {



10

return `The weather in ${location} is sunny.`;



11

},



12

};



13



14

// Infer the types from the tool



15

type WeatherUITool = InferUITool<typeof weatherTool>;



16

// This creates a type with:



17

// {



18

//   input: { location: string };



19

//   output: string;



20

// }
```

[Related](#related)
-------------------

* [`InferUITools`](/docs/reference/ai-sdk-ui/infer-ui-tools) - Infer types for a tool set
* [`ToolUIPart`](/docs/reference/ai-sdk-core/ui-message#tooluipart) - Tool part type for UI messages

[Previous

InferUITools](/docs/reference/ai-sdk-ui/infer-ui-tools)[Next

experimental\_MCPAppRenderer](/docs/reference/ai-sdk-ui/mcp-app-renderer)
