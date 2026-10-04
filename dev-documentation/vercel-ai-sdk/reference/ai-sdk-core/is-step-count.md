---
title: "isStepCount()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/is-step-count
section: reference
crawled: 2026-09-20
---

# isStepCount()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/is-step-count

[AI SDK Core](/docs/ai-sdk-core)isStepCount


[`isStepCount()`](#isstepcount)
===============================

Creates a stop condition that stops when the number of completed steps equals a specified count.

This function is used with `stopWhen` in `generateText` and `streamText` to control when a tool-calling loop should stop based on the number of steps executed.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, isStepCount } from 'ai';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools



7

},



8

// Stop after 5 steps



9

stopWhen: isStepCount(5),



10

});
```

[Import](#import)
-----------------

```
import { isStepCount } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### stepCount:

number

### [Returns](#returns)

A `StopCondition` function that returns `true` when the number of completed steps equals the specified number. The function can be used with the `stopWhen` parameter in `generateText` and `streamText`.

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

Stop after 3 steps:

```
1

import { generateText, isStepCount } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

tools: yourTools,



6

stopWhen: isStepCount(3),



7

});
```

### [Combining with Other Conditions](#combining-with-other-conditions)

You can combine multiple stop conditions in an array:

```
1

import { generateText, isStepCount, hasToolCall } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

tools: yourTools,



6

// Stop after 10 steps OR when finalAnswer tool is called



7

stopWhen: [isStepCount(10), hasToolCall('finalAnswer')],



8

});
```

[See also](#see-also)
---------------------

* [`hasToolCall()`](/docs/reference/ai-sdk-core/has-tool-call)
* [`generateText()`](/docs/reference/ai-sdk-core/generate-text)
* [`streamText()`](/docs/reference/ai-sdk-core/stream-text)

[Previous

extractJsonMiddleware](/docs/reference/ai-sdk-core/extract-json-middleware)[Next

hasToolCall](/docs/reference/ai-sdk-core/has-tool-call)
