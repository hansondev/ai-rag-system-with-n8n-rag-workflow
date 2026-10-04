---
title: "filterActiveTools()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/filter-active-tools
section: reference
crawled: 2026-09-20
---

# filterActiveTools()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/filter-active-tools

[AI SDK Core](/docs/ai-sdk-core)filterActiveTools


[`filterActiveTools()`](#filteractivetools)
===========================================

`filterActiveTools` is an experimental feature.

`filterActiveTools` filters a tool set to only the string tool names listed in `activeTools`.
If `activeTools` is `undefined`, it returns the original tool set.
If `tools` is `undefined`, it returns `undefined`.

`filterActiveTools` is useful for limiting which tools are sent to a model in a particular step.

```
1

import { experimental_filterActiveTools as filterActiveTools, tool } from 'ai';



2

import { z } from 'zod';



3



4

const tools = {



5

weather: tool({



6

description: 'Get the weather for a city',



7

inputSchema: z.object({ city: z.string() }),



8

}),



9

time: tool({



10

description: 'Get the current time for a city',



11

inputSchema: z.object({ city: z.string() }),



12

}),



13

};



14



15

const activeTools = ['weather'] as const;



16



17

const filteredTools = filterActiveTools({



18

tools,



19

activeTools,



20

});
```

[Import](#import)
-----------------

```
import { experimental_filterActiveTools as filterActiveTools } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### tools:

ToolSet | undefined

### activeTools:

ActiveTools<TOOLS>

### [Returns](#returns)

The filtered tool set, or `undefined` when `tools` is `undefined`.

When `activeTools` is provided as a literal array such as `["weather"] as const`,
TypeScript narrows the return type to only that subset of tools.

[Types](#types)
---------------

### [`ActiveTools`](#activetools)

```
1

type ActiveTools<TOOLS extends ToolSet> =



2

| ReadonlyArray<keyof TOOLS & string>



3

| undefined;
```

`ActiveTools` only accepts string keys from the tool set because tool names are strings at runtime.

[Previous

Output](/docs/reference/ai-sdk-core/output)[Next

ModelMessage](/docs/reference/ai-sdk-core/model-message)
