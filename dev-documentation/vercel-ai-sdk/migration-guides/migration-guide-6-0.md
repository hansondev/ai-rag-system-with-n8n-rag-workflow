---
title: "Migrate AI SDK 5.x to 6.0"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0
section: migration-guides
crawled: 2026-09-20
---

# Migrate AI SDK 5.x to 6.0

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0

[Migration Guides](/docs/migration-guides)Migrate AI SDK 5.x to 6.0


[Migrate AI SDK 5.x to 6.0](#migrate-ai-sdk-5x-to-60)
=====================================================

[Recommended Migration Process](#recommended-migration-process)
---------------------------------------------------------------

1. Backup your project. If you use a versioning control system, make sure all previous versions are committed.
2. Upgrade to AI SDK 6.0.
3. Follow the breaking changes guide below.
4. Verify your project is working as expected.
5. Commit your changes.

[AI SDK 6.0 Package Versions](#ai-sdk-60-package-versions)
----------------------------------------------------------

You need to update the following packages to the latest versions in your `package.json` file(s):

* `ai` package: `^6.0.0`
* `@ai-sdk/provider` package: `^3.0.0`
* `@ai-sdk/provider-utils` package: `^4.0.0`
* `@ai-sdk/*` packages: `^3.0.0`

An example upgrade command would be:

```
1

pnpm install ai@latest @ai-sdk/react@latest @ai-sdk/openai@latest
```

[Codemods](#codemods)
---------------------

The AI SDK provides Codemod transformations to help upgrade your codebase when a
feature is deprecated, removed, or otherwise changed.

Codemods are transformations that run on your codebase automatically. They
allow you to easily apply many changes without having to manually go through
every file.

You can run all v6 codemods (v5 → v6 migration) by running the following command
from the root of your project:

```
1

npx @ai-sdk/codemod v6
```

There is also an `npx @ai-sdk/codemod upgrade` command, but it runs all
codemods from all versions (v4, v5, and v6). Use `v6` when upgrading from v5.

Individual codemods can be run by specifying the name of the codemod:

```
1

npx @ai-sdk/codemod <codemod-name> <path>
```

For example, to run a specific v6 codemod:

```
1

npx @ai-sdk/codemod v6/rename-text-embedding-to-embedding src/
```

Codemods are intended as a tool to help you with the upgrade process. They may
not cover all of the changes you need to make. You may need to make additional
changes manually.

[Codemod Table](#codemod-table)
-------------------------------

| Codemod Name | Description |
| --- | --- |
| `rename-text-embedding-to-embedding` | Renames `textEmbeddingModel` to `embeddingModel` and `textEmbedding` to `embedding` on providers |
| `rename-mock-v2-to-v3` | Renames V2 mock classes from `ai/test` to V3 (e.g., `MockLanguageModelV2` → `MockLanguageModelV3`) |
| `rename-tool-call-options-to-tool-execution-options` | Renames the `ToolCallOptions` type to `ToolExecutionOptions` |
| `rename-core-message-to-model-message` | Renames the `CoreMessage` type to `ModelMessage` |
| `rename-converttocoremessages-to-converttomodelmessages` | Renames `convertToCoreMessages` function to `convertToModelMessages` |
| `rename-vertex-provider-metadata-key` | Renames `google` to `vertex` in `providerMetadata` and `providerOptions` for Google Vertex files |
| `wrap-tomodeloutput-parameter` | Wraps `toModelOutput` parameter in object destructuring (`output` → `{ output }`) |
| `add-await-converttomodelmessages` | Adds `await` to `convertToModelMessages` calls (now async in AI SDK 6) |

[AI SDK Core](#ai-sdk-core)
---------------------------

### [`Experimental_Agent` to `ToolLoopAgent` Class](#experimental_agent-to-toolloopagent-class)

The `Experimental_Agent` class has been replaced with the `ToolLoopAgent` class. Two key changes:

1. The `system` parameter has been renamed to `instructions`
2. The default `stopWhen` has changed from `isStepCount(1)` to `isStepCount(20)`

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5

```
1

import { Experimental_Agent as Agent, isStepCount } from 'ai';



2



3

const agent = new Agent({



4

model: "xai/grok-4.6",



5

system: 'You are a helpful assistant.',



6

tools: {



7

// your tools here



8

},



9

stopWhen: isStepCount(20), // Required for multi-step agent loops



10

});



11



12

const result = await agent.generate({



13

prompt: 'What is the weather in San Francisco?',



14

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

instructions: 'You are a helpful assistant.',



6

tools: {



7

// your tools here



8

},



9

// stopWhen defaults to isStepCount(20)



10

});



11



12

const result = await agent.generate({



13

prompt: 'What is the weather in San Francisco?',



14

});
```

Learn more about [building agents](/docs/agents/building-agents).

### [`CoreMessage` Removal](#coremessage-removal)

The deprecated `CoreMessage` type and related functions have been removed ([PR #10710](https://github.com/vercel/ai/pull/10710)). Replace `convertToCoreMessages` with `convertToModelMessages`.

AI SDK 5

```
1

import { convertToCoreMessages, type CoreMessage } from 'ai';



2



3

const coreMessages = convertToCoreMessages(messages); // CoreMessage[]
```

AI SDK 6

```
1

import { convertToModelMessages, type ModelMessage } from 'ai';



2



3

const modelMessages = await convertToModelMessages(messages); // ModelMessage[]
```

Use the `rename-core-message-to-model-message` and
`rename-converttocoremessages-to-converttomodelmessages` codemods to
automatically update your codebase.

### [`generateObject` and `streamObject` Deprecation](#generateobject-and-streamobject-deprecation)

`generateObject` and `streamObject` have been deprecated ([PR #10754](https://github.com/vercel/ai/pull/10754)).
They will be removed in a future version.
Use `generateText` and `streamText` with an `output` setting instead.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5

```
1

import { generateObject } from 'ai';



2

import { z } from 'zod';



3



4

const { object } = await generateObject({



5

model: "xai/grok-4.6",



6

schema: z.object({



7

recipe: z.object({



8

name: z.string(),



9

ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),



10

steps: z.array(z.string()),



11

}),



12

}),



13

prompt: 'Generate a lasagna recipe.',



14

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

model: "xai/grok-4.6",



6

output: Output.object({



7

schema: z.object({



8

recipe: z.object({



9

name: z.string(),



10

ingredients: z.array(



11

z.object({ name: z.string(), amount: z.string() }),



12

),



13

steps: z.array(z.string()),



14

}),



15

}),



16

}),



17

prompt: 'Generate a lasagna recipe.',



18

});
```

For streaming structured data, replace `streamObject` with `streamText`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5

```
1

import { streamObject } from 'ai';



2

import { z } from 'zod';



3



4

const { partialObjectStream } = streamObject({



5

model: "xai/grok-4.6",



6

schema: z.object({



7

recipe: z.object({



8

name: z.string(),



9

ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),



10

steps: z.array(z.string()),



11

}),



12

}),



13

prompt: 'Generate a lasagna recipe.',



14

});



15



16

for await (const partialObject of partialObjectStream) {



17

console.log(partialObject);



18

}
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 6

```
1

import { streamText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { partialOutputStream } = streamText({



5

model: "xai/grok-4.6",



6

output: Output.object({



7

schema: z.object({



8

recipe: z.object({



9

name: z.string(),



10

ingredients: z.array(



11

z.object({ name: z.string(), amount: z.string() }),



12

),



13

steps: z.array(z.string()),



14

}),



15

}),



16

}),



17

prompt: 'Generate a lasagna recipe.',



18

});



19



20

for await (const partialObject of partialOutputStream) {



21

console.log(partialObject);



22

}
```

Learn more about [generating structured data](/docs/ai-sdk-core/generating-structured-data).

### [async `convertToModelMessages`](#async-converttomodelmessages)

`convertToModelMessages()` is async in AI SDK 6 to support async `Tool.toModelOutput()`.

AI SDK 5

```
1

import { convertToModelMessages } from 'ai';



2



3

const modelMessages = convertToModelMessages(uiMessages);
```

AI SDK 6

```
1

import { convertToModelMessages } from 'ai';



2



3

const modelMessages = await convertToModelMessages(uiMessages);
```

Use the `add-await-converttomodelmessages` codemod to automatically update
your codebase.

### [`Tool.toModelOutput` changes](#tooltomodeloutput-changes)

`toModelOutput()` receives a parameter object with an `output` property in AI SDK 6.

In AI SDK 5, the `output` was the arguments.

AI SDK 5

```
1

import { tool } from 'ai';



2



3

const someTool = tool({



4

// ...



5

toModelOutput: output => {



6

// ...



7

},



8

});
```

AI SDK 6

```
1

import { tool } from 'ai';



2



3

const someTool = tool({



4

// ...



5

toModelOutput: ({ output }) => {



6

// ...



7

},



8

});
```

Use the `wrap-tomodeloutput-parameter` codemod to automatically update your
codebase.

### [Remove `name` from Function Tool Definitions](#remove-name-from-function-tool-definitions)

Function tool names come from their keys in the `tools` object. In AI SDK 5, a
`name` property could pass type checking because it was part of the
provider-defined member of the `Tool` type, but it did not set the name of a
function tool. The AI SDK 6 types no longer accept the property in a function
tool definition.

Remove `name` from `tool()` and use the intended name as the key in the `tools`
object:

AI SDK 5

```
1

import { tool } from 'ai';



2

import { z } from 'zod';



3



4

const tools = {



5

getWeather: tool({



6

name: 'getWeather',



7

inputSchema: z.object({}),



8

outputSchema: z.any(),



9

}),



10

};
```

AI SDK 6

```
1

import { tool } from 'ai';



2

import { z } from 'zod';



3



4

const tools = {



5

getWeather: tool({



6

inputSchema: z.object({}),



7

outputSchema: z.any(),



8

}),



9

};
```

### [`cachedInputTokens` and `reasoningTokens` in `LanguageModelUsage` Deprecation](#cachedinputtokens-and-reasoningtokens-in-languagemodelusage-deprecation)

`cachedInputTokens` and `reasoningTokens` in `LanguageModelUsage` have been deprecated.

You can replace `cachedInputTokens` with `inputTokenDetails.cacheReadTokens`
and `reasoningTokens` with `outputTokenDetails.reasoningTokens`.

### [`ToolCallOptions` to `ToolExecutionOptions` Rename](#toolcalloptions-to-toolexecutionoptions-rename)

The `ToolCallOptions` type has been renamed to `ToolExecutionOptions`
and is now deprecated.

Use the `rename-tool-call-options-to-tool-execution-options` codemod to
automatically update your codebase.

### [Per-Tool Strict Mode](#per-tool-strict-mode)

Strict mode for tools is now controlled by setting `strict` on each tool ([PR #10817](https://github.com/vercel/ai/pull/10817)). This enables fine-grained control over strict tool calls, which is important since strict mode depends on the specific tool input schema.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5

```
1

import { streamText, tool } from 'ai';



2

import { z } from 'zod';



3



4

// Tool strict mode was controlled by strictJsonSchema



5

const result = streamText({



6

model: "xai/grok-4.6",



7

tools: {



8

calculator: tool({



9

description: 'A simple calculator',



10

inputSchema: z.object({



11

expression: z.string(),



12

}),



13

execute: async ({ expression }) => {



14

const result = eval(expression);



15

return { result };



16

},



17

}),



18

},



19

providerOptions: {



20

openai: {



21

strictJsonSchema: true, // Applied to all tools



22

},



23

},



24

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 6

```
1

import { streamText, tool } from 'ai';



2

import { z } from 'zod';



3



4

const result = streamText({



5

model: "xai/grok-4.6",



6

tools: {



7

calculator: tool({



8

description: 'A simple calculator',



9

inputSchema: z.object({



10

expression: z.string(),



11

}),



12

execute: async ({ expression }) => {



13

const result = eval(expression);



14

return { result };



15

},



16

strict: true, // Control strict mode per tool



17

}),



18

},



19

});
```

### [Flexible Tool Content](#flexible-tool-content)

AI SDK 6 introduces more flexible tool output and result content support ([PR #9605](https://github.com/vercel/ai/pull/9605)), enabling richer tool interactions and better support for complex tool execution patterns.

### [`ToolCallRepairFunction` Signature](#toolcallrepairfunction-signature)

The `system` parameter in the `ToolCallRepairFunction` type now accepts `SystemModelMessage` in addition to `string` ([PR #10635](https://github.com/vercel/ai/pull/10635)). This allows for more flexible system message configuration, including provider-specific options like caching.

AI SDK 5

```
1

import type { ToolCallRepairFunction } from 'ai';



2



3

const repairToolCall: ToolCallRepairFunction<MyTools> = async ({



4

system, // type: string | undefined



5

messages,



6

toolCall,



7

tools,



8

inputSchema,



9

error,



10

}) => {



11

// ...



12

};
```

AI SDK 6

```
1

import type { ToolCallRepairFunction, SystemModelMessage } from 'ai';



2



3

const repairToolCall: ToolCallRepairFunction<MyTools> = async ({



4

system, // type: string | SystemModelMessage | undefined



5

messages,



6

toolCall,



7

tools,



8

inputSchema,



9

error,



10

}) => {



11

// Handle both string and SystemModelMessage



12

const systemText = typeof system === 'string' ? system : system?.content;



13

// ...



14

};
```

### [Embedding Model Method Rename](#embedding-model-method-rename)

The `textEmbeddingModel` and `textEmbedding` methods on providers have been renamed to `embeddingModel` and `embedding` respectively. Additionally, generics have been removed from `EmbeddingModel`, `embed`, and `embedMany` ([PR #10592](https://github.com/vercel/ai/pull/10592)).

AI SDK 5

```
1

import { openai } from '@ai-sdk/openai';



2

import { embed } from 'ai';



3



4

// Using the full method name



5

const model = openai.textEmbeddingModel('text-embedding-3-small');



6



7

// Using the shorthand



8

const model = openai.textEmbedding('text-embedding-3-small');



9



10

const { embedding } = await embed({



11

model: openai.textEmbedding('text-embedding-3-small'),



12

value: 'sunny day at the beach',



13

});
```

AI SDK 6

```
1

import { openai } from '@ai-sdk/openai';



2

import { embed } from 'ai';



3



4

// Using the full method name



5

const model = openai.embeddingModel('text-embedding-3-small');



6



7

// Using the shorthand



8

const model = openai.embedding('text-embedding-3-small');



9



10

const { embedding } = await embed({



11

model: openai.embedding('text-embedding-3-small'),



12

value: 'sunny day at the beach',



13

});
```

Use the `rename-text-embedding-to-embedding` codemod to automatically update
your codebase.

### [Warning Logger](#warning-logger)

AI SDK 6 introduces a warning logger that outputs deprecation warnings and best practice recommendations ([PR #8343](https://github.com/vercel/ai/pull/8343)).

To disable warning logging, set the `AI_SDK_LOG_WARNINGS` environment variable to `false`:

```
1

export AI_SDK_LOG_WARNINGS=false
```

### [Warning Type Unification](#warning-type-unification)

Separate warning types for each generation function have been consolidated into a single `Warning` type exported from the `ai` package ([PR #10631](https://github.com/vercel/ai/pull/10631)).

AI SDK 5

```
1

// Separate warning types for each generation function



2

import type {



3

CallWarning,



4

ImageModelCallWarning,



5

SpeechWarning,



6

TranscriptionWarning,



7

} from 'ai';
```

AI SDK 6

```
1

// Single Warning type for all generation functions



2

import type { Warning } from 'ai';
```

### [Finish reason "unknown" merged into "other"](#finish-reason-unknown-merged-into-other)

The `unknown` finish reason has been removed. It is now returned as `other`.

[AI SDK UI](#ai-sdk-ui)
-----------------------

### [Tool UI Part Approval States](#tool-ui-part-approval-states)

AI SDK 6 adds `approval-requested`, `approval-responded`, and `output-denied`
to the tool UI part `state` union. Update exhaustive `switch` statements and
other state handling to cover the three approval states.

AI SDK 6

```
1

switch (part.state) {



2

case 'input-streaming':



3

return 'Loading input';



4

case 'input-available':



5

return 'Input ready';



6

case 'approval-requested':



7

return 'Approval requested';



8

case 'approval-responded':



9

return 'Approval response received';



10

case 'output-available':



11

return 'Output ready';



12

case 'output-error':



13

return part.errorText;



14

case 'output-denied':



15

return 'Tool call denied';



16

}
```

See [Tool execution approval](/docs/ai-sdk-ui/chatbot-tool-usage#tool-execution-approval)
for handling approval requests and responses in a chat UI.

### [Tool UI Part Helper Functions Rename](#tool-ui-part-helper-functions-rename)

The tool UI part helper functions have been renamed to better reflect their purpose and to accommodate both static and dynamic tool parts ([PR #XXXX](https://github.com/vercel/ai/pull/XXXX)).

#### [`isToolUIPart` → `isStaticToolUIPart`](#istooluipart--isstatictooluipart)

The `isToolUIPart` function has been renamed to `isStaticToolUIPart` to clarify that it checks for static tool parts only.

AI SDK 5

```
1

import { isToolUIPart } from 'ai';



2



3

// Check if a part is a tool UI part



4

if (isToolUIPart(part)) {



5

console.log(part.toolName);



6

}
```

AI SDK 6

```
1

import { isStaticToolUIPart } from 'ai';



2



3

// Check if a part is a static tool UI part



4

if (isStaticToolUIPart(part)) {



5

console.log(part.toolName);



6

}
```

#### [`isToolOrDynamicToolUIPart` → `isToolUIPart`](#istoolordynamictooluipart--istooluipart)

The `isToolOrDynamicToolUIPart` function has been renamed to `isToolUIPart`. The old name is deprecated but still available.

AI SDK 5

```
1

import { isToolOrDynamicToolUIPart } from 'ai';



2



3

// Check if a part is either a static or dynamic tool UI part



4

if (isToolOrDynamicToolUIPart(part)) {



5

console.log('Tool part found');



6

}
```

AI SDK 6

```
1

import { isToolUIPart } from 'ai';



2



3

// Check if a part is either a static or dynamic tool UI part



4

if (isToolUIPart(part)) {



5

console.log('Tool part found');



6

}
```

#### [`getToolName` → `getStaticToolName`](#gettoolname--getstatictoolname)

The `getToolName` function has been renamed to `getStaticToolName` to clarify that it returns the tool name from static tool parts only.

AI SDK 5

```
1

import { getToolName } from 'ai';



2



3

// Get the tool name from a tool part



4

const name = getToolName(toolPart);
```

AI SDK 6

```
1

import { getStaticToolName } from 'ai';



2



3

// Get the tool name from a static tool part



4

const name = getStaticToolName(toolPart);
```

#### [`getToolOrDynamicToolName` → `getToolName`](#gettoolordynamictoolname--gettoolname)

The `getToolOrDynamicToolName` function has been renamed to `getToolName`. The old name is deprecated but still available.

AI SDK 5

```
1

import { getToolOrDynamicToolName } from 'ai';



2



3

// Get the tool name from either a static or dynamic tool part



4

const name = getToolOrDynamicToolName(toolPart);
```

AI SDK 6

```
1

import { getToolName } from 'ai';



2



3

// Get the tool name from either a static or dynamic tool part



4

const name = getToolName(toolPart);
```

[Providers](#providers)
-----------------------

### [OpenAI](#openai)

#### [`strictJsonSchema` Defaults to True](#strictjsonschema-defaults-to-true)

The `strictJsonSchema` setting for JSON outputs and tool calls is enabled by default ([PR #10752](https://github.com/vercel/ai/pull/10752)). This improves stability and ensures valid JSON output that matches your schema.

However, strict mode is stricter about schema requirements. If you receive schema rejection errors, adjust your schema (for example, use `null` instead of `undefined`) or disable strict mode.

AI SDK 5

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateObject } from 'ai';



3

import { z } from 'zod';



4



5

// strictJsonSchema was false by default



6

const result = await generateObject({



7

model: openai('gpt-5.1'),



8

schema: z.object({



9

name: z.string(),



10

}),



11

prompt: 'Generate a person',



12

});
```

AI SDK 6

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateObject } from 'ai';



3

import { z } from 'zod';



4



5

// strictJsonSchema is true by default



6

const result = await generateObject({



7

model: openai('gpt-5.1'),



8

schema: z.object({



9

name: z.string(),



10

}),



11

prompt: 'Generate a person',



12

});



13



14

// Disable strict mode if needed



15

const resultNoStrict = await generateObject({



16

model: openai('gpt-5.1'),



17

schema: z.object({



18

name: z.string(),



19

}),



20

prompt: 'Generate a person',



21

providerOptions: {



22

openai: {



23

strictJsonSchema: false,



24

} satisfies OpenAIResponsesProviderOptions,



25

},



26

});
```

#### [`structuredOutputs` Option Removed from Chat Model](#structuredoutputs-option-removed-from-chat-model)

The `structuredOutputs` provider option has been removed from chat models ([PR #10752](https://github.com/vercel/ai/pull/10752)). Use `strictJsonSchema` instead.

### [Azure](#azure)

#### [Default Provider Uses Responses API](#default-provider-uses-responses-api)

The `@ai-sdk/azure` provider now uses the Responses API by default when calling `azure()` ([PR #9868](https://github.com/vercel/ai/pull/9868)). To use the previous Chat Completions API behavior, use `azure.chat()` instead.

AI SDK 5

```
1

import { azure } from '@ai-sdk/azure';



2



3

// Used Chat Completions API



4

const model = azure('gpt-4o');
```

AI SDK 6

```
1

import { azure } from '@ai-sdk/azure';



2



3

// Now uses Responses API by default



4

const model = azure('gpt-4o');



5



6

// Use azure.chat() for Chat Completions API



7

const chatModel = azure.chat('gpt-4o');



8



9

// Use azure.responses() explicitly for Responses API



10

const responsesModel = azure.responses('gpt-4o');
```

The Responses and Chat Completions APIs have different behavior and defaults.
If you depend on the Chat Completions API, switch your model instance to
`azure.chat()` and audit your configuration.

#### [Responses API `providerMetadata` and `providerOptions` Key](#responses-api-providermetadata-and-provideroptions-key)

For the **Responses API**, the `@ai-sdk/azure` provider now uses `azure` as the key for `providerMetadata` and `providerOptions` instead of `openai`. The `openai` key is still supported for `providerOptions` input, but resulting `providerMetadata` output now uses `azure`.

AI SDK 5

```
1

import { azure } from '@ai-sdk/azure';



2

import { generateText } from 'ai';



3



4

const result = await generateText({



5

model: azure.responses('gpt-5-mini'), // use your own deployment



6

prompt: 'Hello',



7

providerOptions: {



8

openai: {



9

// AI SDK 5: use `openai` key for Responses API options



10

reasoningSummary: 'auto',



11

},



12

},



13

});



14



15

// Accessed metadata via 'openai' key



16

console.log(result.providerMetadata?.openai?.responseId);
```

AI SDK 6

```
1

import { azure } from '@ai-sdk/azure';



2

import { generateText } from 'ai';



3



4

const result = await generateText({



5

// azure() now uses the Responses API by default



6

model: azure('gpt-5-mini'), // use your own deployment



7

prompt: 'Hello',



8

providerOptions: {



9

azure: {



10

// AI SDK 6: use `azure` key for Responses API options



11

reasoningSummary: 'auto',



12

},



13

},



14

});



15



16

// Access metadata via 'azure' key



17

console.log(result.providerMetadata?.azure?.responseId);
```

### [Anthropic](#anthropic)

#### [Structured Outputs Mode](#structured-outputs-mode)

Anthropic has  [introduced native structured outputs for Claude Sonnet 4.5 and later models](https://www.claude.com/blog/structured-outputs-on-the-claude-developer-platform) . The `@ai-sdk/anthropic` provider now includes a `structuredOutputMode` option to control how structured outputs are generated ([PR #10502](https://github.com/vercel/ai/pull/10502)).

The available modes are:

* `'outputFormat'`: Use Anthropic's native `output_format` parameter
* `'jsonTool'`: Use a special JSON tool to specify the structured output format
* `'auto'` (default): Use `'outputFormat'` when supported by the model, otherwise fall back to `'jsonTool'`

AI SDK 6

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { generateObject } from 'ai';



3

import { z } from 'zod';



4



5

const result = await generateObject({



6

model: anthropic('claude-sonnet-4-5-20250929'),



7

schema: z.object({



8

name: z.string(),



9

age: z.number(),



10

}),



11

prompt: 'Generate a person',



12

providerOptions: {



13

anthropic: {



14

// Explicitly set the structured output mode (optional)



15

structuredOutputMode: 'outputFormat',



16

} satisfies AnthropicProviderOptions,



17

},



18

});
```

### [Google Vertex](#google-vertex)

#### [`providerMetadata` and `providerOptions` Key](#providermetadata-and-provideroptions-key)

The `@ai-sdk/google-vertex` provider now uses `vertex` as the key for `providerMetadata` and `providerOptions` instead of `google`. The `google` key is still supported for `providerOptions` input, but resulting `providerMetadata` output now uses `vertex`.

AI SDK 5

```
1

import { vertex } from '@ai-sdk/google-vertex';



2

import { generateText } from 'ai';



3



4

const result = await generateText({



5

model: vertex('gemini-2.5-flash'),



6

providerOptions: {



7

google: {



8

safetySettings: [



9

/* ... */



10

],



11

}, // Used 'google' key



12

},



13

prompt: 'Hello',



14

});



15



16

// Accessed metadata via 'google' key



17

console.log(result.providerMetadata?.google?.safetyRatings);
```

AI SDK 6

```
1

import { vertex } from '@ai-sdk/google-vertex';



2

import { generateText } from 'ai';



3



4

const result = await generateText({



5

model: vertex('gemini-2.5-flash'),



6

providerOptions: {



7

vertex: {



8

safetySettings: [



9

/* ... */



10

],



11

}, // Now uses 'vertex' key



12

},



13

prompt: 'Hello',



14

});



15



16

// Access metadata via 'vertex' key



17

console.log(result.providerMetadata?.vertex?.safetyRatings);
```

Use the `rename-vertex-provider-metadata-key` codemod to automatically update
your codebase.

[`ai/test`](#aitest)
--------------------

### [Mock Classes](#mock-classes)

V2 mock classes have been removed from the `ai/test` module. Use the new V3 mock classes instead for testing.

AI SDK 5

```
1

import {



2

MockEmbeddingModelV2,



3

MockImageModelV2,



4

MockLanguageModelV2,



5

MockProviderV2,



6

MockSpeechModelV2,



7

MockTranscriptionModelV2,



8

} from 'ai/test';
```

AI SDK 6

```
1

import {



2

MockEmbeddingModelV3,



3

MockImageModelV3,



4

MockLanguageModelV3,



5

MockProviderV3,



6

MockSpeechModelV3,



7

MockTranscriptionModelV3,



8

} from 'ai/test';
```

Use the `rename-mock-v2-to-v3` codemod to automatically update your codebase.

[Previous

Migrate AI SDK 6.x to 7.0](/docs/migration-guides/migration-guide-7-0)[Next

Migrate Your Data to AI SDK 5.0](/docs/migration-guides/migration-guide-5-0-data)
