---
title: "hasToolCall()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/has-tool-call
section: reference
crawled: 2026-09-20
---

# hasToolCall()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/has-tool-call

[AI SDK Core](/docs/ai-sdk-core)hasToolCall


[`hasToolCall()`](#hastoolcall)
===============================

Creates a stop condition that stops when any specified tool is called in the most recent step.

This function is used with `stopWhen` in `generateText` and `streamText` to control when a tool-calling loop should stop based on whether one of the specified tools has been invoked.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, hasToolCall } from 'ai';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

tools: {



6

weather: weatherTool,



7

finalAnswer: finalAnswerTool,



8

},



9

// Stop when the finalAnswer tool is called



10

stopWhen: hasToolCall('finalAnswer'),



11

});
```

[Import](#import)
-----------------

```
import { hasToolCall } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### ...toolNames:

string[]

### [Returns](#returns)

A `StopCondition` function that returns `true` when any of the specified tools is called in the most recent step. The function can be used with the `stopWhen` parameter in `generateText` and `streamText`.

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

Stop when a specific tool is called:

```
1

import { generateText, hasToolCall } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

tools: {



6

submitAnswer: submitAnswerTool,



7

search: searchTool,



8

},



9

stopWhen: hasToolCall('submitAnswer'),



10

});
```

### [Match Multiple Tools](#match-multiple-tools)

Stop when any of several tools is called in the most recent step:

```
1

import { generateText, hasToolCall } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

tools: {



6

weather: weatherTool,



7

search: searchTool,



8

finalAnswer: finalAnswerTool,



9

},



10

stopWhen: hasToolCall('weather', 'finalAnswer'),



11

});
```

### [Combining with Other Conditions](#combining-with-other-conditions)

You can combine multiple stop conditions in an array:

```
1

import { generateText, hasToolCall, isStepCount } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

tools: {



6

weather: weatherTool,



7

search: searchTool,



8

finalAnswer: finalAnswerTool,



9

},



10

// Stop when weather tool is called OR finalAnswer is called OR after 5 steps



11

stopWhen: [



12

hasToolCall('weather'),



13

hasToolCall('finalAnswer'),



14

isStepCount(5),



15

],



16

});
```

### [Agent Pattern](#agent-pattern)

Common pattern for agents that run until they provide a final answer:

```
1

import { generateText, hasToolCall } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

tools: {



6

search: searchTool,



7

calculate: calculateTool,



8

finalAnswer: {



9

description: 'Provide the final answer to the user',



10

inputSchema: z.object({



11

answer: z.string(),



12

}),



13

execute: async ({ answer }) => answer,



14

},



15

},



16

stopWhen: hasToolCall('finalAnswer'),



17

});
```

[See also](#see-also)
---------------------

* [`isStepCount()`](/docs/reference/ai-sdk-core/is-step-count)
* [`generateText()`](/docs/reference/ai-sdk-core/generate-text)
* [`streamText()`](/docs/reference/ai-sdk-core/stream-text)

[Previous

isStepCount](/docs/reference/ai-sdk-core/is-step-count)[Next

isLoopFinished](/docs/reference/ai-sdk-core/loop-finished)
