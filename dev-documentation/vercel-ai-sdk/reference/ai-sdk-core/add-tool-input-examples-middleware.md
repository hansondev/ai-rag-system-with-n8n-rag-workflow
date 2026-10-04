---
title: "addToolInputExamplesMiddleware"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/add-tool-input-examples-middleware
section: reference
crawled: 2026-09-20
---

# addToolInputExamplesMiddleware

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/add-tool-input-examples-middleware

[AI SDK Core](/docs/ai-sdk-core)addToolInputExamplesMiddleware


[`addToolInputExamplesMiddleware`](#addtoolinputexamplesmiddleware)
===================================================================

`addToolInputExamplesMiddleware` is a middleware function that appends input examples to tool descriptions. This is especially useful for language model providers that **do not natively support the `inputExamples` property**—the middleware serializes and injects the examples into the tool's `description` so models can learn from them.

[Import](#import)
-----------------

```
import { addToolInputExamplesMiddleware } from "ai"
```

[API](#api)
-----------

### [Signature](#signature)

```
1

function addToolInputExamplesMiddleware(options?: {



2

prefix?: string;



3

format?: (example: { input: JSONObject }, index: number) => string;



4

remove?: boolean;



5

}): LanguageModelMiddleware;
```

### [Parameters](#parameters)

### prefix?:

string

### format?:

(example: { input: JSONObject }, index: number) => string

### remove?:

boolean

### [Returns](#returns)

A [LanguageModelMiddleware](/docs/ai-sdk-core/middleware) that:

* Locates function tools with an `inputExamples` property.
* Serializes each input example (by default as JSON, or using your custom formatter).
* Prepends a section at the end of the tool description containing all formatted examples, prefixed by the `prefix`.
* Removes the `inputExamples` property from the tool (unless `remove: false`).
* Passes through all other tools (including those without examples) unchanged.

[Usage Example](#usage-example)
-------------------------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import {



2

generateText,



3

tool,



4

wrapLanguageModel,



5

addToolInputExamplesMiddleware,



6

} from 'ai';



7

import { openai } from '@ai-sdk/openai';



8

import { z } from 'zod';



9



10

const model = wrapLanguageModel({



11

model: "xai/grok-4.6",



12

middleware: addToolInputExamplesMiddleware({



13

prefix: 'Input Examples:',



14

format: (example, index) =>



15

`${index + 1}. ${JSON.stringify(example.input)}`,



16

}),



17

});



18



19

const result = await generateText({



20

model,



21

tools: {



22

weather: tool({



23

description: 'Get the weather in a location',



24

inputSchema: z.object({ location: z.string() }),



25

inputExamples: [



26

{ input: { location: 'San Francisco' } },



27

{ input: { location: 'London' } },



28

],



29

}),



30

},



31

prompt: 'What is the weather in Tokyo?',



32

});
```

[How It Works](#how-it-works)
-----------------------------

1. For every function tool that defines `inputExamples`, the middleware:

   * Formats each example with the `format` function (default: JSON.stringify).
   * Builds a section like:

     ```
     1

     Input Examples:



     2

     {"location":"San Francisco"}



     3

     {"location":"London"}
     ```
   * Appends this section to the end of the tool's `description`.
2. By default, it removes the `inputExamples` property after appending to prevent duplication (can be disabled with `remove: false`).
3. Tools without input examples or non-function tools are left unmodified.

> **Tip:** This middleware is especially useful with providers such as OpenAI or Anthropic, where native support for `inputExamples` is not available.

[Example effect](#example-effect)
---------------------------------

If your original tool definition is:

```
1

{



2

type: 'function',



3

name: 'weather',



4

description: 'Get the weather in a location',



5

inputSchema: { ... },



6

inputExamples: [



7

{ input: { location: 'San Francisco' } },



8

{ input: { location: 'London' } }



9

]



10

}
```

After applying the middleware (with default settings), the tool passed to the model will look like:

```
1

{



2

type: 'function',



3

name: 'weather',



4

description: `Get the weather in a location



5



6

Input Examples:



7

{"location":"San Francisco"}



8

{"location":"London"}`,



9

inputSchema: { ... }



10

// inputExamples is removed by default



11

}
```

[Previous

defaultSettingsMiddleware](/docs/reference/ai-sdk-core/default-settings-middleware)[Next

extractJsonMiddleware](/docs/reference/ai-sdk-core/extract-json-middleware)
