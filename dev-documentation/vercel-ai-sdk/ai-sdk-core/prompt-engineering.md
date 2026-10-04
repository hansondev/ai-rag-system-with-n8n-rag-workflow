---
title: "Prompt Engineering"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/prompt-engineering
section: ai-sdk-core
crawled: 2026-09-20
---

# Prompt Engineering

> Source: https://ai-sdk.dev/docs/ai-sdk-core/prompt-engineering

[AI SDK Core](/docs/ai-sdk-core)Prompt Engineering


[Prompt Engineering](#prompt-engineering)
=========================================

[Tips](#tips)
-------------

### [Prompts for Tools](#prompts-for-tools)

When you create prompts that include tools, getting good results can be tricky as the number and complexity of your tools increases.

Here are a few tips to help you get the best results:

1. Use a model that is strong at tool calling, such as `gpt-5` or `gpt-4.1`. Weaker models will often struggle to call tools effectively and flawlessly.
2. Keep the number of tools low, e.g. to 5 or less.
3. Keep the complexity of the tool parameters low. Complex Zod schemas with many nested and optional elements, unions, etc. can be challenging for the model to work with.
4. Use semantically meaningful names for your tools, parameters, parameter properties, etc. The more information you pass to the model, the better it can understand what you want.
5. Add `.describe("...")` to your Zod schema properties to give the model hints about what a particular property is for.
6. When the output of a tool might be unclear to the model and there are dependencies between tools, use the `description` field of a tool to provide information about the output of the tool execution.
7. You can include example input/outputs of tool calls in your prompt to help the model understand how to use the tools. Keep in mind that the tools work with JSON objects, so the examples should use JSON.

In general, the goal should be to give the model all information it needs in a clear way.

### [Tool & Structured Data Schemas](#tool--structured-data-schemas)

The mapping from Zod schemas to LLM inputs (typically JSON schema) is not always straightforward, since the mapping is not one-to-one.

#### [Zod Dates](#zod-dates)

Zod expects JavaScript Date objects, but models return dates as strings.
You can specify and validate the date format using `z.string().datetime()` or `z.string().date()`,
and then use a Zod transformer to convert the string to a Date object.

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

events: z.array(



6

z.object({



7

event: z.string(),



8

date: z



9

.string()



10

.date()



11

.transform(value => new Date(value)),



12

}),



13

),



14

}),



15

}),



16

prompt: 'List 5 important events from the year 2000.',



17

});
```

#### [Optional Parameters](#optional-parameters)

When working with tools that have optional parameters, you may encounter compatibility issues with certain providers that use strict schema validation.

This is particularly relevant for OpenAI models with structured outputs
(strict mode).

For maximum compatibility, optional parameters should use `.nullable()` instead of `.optional()`:

```
1

// This may fail with strict schema validation



2

const failingTool = tool({



3

description: 'Execute a command',



4

inputSchema: z.object({



5

command: z.string(),



6

workdir: z.string().optional(), // This can cause errors



7

timeout: z.string().optional(),



8

}),



9

});



10



11

// This works with strict schema validation



12

const workingTool = tool({



13

description: 'Execute a command',



14

inputSchema: z.object({



15

command: z.string(),



16

workdir: z.string().nullable(), // Use nullable instead



17

timeout: z.string().nullable(),



18

}),



19

});
```

#### [Temperature Settings](#temperature-settings)

For tool calls and object generation, it's recommended to use `temperature: 0` to ensure deterministic and consistent results:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

temperature: 0, // Recommended for tool calls



4

tools: {



5

myTool: tool({



6

description: 'Execute a command',



7

inputSchema: z.object({



8

command: z.string(),



9

}),



10

}),



11

},



12

prompt: 'Execute the ls command',



13

});
```

Lower temperature values reduce randomness in model outputs, which is particularly important when the model needs to:

* Generate structured data with specific formats
* Make precise tool calls with correct parameters
* Follow strict schemas consistently

[Debugging](#debugging)
-----------------------

### [Inspecting Warnings](#inspecting-warnings)

Not all providers support all AI SDK features.
Providers either throw exceptions or return warnings when they do not support a feature.
To check if your prompt, tools, and settings are handled correctly by the provider, you can check the call warnings:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Hello, world!',



4

});



5



6

console.log(result.warnings);
```

### [Request Messages](#request-messages)

You can inspect the input messages that were sent to the model for the final step using `request.messages`.
Set `include.requestMessages` to `true` to include these messages in step results.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Hello, world!',



4

include: { requestMessages: true },



5

});



6



7

console.log(result.finalStep.request.messages);
```

### [HTTP Request Bodies](#http-request-bodies)

You can inspect the raw HTTP request bodies for models that expose them, e.g. [OpenAI](/providers/ai-sdk-providers/openai).
This allows you to inspect the exact payload that is sent to the model provider in the provider-specific way.

Request bodies are available via the `finalStep.request.body` property of the response:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Hello, world!',



4

});



5



6

console.log(result.finalStep.request.body);
```

[Previous

Tool Search](/docs/ai-sdk-core/tool-search)[Next

Settings](/docs/ai-sdk-core/settings)
