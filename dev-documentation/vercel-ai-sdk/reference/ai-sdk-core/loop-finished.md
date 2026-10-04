---
title: "isLoopFinished()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/loop-finished
section: reference
crawled: 2026-09-20
---

# isLoopFinished()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/loop-finished

[AI SDK Core](/docs/ai-sdk-core)isLoopFinished


[`isLoopFinished()`](#isloopfinished)
=====================================

Creates a stop condition that never triggers, letting the agent loop run until it naturally finishes (i.e., the model stops making tool calls).

By default, `ToolLoopAgent` uses `isStepCount(20)` as a safety measure to prevent runaway loops that could result in excessive API calls and costs. If you are confident that your agent will terminate naturally or you are less concerned about costs, `isLoopFinished()` removes that limit and lets the agent run until the model is truly done.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isLoopFinished } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools



7

},



8

stopWhen: isLoopFinished(),



9

});



10



11

const result = await agent.generate({



12

prompt: 'Analyze this dataset and create a summary report',



13

});
```

[Import](#import)
-----------------

```
import { isLoopFinished } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

This function takes no parameters.

### [Returns](#returns)

A `StopCondition` function that always returns `false`, meaning it never triggers the stop condition. The agent loop will only stop through its natural termination conditions:

* The model stops making tool calls, or
* A tool without an `execute` function is called, or
* A tool call needs approval

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

Let the agent run until it's finished:

```
1

import { ToolLoopAgent, isLoopFinished } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: yourModel,



5

tools: yourTools,



6

stopWhen: isLoopFinished(),



7

});
```

### [Combining with Other Conditions](#combining-with-other-conditions)

You can combine `isLoopFinished()` with other conditions. Since `isLoopFinished()` never triggers, the other conditions still apply:

```
1

import { ToolLoopAgent, isLoopFinished, hasToolCall } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: yourModel,



5

tools: yourTools,



6

stopWhen: [isLoopFinished(), hasToolCall('finalAnswer')],



7

});
```

In practice, this does not make much sense in this context, since you could just omit `isLoopFinished()`.

[See also](#see-also)
---------------------

* [`isStepCount()`](/docs/reference/ai-sdk-core/is-step-count)
* [`hasToolCall()`](/docs/reference/ai-sdk-core/has-tool-call)
* [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent)

[Previous

hasToolCall](/docs/reference/ai-sdk-core/has-tool-call)[Next

simulateReadableStream](/docs/reference/ai-sdk-core/simulate-readable-stream)
