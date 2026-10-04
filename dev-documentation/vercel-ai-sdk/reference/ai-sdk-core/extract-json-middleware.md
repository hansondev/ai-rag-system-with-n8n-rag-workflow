---
title: "extractJsonMiddleware()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/extract-json-middleware
section: reference
crawled: 2026-09-20
---

# extractJsonMiddleware()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/extract-json-middleware

[AI SDK Core](/docs/ai-sdk-core)extractJsonMiddleware


[`extractJsonMiddleware()`](#extractjsonmiddleware)
===================================================

`extractJsonMiddleware` is a middleware function that extracts JSON from text content by stripping markdown code fences and other formatting. This is useful when using `Output.object()` with models that wrap JSON responses in markdown code blocks (e.g., ```` ```json ... ``` ````).

```
1

import { extractJsonMiddleware } from 'ai';



2



3

const middleware = extractJsonMiddleware();
```

[Import](#import)
-----------------

```
import { extractJsonMiddleware } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### transform?:

(text: string) => string

### [Returns](#returns)

Returns a middleware object that:

* Processes both streaming and non-streaming responses
* Strips markdown code fences (```` ```json ```` and ```` ``` ````) from text content
* Applies custom transformations when a `transform` function is provided
* Maintains proper streaming behavior with efficient buffering

[Usage Examples](#usage-examples)
---------------------------------

### [Basic Usage](#basic-usage)

Strip markdown code fences from model responses when using structured output:

```
1

import {



2

generateText,



3

wrapLanguageModel,



4

extractJsonMiddleware,



5

Output,



6

} from 'ai';



7

import { z } from 'zod';



8



9

const result = await generateText({



10

model: wrapLanguageModel({



11

model: yourModel,



12

middleware: extractJsonMiddleware(),



13

}),



14

output: Output.object({



15

schema: z.object({



16

recipe: z.object({



17

name: z.string(),



18

steps: z.array(z.string()),



19

}),



20

}),



21

}),



22

prompt: 'Generate a lasagna recipe.',



23

});



24



25

console.log(result.output);
```

### [With Streaming](#with-streaming)

The middleware also works with streaming responses:

```
1

import {



2

streamText,



3

wrapLanguageModel,



4

extractJsonMiddleware,



5

Output,



6

} from 'ai';



7

import { z } from 'zod';



8



9

const { partialOutputStream } = streamText({



10

model: wrapLanguageModel({



11

model: yourModel,



12

middleware: extractJsonMiddleware(),



13

}),



14

output: Output.object({



15

schema: z.object({



16

recipe: z.object({



17

ingredients: z.array(z.string()),



18

steps: z.array(z.string()),



19

}),



20

}),



21

}),



22

prompt: 'Generate a detailed recipe.',



23

});



24



25

for await (const partialObject of partialOutputStream) {



26

console.log(partialObject);



27

}
```

### [Custom Transform Function](#custom-transform-function)

For models that use different formatting, you can provide a custom transform:

```
1

import { extractJsonMiddleware } from 'ai';



2



3

const middleware = extractJsonMiddleware({



4

transform: text =>



5

text



6

.replace(/^PREFIX/, '')



7

.replace(/SUFFIX$/, '')



8

.trim(),



9

});
```

[How It Works](#how-it-works)
-----------------------------

The middleware handles text content in two ways:

### [Non-Streaming (generateText)](#non-streaming-generatetext)

1. Receives the complete response from the model
2. Applies the transform function to strip markdown fences (or custom formatting)
3. Returns the cleaned text content

### [Streaming (streamText)](#streaming-streamtext)

1. Buffers initial content to detect markdown fence prefixes (```` ```json\n ````)
2. If a fence is detected, strips the prefix and switches to streaming mode
3. Maintains a small suffix buffer to handle the closing fence (```` \n``` ````)
4. When the stream ends, strips any trailing fence from the buffer
5. For custom transforms, buffers all content and applies the transform at the end

This approach ensures efficient streaming while correctly handling code fences that may be split across multiple chunks.

[Previous

addToolInputExamplesMiddleware](/docs/reference/ai-sdk-core/add-tool-input-examples-middleware)[Next

isStepCount](/docs/reference/ai-sdk-core/is-step-count)
