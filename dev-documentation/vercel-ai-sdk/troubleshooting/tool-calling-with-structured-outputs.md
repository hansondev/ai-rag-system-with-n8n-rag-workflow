---
title: "Tool calling with structured outputs"
source_url: https://ai-sdk.dev/docs/troubleshooting/tool-calling-with-structured-outputs
section: troubleshooting
crawled: 2026-09-20
---

# Tool calling with structured outputs

> Source: https://ai-sdk.dev/docs/troubleshooting/tool-calling-with-structured-outputs

[Troubleshooting](/docs/troubleshooting)Tool calling with structured outputs


[Tool calling with structured outputs](#tool-calling-with-structured-outputs)
=============================================================================

[Issue](#issue)
---------------

You may want to combine tool calling with structured output generation.

[Background](#background)
-------------------------

To use tool calling with structured outputs, use `generateText` or `streamText` with the `output` option.

**Important**: When using `output` with tool calling, the structured output generation counts as an additional step in the execution flow.

[Solution](#solution)
---------------------

When using `output` with tool calling, adjust your `stopWhen` condition to account for the additional step required for structured output generation:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

output: Output.object({



4

schema: z.object({



5

summary: z.string(),



6

sentiment: z.enum(['positive', 'neutral', 'negative']),



7

}),



8

}),



9

tools: {



10

analyze: tool({



11

description: 'Analyze data',



12

inputSchema: z.object({



13

data: z.string(),



14

}),



15

execute: async ({ data }) => {



16

return { result: 'analyzed' };



17

}),



18

},



19

},



20

// Add at least 1 to your intended step count to account for structured output



21

stopWhen: isStepCount(3), // Now accounts for: tool call + tool result + structured output



22

prompt: 'Analyze the data and provide a summary',



23

});
```

For more information about using structured outputs with `generateText` and `streamText` see [Generating Structured Data](/docs/ai-sdk-core/generating-structured-data#generating-structured-outputs).

[Previous

onEnd not called when stream is aborted](/docs/troubleshooting/stream-abort-handling)[Next

Abort and resumable streams](/docs/troubleshooting/abort-breaks-resumable-streams)
