---
title: "InferUITools"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/infer-ui-tools
section: reference
crawled: 2026-09-20
---

# InferUITools

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/infer-ui-tools

[AI SDK UI](/docs/ai-sdk-ui)InferUITools


[InferUITools](#inferuitools)
=============================

Infers the input and output types of a `ToolSet`.

This type helper is useful when working with tools in TypeScript to ensure type safety for your tool inputs and outputs in `UIMessage`s.

[Import](#import)
-----------------

```
1

import { InferUITools } from 'ai';
```

[API Signature](#api-signature)
-------------------------------

### [Type Parameters](#type-parameters)

### TOOLS:

ToolSet

### [Returns](#returns)

A type that maps each tool in the tool set to its inferred input and output types.

The resulting type has the shape:

```
1

{



2

[NAME in keyof TOOLS & string]: {



3

input: InferToolInput<TOOLS[NAME]>;



4

output: InferToolOutput<TOOLS[NAME]>;



5

};



6

}
```

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

```
1

import { InferUITools } from 'ai';



2

import { z } from 'zod';



3



4

const tools = {



5

weather: {



6

description: 'Get the current weather',



7

inputSchema: z.object({



8

location: z.string().describe('The city and state'),



9

}),



10

execute: async ({ location }) => {



11

return `The weather in ${location} is sunny.`;



12

},



13

},



14

calculator: {



15

description: 'Perform basic arithmetic',



16

inputSchema: z.object({



17

operation: z.enum(['add', 'subtract', 'multiply', 'divide']),



18

a: z.number(),



19

b: z.number(),



20

}),



21

execute: async ({ operation, a, b }) => {



22

switch (operation) {



23

case 'add':



24

return a + b;



25

case 'subtract':



26

return a - b;



27

case 'multiply':



28

return a * b;



29

case 'divide':



30

return a / b;



31

}



32

},



33

},



34

};



35



36

// Infer the types from the tool set



37

type MyUITools = InferUITools<typeof tools>;



38

// This creates a type with:



39

// {



40

//   weather: { input: { location: string }; output: string };



41

//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };



42

// }
```

[Related](#related)
-------------------

* [`InferUITool`](/docs/reference/ai-sdk-ui/infer-ui-tool) - Infer types for a single tool
* [`useChat`](/docs/reference/ai-sdk-ui/use-chat) - Chat hook that supports typed tools

[Previous

readUIMessageStream](/docs/reference/ai-sdk-ui/read-ui-message-stream)[Next

InferUITool](/docs/reference/ai-sdk-ui/infer-ui-tool)
