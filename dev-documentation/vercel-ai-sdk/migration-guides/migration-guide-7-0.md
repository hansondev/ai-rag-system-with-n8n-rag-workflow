---
title: "Migrate AI SDK 6.x to 7.0"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0
section: migration-guides
crawled: 2026-09-20
---

# Migrate AI SDK 6.x to 7.0

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0

[Migration Guides](/docs/migration-guides)Migrate AI SDK 6.x to 7.0


[Migrate AI SDK 6.x to 7.0](#migrate-ai-sdk-6x-to-70)
=====================================================

Use the command below to add the migration skill:

```
1

npx skills add vercel/ai --skill migrate-ai-sdk-v6-to-v7
```

Then ask your agent:

```
1

Use the migrate-ai-sdk-v6-to-v7 skill and migrate my app from AI SDK v6 to v7.
```

[Recommended Migration Process](#recommended-migration-process)
---------------------------------------------------------------

1. Backup your project. If you use a versioning control system, make sure all previous versions are committed.
2. Upgrade to AI SDK 7.0.
3. Follow the breaking changes guide below.
4. Verify your project is working as expected.
5. Commit your changes.

An example upgrade command would be:

```
1

pnpm install ai @ai-sdk/react @ai-sdk/openai @ai-sdk/otel
```

[Codemods](#codemods)
---------------------

The AI SDK provides Codemod transformations to help upgrade your codebase when a
feature is deprecated, removed, or otherwise changed.

Codemods are transformations that run on your codebase automatically. They
allow you to easily apply many changes without having to manually go through
every file.

You can run all v7 codemods (v6 -> v7 migration) by running the following
command from the root of your project:

```
1

npx @ai-sdk/codemod v7
```

Individual codemods can be run by specifying the name of the codemod:

```
1

npx @ai-sdk/codemod <codemod-name> <path>
```

For example, to run a specific v7 codemod:

```
1

npx @ai-sdk/codemod v7/rename-system-to-instructions src/
```

Codemods are intended as a tool to help you with the upgrade process. They may
not cover all of the changes you need to make. You may need to make additional
changes manually.

[Codemod Table](#codemod-table)
-------------------------------

| Codemod Name | Description |
| --- | --- |
| `remove-experimental-custom-provider` | Replaces `experimental_customProvider` with `customProvider` |
| `remove-experimental-generate-image` | Replaces `experimental_generateImage` and `Experimental_GenerateImageResult` with stable names |
| `replace-experimental-output-with-output` | Replaces `experimental_output` options and result access with `output` |
| `remove-experimental-prepare-step` | Replaces `experimental_prepareStep` with `prepareStep` |
| `replace-cached-input-tokens` | Replaces `usage.cachedInputTokens` with `usage.inputTokenDetails.cacheReadTokens` |
| `replace-reasoning-tokens` | Replaces `usage.reasoningTokens` with `usage.outputTokenDetails.reasoningTokens` |
| `remove-experimental-active-tools` | Replaces `experimental_activeTools` with `activeTools` |
| `remove-tool-call-options-type` | Replaces the removed `ToolCallOptions` type with `ToolExecutionOptions` |
| `remove-is-tool-or-dynamic-tool-uipart` | Replaces `isToolOrDynamicToolUIPart` with `isToolUIPart` |
| `remove-media-content-part-type` | Replaces tool result content parts with `type: 'media'` with `type: 'file-data'` |
| `replace-anthropic-cache-creation-input-tokens` | Replaces Anthropic `cacheCreationInputTokens` metadata access with standard usage fields |
| `rename-experimental-transcribe` | Renames `experimental_transcribe` and `Experimental_TranscriptionResult` to stable names |
| `rename-experimental-generate-speech` | Renames `experimental_generateSpeech` and `Experimental_SpeechResult` to stable names |
| `rename-call-settings-type` | Replaces `CallSettings` with `LanguageModelCallOptions & Omit<RequestOptions, 'timeout'>` |
| `rename-step-count-is` | Renames `stepCountIs` to `isStepCount` |
| `rename-system-to-instructions` | Renames `system` prompt options, lifecycle fields, and repair-tool-call fields to `instructions` |
| `rename-experimental-on-start-to-on-start` | Renames `experimental_onStart` to `onStart` |
| `rename-experimental-on-step-start-to-on-step-start` | Renames `experimental_onStepStart` to `onStepStart` |
| `rename-on-finish-to-on-end` | Renames `onFinish` callbacks to `onEnd` |
| `rename-on-step-finish-to-on-step-end` | Renames `onStepFinish` callbacks to `onStepEnd` |
| `rename-experimental-on-finish-to-on-end` | Renames `experimental_onFinish` callbacks to `onEnd` |
| `rename-experimental-telemetry-to-telemetry` | Renames `experimental_telemetry` options to `telemetry` |
| `rename-on-rerank-finish-to-on-rerank-end` | Renames telemetry `onRerankFinish` callbacks to `onRerankEnd` |
| `rename-on-embed-finish-to-on-embed-end` | Renames telemetry `onEmbedFinish` callbacks to `onEmbedEnd` |
| `rename-full-stream-to-stream` | Renames `streamText` result `fullStream` access to `stream` |
| `move-include-raw-chunks-to-include` | Moves `includeRawChunks` into `include.rawChunks` |
| `rename-experimental-include-to-include` | Renames `experimental_include` to `include` |
| `rename-experimental-on-tool-call-start-to-on-tool-execution-start` | Renames `experimental_onToolCallStart` to `onToolExecutionStart` |
| `rename-experimental-on-tool-call-finish-to-on-tool-execution-end` | Renames `experimental_onToolCallFinish` to `onToolExecutionEnd` |
| `rename-experimental-context-to-context` | Renames tool callback `experimental_context` access to `context` |
| `rename-google-generative-ai-to-google` | Renames Google provider types, classes, and functions that include `GoogleGenerativeAI` to `Google` |
| `replace-image-message-part-with-file` | Replaces image message parts with file parts using `mediaType: 'image'` |

[All Packages](#all-packages)
-----------------------------

### [Minimum Node.js Version](#minimum-nodejs-version)

AI SDK 7.0 requires **Node.js 22** or later. The SDK is tested on Node.js **22**, **24**, and **26**.

Node.js 18 and 20 are no longer supported. Node.js 22 reached end-of-maintenance on **April 30, 2026**; for production workloads, prefer **Node.js 24 (LTS)** or **Node.js 26**. See the [Node.js release schedule](https://nodejs.org/en/about/previous-releases) for current status and support timelines.

Update the `engines` field in your `package.json` if you enforce a minimum Node.js version:

package.json

```
1

{



2

"engines": {



3

"node": ">=22"



4

}



5

}
```

### [ESM Only — CommonJS Support Removed](#esm-only--commonjs-support-removed)

All AI SDK packages are now ESM-only. The `require()` function is no longer supported.

If your project uses CommonJS (`require()`), switch to ESM `import` syntax:

Before (CommonJS)

```
1

const { generateText } = require('ai');



2

const { openai } = require('@ai-sdk/openai');
```

After (ESM)

```
1

import { generateText } from 'ai';



2

import { openai } from '@ai-sdk/openai';
```

If your `package.json` does not already include `"type": "module"`, add it or rename your files to use the `.mjs` extension.

[AI SDK Core](#ai-sdk-core)
---------------------------

### [Core API Renames and Removals](#core-api-renames-and-removals)

#### [Provider Management: Remove Deprecated `experimental_customProvider`](#provider-management-remove-deprecated-experimental_customprovider)

The deprecated `experimental_customProvider` export has been removed in AI SDK 7. Replace it with `customProvider`.

AI SDK 6

```
1

import { experimental_customProvider } from 'ai';



2



3

export const myProvider = experimental_customProvider({



4

languageModels: {



5

// ...



6

},



7

});
```

AI SDK 7

```
1

import { customProvider } from 'ai';



2



3

export const myProvider = customProvider({



4

languageModels: {



5

// ...



6

},



7

});
```

This is only an import and symbol rename. The `customProvider` options and
behavior are unchanged.

#### [Remove Deprecated `experimental_generateImage` Export](#remove-deprecated-experimental_generateimage-export)

The deprecated `experimental_generateImage` export has been removed in AI SDK 7. Replace it with `generateImage`.

The deprecated `Experimental_GenerateImageResult` type export has also been removed. Replace it with `GenerateImageResult`.

AI SDK 6

```
1

import {



2

experimental_generateImage,



3

type Experimental_GenerateImageResult,



4

} from 'ai';



5



6

const result: Experimental_GenerateImageResult =



7

await experimental_generateImage({



8

model: yourImageModel,



9

prompt: 'A red panda eating bamboo',



10

});
```

AI SDK 7

```
1

import { generateImage, type GenerateImageResult } from 'ai';



2



3

const result: GenerateImageResult = await generateImage({



4

model: yourImageModel,



5

prompt: 'A red panda eating bamboo',



6

});
```

#### [`experimental_transcribe` Renamed to `transcribe`](#experimental_transcribe-renamed-to-transcribe)

The transcription API has graduated out of experimental status and has been
renamed to `transcribe`. The `Experimental_TranscriptionResult` type has also
been renamed to `TranscriptionResult`.

AI SDK 6

```
1

import {



2

experimental_transcribe as transcribe,



3

type Experimental_TranscriptionResult,



4

} from 'ai';



5



6

const result: Experimental_TranscriptionResult = await transcribe({



7

model: yourTranscriptionModel,



8

audio,



9

});
```

AI SDK 7

```
1

import { transcribe, type TranscriptionResult } from 'ai';



2



3

const result: TranscriptionResult = await transcribe({



4

model: yourTranscriptionModel,



5

audio,



6

});
```

The old names continue to work as deprecated aliases in AI SDK 7 and will be
removed in a future major release.

#### [`experimental_generateSpeech` Renamed to `generateSpeech`](#experimental_generatespeech-renamed-to-generatespeech)

The speech generation function has graduated out of experimental status and has
been renamed to `generateSpeech`. The `Experimental_SpeechResult` type has also
been renamed to `SpeechResult`.

AI SDK 6

```
1

import { experimental_generateSpeech as generateSpeech } from 'ai';



2



3

const result = await generateSpeech({



4

model: yourSpeechModel,



5

text: 'Hello',



6

});
```

AI SDK 7

```
1

import { generateSpeech } from 'ai';



2



3

const result = await generateSpeech({



4

model: yourSpeechModel,



5

text: 'Hello',



6

});
```

The old `experimental_generateSpeech` and `Experimental_SpeechResult` exports
continue to work as deprecated aliases in AI SDK 7 and will be removed in a
future major release.

#### [Structured Outputs: Remove Deprecated `experimental_output` Option and Result](#structured-outputs-remove-deprecated-experimental_output-option-and-result)

The deprecated `experimental_output` option has been removed in AI SDK 7. Replace all remaining usages with `output`.

The deprecated `generateText()` result property `experimental_output` has also been removed. Read `result.output` instead.

This name was deprecated in AI SDK 6, so if you already migrated to `output`, no changes are needed. Otherwise, update both the call options and any result access:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

experimental_output: Output.object({



4

schema: recipeSchema,



5

}),



6

prompt: 'Generate a recipe.',



7

});



8



9

console.log(result.experimental_output);
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

output: Output.object({



4

schema: recipeSchema,



5

}),



6

prompt: 'Generate a recipe.',



7

});



8



9

console.log(result.output);
```

#### [`CallSettings` Renamed to `LanguageModelCallOptions` and `RequestOptions`](#callsettings-renamed-to-languagemodelcalloptions-and-requestoptions)

`CallSettings` has been split into `LanguageModelCallOptions` (model-facing options) and `RequestOptions` (transport options). Replace usages in custom wrappers or helpers:

* `CallSettings` → `LanguageModelCallOptions & Omit<RequestOptions, 'timeout'>` (note: `CallSettings` never included `timeout`)

The deprecated `CallSettings` type remains available in AI SDK 7.

#### [Stop Condition Helper Rename: `stepCountIs` -> `isStepCount`](#stop-condition-helper-rename-stepcountis---isstepcount)

Rename imports and usage in tool-loop stop conditions:

Before

```
1

import { stepCountIs } from 'ai';



2



3

stopWhen: stepCountIs(3);
```

After

```
1

import { isStepCount } from 'ai';



2



3

stopWhen: isStepCount(3);
```

### [Prompts and Step Preparation](#prompts-and-step-preparation)

#### [`system` Renamed to `instructions`](#system-renamed-to-instructions)

The top-level prompt option for system instructions has been renamed from
`system` to `instructions`.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

system: 'You are a helpful assistant.',



4

prompt: 'Hello!',



5

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

instructions: 'You are a helpful assistant.',



4

prompt: 'Hello!',



5

});
```

This applies to AI SDK functions that accept `prompt` or `messages`, including
`generateText`, `streamText`, `generateObject`, `streamObject`, and `streamUI`.

The same rename applies to `prepareStep` results for `generateText` and
`streamText`, and to the options passed into `experimental_repairToolCall`:

AI SDK 6

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello!',



4

prepareStep: () => ({



5

system: 'Use concise answers for this step.',



6

}),



7

});
```

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello!',



4

prepareStep: () => ({



5

instructions: 'Use concise answers for this step.',



6

}),



7

});
```

The `system` option is still accepted as a deprecated fallback. When both
`instructions` and `system` are provided, `instructions` takes precedence.

#### [`prepareStep` Instructions Carry Forward](#preparestep-instructions-carry-forward)

In AI SDK 7, instructions returned from `prepareStep` are used in future steps
until `prepareStep` returns another `instructions` or `system` override. This
matches how `messages` returned from `prepareStep` carry forward.

In AI SDK 6, `prepareStep` instruction overrides only applied to the current
step. Later steps fell back to the top-level `system` instructions unless they
returned their own override.

If your `prepareStep` logic depends on one-step-only instruction overrides,
return the desired instructions for each step explicitly:

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

instructions: 'Use the default behavior.',



4

prompt: 'Hello!',



5

prepareStep: ({ stepNumber, initialInstructions }) => ({



6

instructions:



7

stepNumber === 0



8

? 'Use special instructions for the first step.'



9

: initialInstructions,



10

}),



11

});
```

The `prepareStep` callback receives both `instructions`, which is the current
instruction state for the step, and `initialInstructions`, which is the
top-level instruction value from the original call.

If your tool call repair function forwards the current system instructions to
another model call, read and pass `instructions` instead of `system`:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

tools,



4

prompt: 'Hello!',



5

experimental_repairToolCall: async ({ system, messages }) => {



6

return repairWithModel({ system, messages });



7

},



8

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

tools,



4

prompt: 'Hello!',



5

experimental_repairToolCall: async ({ instructions, messages }) => {



6

return repairWithModel({ instructions, messages });



7

},



8

});
```

Lifecycle callback events for `generateText`, `streamText`, and agents also use
`instructions` instead of `system`:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

experimental_onStart: ({ system }) => {



5

console.log(system);



6

},



7

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onStart: ({ instructions }) => {



5

console.log(instructions);



6

},



7

});
```

#### [Prompt Messages: System Messages in `prompt` or `messages` Are Rejected by Default](#prompt-messages-system-messages-in-prompt-or-messages-are-rejected-by-default)

AI SDK 7 rejects system messages in the `prompt` or `messages` fields by default. System instructions should usually be passed with the top-level `instructions` option.

This can break older persisted chats or custom prompt arrays that include `{ role: 'system' }` messages:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

messages: [



4

{ role: 'system', content: 'You are a helpful assistant.' },



5

{ role: 'user', content: 'Hello!' },



6

],



7

});
```

Move system instructions to the `instructions` option when possible:

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

instructions: 'You are a helpful assistant.',



4

messages: [{ role: 'user', content: 'Hello!' }],



5

});
```

If you need to keep existing chat histories that already contain system messages, opt in to the previous behavior with `allowSystemInMessages: true`:

Only use `allowSystemInMessages` for trusted messages. If users can submit or
edit these messages, they could inject a system message that overrides or sets
the system prompt. In most cases, system instructions should only be set by
trusted server-side code through the `instructions` property.

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

allowSystemInMessages: true,



4

messages: persistedMessages,



5

});
```

This applies to AI SDK functions that accept `prompt` or `messages`, including `generateText`, `streamText`, `generateObject`, `streamObject`, and `streamUI`.

#### [Remove Deprecated `experimental_prepareStep` Option](#remove-deprecated-experimental_preparestep-option)

The deprecated `experimental_prepareStep` option has been removed in AI SDK 7. Replace all remaining usages with `prepareStep`.

This option was deprecated in AI SDK 5, so if you already migrated to `prepareStep`, no changes are needed. Otherwise, update `generateText` calls:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

tools: { weather },



4

experimental_prepareStep: ({ stepNumber }) => {



5

console.log('Preparing step', stepNumber);



6

return {



7

activeTools: ['weather'],



8

};



9

},



10

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

tools: { weather },



4

prepareStep: ({ stepNumber }) => {



5

console.log('Preparing step', stepNumber);



6

return {



7

activeTools: ['weather'],



8

};



9

},



10

});
```

#### [`prepareStep` Message Overrides Carry Forward](#preparestep-message-overrides-carry-forward)

When `prepareStep` returns `messages`, those messages are now used as the base for subsequent steps. The next step receives those messages plus the response messages from the previous step.

In AI SDK 6, a `messages` override only applied to the current step. To keep that behavior, rebuild the current step's messages from `initialMessages` and `responseMessages` inside `prepareStep`:

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

tools: { weather },



4

prepareStep: ({ initialMessages, responseMessages }) => {



5

return {



6

messages: [



7

...initialMessages,



8

...responseMessages,



9

// add any one-step-only message changes here



10

],



11

};



12

},



13

});
```

### [Lifecycle Events](#lifecycle-events)

#### [`experimental_onStart` Renamed to `onStart`](#experimental_onstart-renamed-to-onstart)

The generation start callback for `generateText`, `streamText`, and agents has
been renamed from `experimental_onStart` to `onStart`.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

experimental_onStart: () => {



5

console.log('Generation started');



6

},



7

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onStart: () => {



5

console.log('Generation started');



6

},



7

});
```

#### [`experimental_onStepStart` Renamed to `onStepStart`](#experimental_onstepstart-renamed-to-onstepstart)

The per-step start callback for `generateText`, `streamText`, and agents has
been renamed from `experimental_onStepStart` to `onStepStart`.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

experimental_onStepStart: ({ stepNumber }) => {



5

console.log(`Step ${stepNumber} started`);



6

},



7

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onStepStart: ({ stepNumber }) => {



5

console.log(`Step ${stepNumber} started`);



6

},



7

});
```

#### [`onFinish` Renamed to `onEnd`](#onfinish-renamed-to-onend)

The final lifecycle callback for `generateText`, `streamText`, and agents has
been renamed from `onFinish` to `onEnd`.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onFinish: ({ text }) => {



5

console.log(text);



6

},



7

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onEnd: ({ text }) => {



5

console.log(text);



6

},



7

});
```

The same rename applies to `streamText`, `Agent.generate()`,
`Agent.stream()`, and `ToolLoopAgent` settings. The `onFinish` option is still
accepted as a deprecated alias. When both `onEnd` and `onFinish` are provided,
`onEnd` takes precedence.

#### [`onStepFinish` Renamed to `onStepEnd`](#onstepfinish-renamed-to-onstepend)

The per-step lifecycle callback has been renamed from `onStepFinish` to
`onStepEnd`.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onStepFinish: ({ stepNumber, usage }) => {



5

console.log(`Step ${stepNumber} used ${usage.totalTokens} tokens`);



6

},



7

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

onStepEnd: ({ stepNumber, usage }) => {



5

console.log(`Step ${stepNumber} used ${usage.totalTokens} tokens`);



6

},



7

});
```

This applies to `generateText`, `streamText`, `generateObject`,
`streamObject`, agents, workflow agents, and UI message stream helpers.
Telemetry integrations should implement `onStepEnd`.

The `onStepFinish` option is still accepted as a deprecated alias for
user-facing callbacks. When both `onStepEnd` and `onStepFinish` are provided,
`onStepEnd` takes precedence.

#### [Embed Callbacks](#embed-callbacks)

The per-call callback option for completed `embed` and `embedMany` operations has been renamed from `experimental_onFinish` to `onEnd`.

AI SDK 6

```
1

const result = await embed({



2

model: yourEmbeddingModel,



3

value,



4

experimental_onFinish(event) {



5

console.log('Embedding finished:', event.usage.tokens);



6

},



7

});
```

AI SDK 7

```
1

const result = await embed({



2

model: yourEmbeddingModel,



3

value,



4

onEnd(event) {



5

console.log('Embedding ended:', event.usage.tokens);



6

},



7

});
```

#### [Rerank Callback](#rerank-callback)

The per-call callback option for completed `rerank` operations has been renamed from `experimental_onFinish` to `onEnd`.

AI SDK 6

```
1

const result = await rerank({



2

model: yourRerankingModel,



3

documents,



4

query,



5

experimental_onFinish(event) {



6

console.log('Rerank finished:', event.ranking.length);



7

},



8

});
```

AI SDK 7

```
1

const result = await rerank({



2

model: yourRerankingModel,



3

documents,



4

query,



5

onEnd(event) {



6

console.log('Rerank ended:', event.ranking.length);



7

},



8

});
```

### [Usage and Result Shape Changes](#usage-and-result-shape-changes)

#### [`cachedInputTokens` and `reasoningTokens` Removed from `LanguageModelUsage`](#cachedinputtokens-and-reasoningtokens-removed-from-languagemodelusage)

The deprecated top-level `cachedInputTokens` and `reasoningTokens` fields have been removed from `LanguageModelUsage`.

Use `inputTokenDetails.cacheReadTokens` and `outputTokenDetails.reasoningTokens` instead:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

});



5



6

console.log(result.usage.cachedInputTokens);



7

console.log(result.usage.reasoningTokens);
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello!',



4

});



5



6

console.log(result.usage.inputTokenDetails.cacheReadTokens);



7

console.log(result.usage.outputTokenDetails.reasoningTokens);
```

### [Telemetry](#telemetry)

#### [OpenTelemetry Moved to `@ai-sdk/otel`](#opentelemetry-moved-to-ai-sdkotel)

OpenTelemetry span collection is no longer built into the `ai` package. To continue receiving OpenTelemetry traces, you must install the new `@ai-sdk/otel` package and register the `OpenTelemetry` instance globally.

```
1

pnpm install @ai-sdk/otel
```

Previously, OpenTelemetry spans were emitted automatically when `experimental_telemetry` was enabled:

AI SDK 6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

prompt: 'Hello',



6

experimental_telemetry: { isEnabled: true },



7

});
```

Now, you must install `@ai-sdk/otel` and register the `OpenTelemetry` instance once at application startup. For Next.js, place this in your `instrumentation.ts` file alongside your OpenTelemetry provider setup:

instrumentation

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3



4

registerTelemetry(new OpenTelemetry());



5



6

// ... your OpenTelemetry provider setup (e.g. registerOTel, NodeTracerProvider)
```

For Node.js applications (without Next.js), register the integration at the top level of your entry file.

This applies to all AI SDK functions that accept `experimental_telemetry`, including `generateText`, `streamText`, `ToolLoopAgent`, `embed`, `embedMany`, and `rerank`.

#### [Enabled by Default When an Integration Is Registered](#enabled-by-default-when-an-integration-is-registered)

In AI SDK 6, telemetry was opt-in — you had to set `experimental_telemetry: { isEnabled: true }` on every call to emit events. In AI SDK 7, telemetry is opt-out: once you register a telemetry integration (for example `OpenTelemetry` or `DevToolsTelemetry`), all AI SDK calls emit telemetry events by default.

AI SDK 6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

prompt: 'Hello',



6

experimental_telemetry: { isEnabled: true },



7

});
```

AI SDK 7

```
1

import { generateText } from 'ai';



2

import { registerTelemetry } from 'ai';



3

import { OpenTelemetry } from '@ai-sdk/otel';



4



5

registerTelemetry(new OpenTelemetry());



6



7

const result = await generateText({



8

model: yourModel,



9

prompt: 'Hello',



10

});
```

You can safely remove `experimental_telemetry: { isEnabled: true }` from all of your calls. If you are already passing other fields like `functionId` or `integrations`, keep them — only `isEnabled: true` is redundant:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello',



4

experimental_telemetry: {



5

isEnabled: true,



6

functionId: 'my-awesome-function',



7

},



8

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello',



4

experimental_telemetry: {



5

functionId: 'my-awesome-function',



6

},



7

});
```

To opt out of telemetry for a specific call, set `isEnabled: false`:

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello',



4

experimental_telemetry: { isEnabled: false },



5

});
```

To disable telemetry globally, do not register any telemetry integrations.

This applies to all AI SDK functions that accept `experimental_telemetry`, including `generateText`, `streamText`, `ToolLoopAgent`, `embed`, `embedMany`, and `rerank`.

#### [`tracer` Property Removed from `experimental_telemetry`](#tracer-property-removed-from-experimental_telemetry)

The `tracer` property on `experimental_telemetry` has been removed. If you were passing a custom OpenTelemetry `Tracer`, pass it to the `OpenTelemetry` constructor instead:

AI SDK 6

```
1

import { generateText } from 'ai';



2

import { trace } from '@opentelemetry/api';



3



4

const result = await generateText({



5

model: yourModel,



6

prompt: 'Hello',



7

experimental_telemetry: {



8

isEnabled: true,



9

tracer: trace.getTracer('my-app'),



10

},



11

});
```

AI SDK 7

```
1

import { registerTelemetry } from 'ai';



2

import { OpenTelemetry } from '@ai-sdk/otel';



3

import { trace } from '@opentelemetry/api';



4



5

registerTelemetry(



6

new OpenTelemetry({



7

tracer: trace.getTracer('my-app'),



8

}),



9

);
```

This applies to all AI SDK functions that accept `experimental_telemetry`, including `streamText`, `generateObject`, `streamObject`, `embed`, and `embedMany`.

If you were not passing a custom `tracer` (relying on the default global tracer), no changes are needed — the `OpenTelemetry` is registered globally by default and uses `trace.getTracer('ai')` when no custom tracer is provided.

#### [`experimental_telemetry` Renamed to `telemetry`](#experimental_telemetry-renamed-to-telemetry)

The telemetry option has graduated out of experimental status and has been renamed to `telemetry`. The old name `experimental_telemetry` continues to work as a deprecated alias in AI SDK 7 and will be removed in a future major release.

AI SDK 6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

prompt: 'Hello',



6

experimental_telemetry: {



7

functionId: 'story-agent',



8

},



9

});
```

AI SDK 7

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: yourModel,



5

prompt: 'Hello',



6

telemetry: {



7

functionId: 'story-agent',



8

},



9

});
```

This applies to all AI SDK functions and agents that accept telemetry configuration, including `generateText`, `streamText`, `generateObject`, `streamObject`, `embed`, `embedMany`, `rerank`, `ToolLoopAgent`, and `WorkflowAgent`.

No behavior changes beyond the rename. You can migrate incrementally — mixed usage of `telemetry` and `experimental_telemetry` in the same codebase is supported during the deprecation window.

#### [`onRerankFinish` Renamed to `onRerankEnd`](#onrerankfinish-renamed-to-onrerankend)

The telemetry integration callback for individual reranking model calls has been renamed from `onRerankFinish` to `onRerankEnd`.

This also applies to the `type` field emitted on `AI_SDK_TELEMETRY_TRACING_CHANNEL`: tracing-channel subscribers now receive `onRerankEnd` instead of `onRerankFinish`.

Update telemetry integrations and tracing-channel subscribers to use `onRerankEnd`.

AI SDK 6

```
1

import type { Telemetry } from 'ai';



2



3

const telemetry: Telemetry = {



4

onRerankFinish(event) {



5

console.log('Rerank finished:', event.ranking.length);



6

},



7

};
```

AI SDK 7

```
1

import type { Telemetry } from 'ai';



2



3

const telemetry: Telemetry = {



4

onRerankEnd(event) {



5

console.log('Rerank ended:', event.ranking.length);



6

},



7

};
```

#### [`onEmbedFinish` Renamed to `onEmbedEnd`](#onembedfinish-renamed-to-onembedend)

The telemetry integration callback for individual embedding model calls has been renamed from `onEmbedFinish` to `onEmbedEnd`.

This also applies to the `type` field emitted on `AI_SDK_TELEMETRY_TRACING_CHANNEL`: tracing-channel subscribers now receive `onEmbedEnd` instead of `onEmbedFinish`.

Update telemetry integrations and tracing-channel subscribers to use `onEmbedEnd`.

AI SDK 6

```
1

import type { Telemetry } from 'ai';



2



3

const telemetry: Telemetry = {



4

onEmbedFinish(event) {



5

console.log('Embedding finished:', event.embeddings.length);



6

},



7

};
```

AI SDK 7

```
1

import type { Telemetry } from 'ai';



2



3

const telemetry: Telemetry = {



4

onEmbedEnd(event) {



5

console.log('Embedding ended:', event.embeddings.length);



6

},



7

};
```

### [Streaming and Include Options](#streaming-and-include-options)

#### [`StreamTextResult.fullStream` Renamed to `stream`](#streamtextresultfullstream-renamed-to-stream)

The full event stream returned by `streamText` has been renamed from
`fullStream` to `stream`.

AI SDK 6

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello!',



4

});



5



6

for await (const part of result.fullStream) {



7

console.log(part);



8

}
```

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello!',



4

});



5



6

for await (const part of result.stream) {



7

console.log(part);



8

}
```

The `fullStream` property is still available as a deprecated alias for
`stream`.

#### [`streamText` `onChunk` Receives All Stream Parts](#streamtext-onchunk-receives-all-stream-parts)

In AI SDK 7, `streamText` calls `onChunk` for every `TextStreamPart` emitted by
the stream. In AI SDK 6, `onChunk` only received a subset of stream parts such as
text deltas, reasoning deltas, sources, tool calls, tool input deltas, tool
results, custom parts, and raw chunks.

Update handlers that assume the old subset to guard the chunk types they process:

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello',



4

onChunk({ chunk }) {



5

if (chunk.type === 'text-delta') {



6

console.log(chunk.text);



7

}



8

},



9

});
```

`onChunk` can now also receive lifecycle, boundary, and terminal parts such as
`start`, `start-step`, `text-start`, `text-end`, `reasoning-start`,
`reasoning-end`, `tool-input-end`, `finish-step`, `finish`, `abort`, and
`error`.

#### [Move `includeRawChunks` to `include.rawChunks`](#move-includerawchunks-to-includerawchunks)

The top-level `includeRawChunks` option on `streamText` is deprecated in AI SDK 7. Move it into the `include` options object as `rawChunks`.

AI SDK 6

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello',



4

includeRawChunks: true,



5

});
```

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello',



4

include: {



5

rawChunks: true,



6

},



7

});
```

The deprecated top-level option continues to work in AI SDK 7, so you can migrate incrementally.

#### [Rename `experimental_include` to `include`](#rename-experimental_include-to-include)

The `experimental_include` option for `generateText`, `streamText`, and
`ToolLoopAgent` is now stable and has been renamed to `include`.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello',



4

experimental_include: {



5

requestBody: false,



6

},



7

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello',



4

include: {



5

requestBody: false,



6

},



7

});
```

The deprecated `experimental_include` name continues to work for backwards
compatibility. If both `include` and `experimental_include` are provided,
`include` takes precedence.

#### [Request and Response Bodies Are Excluded by Default](#request-and-response-bodies-are-excluded-by-default)

In AI SDK 7, `generateText` and `streamText` no longer include request bodies in
step results by default. `generateText` also no longer includes response bodies
by default. This reduces memory usage, especially when prompts or provider
responses contain large payloads such as images or files.

If your application reads `result.request.body`, `step.request.body`,
`result.response.body`, or `step.response.body`, opt in with `include`.

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Hello',



4

include: {



5

requestBody: true,



6

responseBody: true,



7

},



8

});
```

For `streamText`, only `requestBody` is available:

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Hello',



4

include: {



5

requestBody: true,



6

},



7

});
```

### [Result Message Changes](#result-message-changes)

#### [Step Response Messages Are No Longer Accumulated](#step-response-messages-are-no-longer-accumulated)

In AI SDK 7, `step.response.messages` on each `StepResult` only contains the
response messages produced by that particular step.

In AI SDK 6, `step.response.messages` accumulated response messages from all
previous steps. If your application reads `step.response.messages` from an
intermediate or final step and expects the full assistant/tool message history,
use the top-level `result.responseMessages` instead.

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Use tools if needed',



4

tools,



5

stopWhen: isStepCount(5),



6

});



7



8

// Accumulated response messages from all steps:



9

const responseMessages = result.responseMessages;



10



11

// Response messages produced by each individual step:



12

const stepMessages = result.steps.map(step => step.response.messages);
```

If you specifically need to reconstruct response messages from step results,
flatten the per-step messages:

AI SDK 7

```
1

const responseMessages = result.steps.flatMap(step => step.response.messages);
```

Prefer `result.responseMessages` when you want the full response message history.
It also includes response messages produced before the first model step, such as
tool results from approved tool calls in the input messages.

### [Tools and Tool Execution](#tools-and-tool-execution)

#### [Tool Execution Callbacks](#tool-execution-callbacks)

The tool execution callback options for `generateText` and `streamText` have been renamed:

* `experimental_onToolCallStart` is now `onToolExecutionStart`
* `experimental_onToolCallFinish` is now `onToolExecutionEnd`

The old names continue to work as deprecated aliases in AI SDK 7 and will be removed in a future major release. They are only used as fallbacks when the new callback names are not provided.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

tools,



4

prompt: 'Hello',



5

experimental_onToolCallStart(event) {



6

console.log('Tool starting:', event.toolCall.toolName);



7

},



8

experimental_onToolCallFinish(event) {



9

console.log('Tool finished:', event.toolCall.toolName);



10

},



11

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

tools,



4

prompt: 'Hello',



5

onToolExecutionStart(event) {



6

console.log('Tool starting:', event.toolCall.toolName);



7

},



8

onToolExecutionEnd(event) {



9

console.log('Tool finished:', event.toolCall.toolName);



10

},



11

});
```

#### [Context: `experimental_context` Became Tool `context`, and Shared Runtime Data Moved to `runtimeContext`](#context-experimental_context-became-tool-context-and-shared-runtime-data-moved-to-runtimecontext)

In AI SDK 7, the tool callback option previously exposed as `experimental_context` has been renamed to `context` and is now stable.

The bigger behavioral change is that AI SDK now separates:

* tool-specific `context`, which is passed to tool callbacks from `toolsContext`
* shared generation/agent runtime data, which flows through `runtimeContext`

In AI SDK 6, tools often read from one generic runtime context object. In AI SDK 7, each tool gets its own scoped `context`, and you provide those values through `toolsContext`, keyed by tool name.

`tool()` infers the type of a tool's `context` from its `contextSchema`, so each tool only sees the fields declared for that specific tool.

In AI SDK 6, tool code often accessed `experimental_context` and had to cast it manually:

AI SDK 6

```
1

const weather = tool({



2

inputSchema: z.object({



3

location: z.string(),



4

}),



5

execute: async ({ location }, { experimental_context }) => {



6

const { weatherApiKey } = experimental_context as {



7

weatherApiKey: string;



8

};



9



10

return getWeather(location, weatherApiKey);



11

},



12

});
```

In AI SDK 7, rename `experimental_context` to `context`, declare the tool-specific context with `contextSchema`, and pass the per-tool values through `toolsContext`. The `execute` callback, approval callback, and tool input lifecycle hooks then receive a typed `context` automatically:

AI SDK 7

```
1

const weather = tool({



2

inputSchema: z.object({



3

location: z.string(),



4

}),



5

contextSchema: z.object({



6

apiKey: z.string(),



7

}),



8

execute: async ({ location }, { context: { apiKey } }) => {



9

return getWeather(location, apiKey);



10

},



11

});



12



13

const result = await generateText({



14

model: yourModel,



15

tools: { weather },



16

runtimeContext: {



17

requestId: 'req-123',



18

},



19

toolsContext: {



20

weather: {



21

apiKey: process.env.WEATHER_API_KEY!,



22

},



23

},



24

prepareStep: async ({ runtimeContext, toolsContext }) => {



25

console.log(runtimeContext.requestId);



26

console.log(toolsContext.weather.apiKey);



27



28

return {};



29

},



30

});
```

Use `runtimeContext` for shared generation or agent state that should be visible in `prepareStep`, events, and step results. Tool callbacks no longer read from that shared object. A tool's `context` now comes from its own entry in `toolsContext`, so it is limited to the fields that tool declared in `contextSchema`.

Potential breaking issues:

* If you still destructure `experimental_context` in tool callbacks, rename it to `context`.
* If you were previously passing one shared runtime object for both orchestration and tools, split it into `runtimeContext` and `toolsContext`.
* Move tool-specific values into `toolsContext` under the matching tool name.
* Rename shared top-level `context` usage to `runtimeContext` in `generateText`, `streamText`, and `ToolLoopAgent`.
* Rename `prepareStep` usage from `context` to `runtimeContext`.
* If a tool callback accesses fields that are not declared in its `contextSchema`, TypeScript will now report errors. Add those fields to that tool's schema.
* If you have helper types or wrappers that assumed `experimental_context` or `context` was `unknown`, update them to accept a generic `CONTEXT` type.
* If at least one tool declares `contextSchema`, `toolsContext` becomes required and only includes the tools that actually declare contextual data.
* If you were relying on every tool callback seeing the same full runtime object, move shared step data to `runtimeContext`, or explicitly provide the needed per-tool data in each tool's `toolsContext` entry.

#### [Migrate Deprecated `needsApproval` to `toolApproval`](#migrate-deprecated-needsapproval-to-toolapproval)

The `needsApproval` property on `tool()` and `dynamicTool()` is deprecated in
AI SDK 7 for `generateText`, `streamText`, and `ToolLoopAgent`.

Move approval logic to the `toolApproval` setting on the call or agent instead.
This keeps approval policy close to the generation or agent configuration and
lets you vary it by request.

AI SDK 6

```
1

const deleteFile = tool({



2

inputSchema: z.object({



3

path: z.string(),



4

}),



5

needsApproval: async ({ path }) => !path.startsWith('/tmp/'),



6

execute: async ({ path }) => {



7

await removeFile(path);



8

return { success: true };



9

},



10

});



11



12

await streamText({



13

model: yourModel,



14

tools: { deleteFile },



15

});
```

AI SDK 7

```
1

const deleteFile = tool({



2

inputSchema: z.object({



3

path: z.string(),



4

}),



5

execute: async ({ path }) => {



6

await removeFile(path);



7

return { success: true };



8

},



9

});



10



11

await streamText({



12

model: yourModel,



13

tools: { deleteFile },



14

toolApproval: {



15

deleteFile: async ({ path }) =>



16

path.startsWith('/tmp/') ? undefined : 'user-approval',



17

},



18

});
```

If you were using `needsApproval: true`, migrate it to
`toolApproval: { myTool: 'user-approval' }`. If you were using a
`needsApproval` function, move that logic into a per-tool
`SingleToolApprovalFunction` or a generic `toolApproval` callback. This
guidance applies to `generateText`, `streamText`, and `ToolLoopAgent`.

#### [Remove Deprecated `experimental_activeTools` Option](#remove-deprecated-experimental_activetools-option)

The deprecated `experimental_activeTools` option has been removed in AI SDK 7. Replace all remaining usages with `activeTools`.

This option was deprecated in AI SDK 5, so if you already migrated to `activeTools`, no changes are needed. Otherwise, update both `generateText` and `streamText` calls:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

tools: { weather },



4

experimental_activeTools: ['weather'],



5

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

tools: { weather },



4

activeTools: ['weather'],



5

});
```

#### [Remove Deprecated `ToolCallOptions` Type](#remove-deprecated-toolcalloptions-type)

The deprecated `ToolCallOptions` type has been removed in AI SDK 7. Replace all remaining usages with `ToolExecutionOptions`.

If you already migrated away from the deprecated name in AI SDK 6, no changes are needed. Otherwise, update imports and type references:

AI SDK 6

```
1

import { ToolCallOptions } from 'ai';



2



3

function executeWithOptions(options: ToolCallOptions) {



4

// ...



5

}
```

AI SDK 7

```
1

import { ToolExecutionOptions } from 'ai';



2



3

function executeWithOptions(options: ToolExecutionOptions) {



4

// ...



5

}
```

### [UI Messages](#ui-messages)

#### [Remove Deprecated `isToolOrDynamicToolUIPart` Function](#remove-deprecated-istoolordynamictooluipart-function)

The deprecated `isToolOrDynamicToolUIPart` function has been removed in AI SDK 7. Replace all remaining usages with `isToolUIPart`.

If you already migrated away from the deprecated name in AI SDK 6, no changes are needed. Otherwise, update imports and calls:

AI SDK 6

```
1

import { isToolOrDynamicToolUIPart } from 'ai';



2



3

if (isToolOrDynamicToolUIPart(part)) {



4

console.log('Tool part found');



5

}
```

AI SDK 7

```
1

import { isToolUIPart } from 'ai';



2



3

if (isToolUIPart(part)) {



4

console.log('Tool part found');



5

}
```

### [Tool and Message Content Parts](#tool-and-message-content-parts)

#### [Remove Deprecated `media` Content Part Type](#remove-deprecated-media-content-part-type)

The deprecated tool result content part of `{ type: 'media' }` has been removed in AI SDK 7.

Use `{ type: 'file-data' }` for all inline file content, including images.

#### [Tool Result Content: Migrate Away From `image-*` and `file-*` variants to `file`](#tool-result-content-migrate-away-from-image--and-file--variants-to-file)

All `image-*` and legacy `file-*` content part types for `toModelOutput` results are deprecated in AI SDK 7 in favor of a single canonical `file` variant that mirrors the top-level `FilePart` shape. Auto-migration is applied at runtime, so existing tool outputs continue to work without code changes. However, updating to the new shape is recommended.

The new shape carries a tagged `data` discriminated union, and it always has `mediaType`:

* `{ type: 'file-data', data, mediaType, filename? }` → `{ type: 'file', mediaType, filename, data: { type: 'data', data } }`
* `{ type: 'file-url', url, mediaType }` → `{ type: 'file', mediaType, data: { type: 'url', url: new URL(url) } }`
* `{ type: 'file-reference', providerReference }` → `{ type: 'file', mediaType, data: { type: 'reference', reference: providerReference } }`

Images are just files with an image media type, so the `image-*` aliases collapse into the same shape — pass `mediaType: 'image'` (or a more specific `image/*` subtype) instead:

* `{ type: 'image-data', data, mediaType }` → `{ type: 'file', mediaType, data: { type: 'data', data } }`
* `{ type: 'image-url', url }` → `{ type: 'file', mediaType: 'image', data: { type: 'url', url: new URL(url) } }`
* `{ type: 'image-file-reference', providerReference }` → `{ type: 'file', mediaType: 'image', data: { type: 'reference', reference: providerReference } }`

The `-id` content part types (`file-id` and `image-file-id`) are also generally deprecated in favor of the `reference` data shape, which carries a full `ProviderReference` (a provider-to-file-ID map like `{ openai: 'file_123', anthropic: 'file_abc' }`) that lets the same logical file be reused across providers. The single-ID `-id` variants required the runtime to know which provider the ID belonged to; the explicit reference shape removes that ambiguity:

* `{ type: 'file-id', fileId }` → `{ type: 'file', mediaType, data: { type: 'reference', reference: { [provider]: fileId } } }`
* `{ type: 'image-file-id', fileId }` → `{ type: 'file', mediaType: 'image', data: { type: 'reference', reference: { [provider]: fileId } } }`

`mediaType` on the new `file` variant accepts either a full IANA type (e.g. `'image/png'`) or just a top-level segment (e.g. `'image'`, `'audio'`, `'video'`, `'text'`). When only a top-level segment is provided, the subtype is auto-detected from inline bytes where possible. Update parsing/validation and discriminated unions to handle the single canonical `file` variant.

#### [Message Parts: Migrate Away From Deprecated `image` Part](#message-parts-migrate-away-from-deprecated-image-part)

The `{ type: 'image', image, mediaType? }` user-message content part is deprecated. Use `{ type: 'file', data, mediaType }` with an image `mediaType` instead.

AI SDK 6

```
1

{ type: 'image', image: bytes }
```

AI SDK 7

```
1

{ type: 'file', mediaType: 'image', data: bytes }
```

`mediaType` on `FilePart` now accepts either a full IANA type (e.g. `'image/png'`) or just a top-level segment (e.g. `'image'`). When only a top-level segment is provided, the subtype is auto-detected from inline bytes where possible.

#### [Message Parts: Handle New `reasoning-file` Content Type](#message-parts-handle-new-reasoning-file-content-type)

Some models can now return files as part of their reasoning trace, separate from regular output files. These files, which would have previously were using the `file` type, are now in a distinct `reasoning-file` type.

Update all exhaustive part handling (TypeScript unions, `switch` statements, runtime validators, renderers, serializers) to support `type: 'reasoning-file'`.

Also audit any code that reads generated files from `result.files` or `step.files`: files referenced in reasoning are now represented as `reasoning-file` parts in `content` / `reasoning`. In practice, this should rarely require an update because models usually reference the same file in their reasoning that they later output as regular content. Prior to supporting `reasoning-file` as a distinct type, this would result in the same files appearing in `result.files` or `step.files` as a duplicate.

### [Reasoning](#reasoning)

#### [Reasoning Configuration: Remove Overlapping Settings](#reasoning-configuration-remove-overlapping-settings)

The new top-level `reasoning` option is the provider-agnostic way to control reasoning effort.

When migrating to the top-level `reasoning` option, remove overlapping reasoning settings from `providerOptions`.

If both are present, provider-specific reasoning settings in `providerOptions` take precedence, which can silently bypass your new top-level `reasoning` configuration.

### [Multi-Step Result Shape](#multi-step-result-shape)

#### [`generateText` and `streamText` `usage` Now Includes All Steps](#generatetext-and-streamtext-usage-now-includes-all-steps)

The `usage` property on `generateText` and `streamText` results now returns the total token usage across all steps. This matches what `totalUsage` previously represented.

Use `finalStep.usage` to read the previous `usage` behavior, which only returned token usage from the final step:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Write a haiku, then revise it.',



4

stopWhen: stepCountIs(2),



5

});



6



7

console.log(result.usage);



8

console.log(result.totalUsage);
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Write a haiku, then revise it.',



4

stopWhen: isStepCount(2),



5

});



6



7

console.log(result.finalStep.usage); // final step only



8

console.log(result.usage); // all steps
```

`totalUsage` is deprecated. Replace `result.totalUsage` with `result.usage`.

#### [`generateText` and `streamText` Result Properties Now Include All Steps](#generatetext-and-streamtext-result-properties-now-include-all-steps)

The top-level `content`, `toolCalls`, `staticToolCalls`, `dynamicToolCalls`,
`toolResults`, `staticToolResults`, `dynamicToolResults`, `files`, `sources`,
and `warnings` properties on `generateText` and `streamText` results now return
values accumulated across every step.

In AI SDK 6, these properties only returned values from the final step. Use
`finalStep` to read the previous behavior:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Use a tool, then summarize the result.',



4

stopWhen: stepCountIs(2),



5

});



6



7

console.log(result.toolCalls);



8

console.log(result.toolResults);



9

console.log(result.files);



10

console.log(result.sources);



11

console.log(result.warnings);



12

console.log(result.content);
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Use a tool, then summarize the result.',



4

stopWhen: isStepCount(2),



5

});



6



7

console.log(result.finalStep.toolCalls); // final step only



8

console.log(result.finalStep.toolResults); // final step only



9

console.log(result.finalStep.files); // final step only



10

console.log(result.finalStep.sources); // final step only



11

console.log(result.finalStep.warnings); // final step only



12

console.log(result.finalStep.content); // final step only



13

console.log(result.toolCalls); // all steps



14

console.log(result.toolResults); // all steps



15

console.log(result.files); // all steps



16

console.log(result.sources); // all steps



17

console.log(result.warnings); // all steps



18

console.log(result.content); // all steps
```

For `streamText`, await `finalStep` first when you need final-step-only values:

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Use a tool, then summarize the result.',



4

stopWhen: isStepCount(2),



5

});



6



7

const finalStep = await result.finalStep;



8



9

console.log(finalStep.toolCalls); // final step only



10

console.log(finalStep.toolResults); // final step only



11

console.log(finalStep.files); // final step only



12

console.log(finalStep.sources); // final step only



13

console.log(finalStep.warnings); // final step only



14

console.log(finalStep.content); // final step only



15

console.log(await result.toolCalls); // all steps



16

console.log(await result.toolResults); // all steps



17

console.log(await result.files); // all steps



18

console.log(await result.sources); // all steps



19

console.log(await result.warnings); // all steps



20

console.log(await result.content); // all steps
```

#### [Final-Step Result Properties Moved to `finalStep`](#final-step-result-properties-moved-to-finalstep)

The top-level `reasoning`, `reasoningText`, `request`, `response`, and `providerMetadata` result properties on `generateText` and `streamText` are deprecated in AI SDK 7.

Use `result.finalStep` when you need final-step reasoning or final-step metadata:

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Write a haiku, then revise it.',



4

stopWhen: stepCountIs(2),



5

});



6



7

console.log(result.reasoningText);



8

console.log(result.request.body);



9

console.log(result.response.headers);



10

console.log(result.providerMetadata?.anthropic);
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Write a haiku, then revise it.',



4

stopWhen: isStepCount(2),



5

});



6



7

console.log(result.finalStep.reasoningText);



8

console.log(result.finalStep.request.body);



9

console.log(result.finalStep.response.headers);



10

console.log(result.finalStep.providerMetadata?.anthropic);
```

For `streamText`, await `finalStep` first:

AI SDK 7

```
1

const result = streamText({



2

model: yourModel,



3

prompt: 'Write a haiku, then revise it.',



4

stopWhen: isStepCount(2),



5

});



6



7

const finalStep = await result.finalStep;



8



9

console.log(finalStep.reasoningText);



10

console.log(finalStep.request.body);



11

console.log(finalStep.response.headers);
```

The deprecated top-level aliases continue to work in AI SDK 7 so you can migrate incrementally.

#### [`generateText` and `streamText` `onEnd` Result Properties Changed](#generatetext-and-streamtext-onend-result-properties-changed)

The `onEnd` callback for `generateText`, `streamText`, and agents follows
the same result property changes as `generateText` and `streamText` results:

* `usage` now contains usage across all steps. `totalUsage` is deprecated; use
  `usage` instead.
* `content`, `toolCalls`, `toolResults`, `files`, `sources`, and `warnings` now
  contain values from all steps.
* Final-step-only properties are available on `finalStep`. The top-level
  `reasoning`, `reasoningText`, `request`, `response`, and `providerMetadata`
  properties are deprecated.

AI SDK 6

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Use a tool, then summarize the result.',



4

stopWhen: stepCountIs(2),



5

onFinish(event) {



6

console.log(event.usage); // final step only



7

console.log(event.totalUsage); // all steps



8

console.log(event.toolCalls); // final step only



9

console.log(event.providerMetadata);



10

},



11

});
```

AI SDK 7

```
1

const result = await generateText({



2

model: yourModel,



3

prompt: 'Use a tool, then summarize the result.',



4

stopWhen: isStepCount(2),



5

onEnd(event) {



6

console.log(event.finalStep.usage); // final step only



7

console.log(event.usage); // all steps



8

console.log(event.finalStep.toolCalls); // final step only



9

console.log(event.toolCalls); // all steps



10

console.log(event.finalStep.providerMetadata);



11

},



12

});
```

The deprecated top-level aliases on the `onEnd` event continue to work in AI
SDK 7 so you can migrate incrementally.

### [Stream Response Helpers](#stream-response-helpers)

#### [`streamText` Response Helpers Deprecated — Use Stateless Helpers](#streamtext-response-helpers-deprecated--use-stateless-helpers)

The `toUIMessageStream`, `toUIMessageStreamResponse`, `pipeUIMessageStreamToResponse`, `toTextStreamResponse`, and `pipeTextStreamToResponse` methods on the `streamText` result are now deprecated. They still work in v7 (with deprecation warnings) and will be removed in the next major release.

The equivalent stateless helpers live on the top-level `'ai'` export. Use them directly so the same transformation can be composed over any `stream` / `textStream` — not just a `streamText` result.

**UI message stream**

AI SDK 6

```
1

const result = streamText({ model, prompt });



2



3

const uiStream = result.toUIMessageStream({



4

originalMessages,



5

generateMessageId,



6

onFinish,



7

});
```

AI SDK 7

```
1

import { streamText, toUIMessageStream } from 'ai';



2



3

const result = streamText({ model, prompt });



4



5

const uiStream = toUIMessageStream({



6

stream: result.stream,



7

generateMessageId,



8

originalMessages,



9

onFinish,



10

});
```

**UI message stream `Response`**

AI SDK 6

```
1

return result.toUIMessageStreamResponse({ originalMessages });
```

AI SDK 7

```
1

import { createUIMessageStreamResponse, toUIMessageStream } from 'ai';



2



3

const uiStream = toUIMessageStream({



4

stream: result.stream,



5

generateMessageId,



6

originalMessages,



7

onFinish,



8

});



9



10

return createUIMessageStreamResponse({



11

stream: uiStream,



12

});
```

**Pipe UI message stream to Node.js response**

AI SDK 6

```
1

result.pipeUIMessageStreamToResponse(response, { originalMessages });
```

AI SDK 7

```
1

import { pipeUIMessageStreamToResponse, toUIMessageStream } from 'ai';



2



3

const uiStream = toUIMessageStream({



4

stream: result.stream,



5

generateMessageId,



6

originalMessages,



7

onFinish,



8

});



9



10

pipeUIMessageStreamToResponse({



11

stream: uiStream,



12

response,



13

});
```

**Text stream `Response`**

AI SDK 6

```
1

return result.toTextStreamResponse();
```

AI SDK 7

```
1

import { createTextStreamResponse, toTextStream } from 'ai';



2



3

const textStream = toTextStream({



4

stream: result.stream,



5

});



6



7

return createTextStreamResponse({ stream: textStream });
```

**Pipe text stream to Node.js response**

AI SDK 6

```
1

result.pipeTextStreamToResponse(response);
```

AI SDK 7

```
1

import { pipeTextStreamToResponse, toTextStream } from 'ai';



2



3

const textStream = toTextStream({



4

stream: result.stream,



5

});



6



7

pipeTextStreamToResponse({ response, stream: textStream });
```

[MCP Package](#mcp-package)
---------------------------

### [MCP Transport: `redirect` Default Changed from `'follow'` to `'error'`](#mcp-transport-redirect-default-changed-from-follow-to-error)

The `redirect` option on `MCPTransportConfig` (used by both HTTP and SSE transports) now defaults to `'error'` instead of `'follow'`. This means HTTP redirects are rejected by default to prevent server-side request forgery (SSRF) attacks where an MCP server could redirect requests to unintended hosts.

If your MCP server relies on HTTP redirects, explicitly set `redirect: 'follow'` in your transport configuration:

AI SDK 6

```
1

const mcpClient = await createMCPClient({



2

transport: {



3

type: 'http',



4

url: 'https://your-server.com/mcp',



5

},



6

});
```

AI SDK 7

```
1

const mcpClient = await createMCPClient({



2

transport: {



3

type: 'http',



4

url: 'https://your-server.com/mcp',



5

redirect: 'follow',



6

},



7

});
```

If the MCP server you use does not issue redirects, no changes are needed — the new default is more secure.

[Vue Package](#vue-package)
---------------------------

### [`Chat` Class Deprecated in Favor of `useChat` Composable](#chat-class-deprecated-in-favor-of-usechat-composable)

The `Chat` class exported from `@ai-sdk/vue` is deprecated in AI SDK 7 in favor of the new `useChat` composable. `useChat` exposes reactive refs for `messages`, `status`, and `error`, and automatically recreates the underlying chat when its init object changes — so reactive inputs (a route param, a selected model, etc.) flow through without manual orchestration.

AI SDK 6

```
1

<script setup lang="ts">



2

import { Chat } from '@ai-sdk/vue';



3



4

const chat = new Chat({});



5

</script>



6



7

<template>



8

<div v-for="m in chat.messages" :key="m.id">



9

<!-- ... -->



10

</div>



11

<button @click="chat.sendMessage({ text: 'hi' })">Send</button>



12

</template>
```

AI SDK 7

```
1

<script setup lang="ts">



2

import { useChat } from '@ai-sdk/vue';



3



4

const { messages, sendMessage } = useChat({



5

id: chatId,



6

transport: new DefaultChatTransport({



7

api: `/api/chats/${chatId}`,



8

body: { model: model.value },



9

}),



10

});



11

</script>



12



13

<template>



14

<div v-for="m in messages" :key="m.id">



15

<!-- ... -->



16

</div>



17

<button @click="sendMessage({ text: 'hi' })">Send</button>



18

</template>
```

To make the init reactive (recreate the chat when its inputs change), pass a getter or ref:

AI SDK 7

```
1

const { messages, sendMessage } = useChat(() => ({



2

id: chatId.value,



3

transport: new DefaultChatTransport({



4

api: `/api/chats/${chatId.value}`,



5

body: { model: model.value },



6

}),



7

}));
```

The `Chat` class continues to work as a deprecated export, so you can migrate incrementally.

[OpenAI Provider](#openai-provider)
-----------------------------------

### [Responses Reasoning Summary Defaults to Detailed](#responses-reasoning-summary-defaults-to-detailed)

For the OpenAI Responses provider, setting `reasoning` or `providerOptions.openai.reasoningEffort` to a value other than `'none'` now defaults `providerOptions.openai.reasoningSummary` to `'detailed'`.

If you want to keep reasoning summaries disabled, set `providerOptions.openai.reasoningSummary` to `null`.

[Anthropic Provider](#anthropic-provider)
-----------------------------------------

### [`providerMetadata.anthropic.cacheCreationInputTokens` Removed](#providermetadataanthropiccachecreationinputtokens-removed)

The Anthropic-specific `cacheCreationInputTokens` field on `providerMetadata.anthropic` has been removed from the responses of `generateText` and `streamText` (as well as the `@ai-sdk/google-vertex/anthropic` sub-provider). This duplicated information that is already available on the standard, provider-agnostic `usage` object.

Use `result.usage.inputTokenDetails.cacheWriteTokens` to read the number of tokens written to the cache, and `result.usage.inputTokenDetails.cacheReadTokens` to read the number of tokens served from the cache:

AI SDK 6

```
1

const result = await generateText({



2

model: anthropic('claude-sonnet-4-5'),



3

messages: [



4

/* ... messages with cacheControl ... */



5

],



6

});



7



8

console.log(result.providerMetadata?.anthropic?.cacheCreationInputTokens);
```

AI SDK 7

```
1

const result = await generateText({



2

model: anthropic('claude-sonnet-4-5'),



3

messages: [



4

/* ... messages with cacheControl ... */



5

],



6

});



7



8

console.log(result.usage.inputTokenDetails.cacheWriteTokens);
```

If you need the raw Anthropic-shaped usage payload (including `cache_creation_input_tokens`, `cache_read_input_tokens`, `cache_creation`, `service_tier`, etc.), it is still available unchanged at `result.finalStep.providerMetadata?.anthropic?.usage`.

[Google Provider](#google-provider)
-----------------------------------

### [Renamed Types, Classes, and Functions: `GenerativeAI` Affix Removed](#renamed-types-classes-and-functions-generativeai-affix-removed)

Every type, class, and function in `@ai-sdk/google` that contained `GoogleGenerativeAI` has been renamed to use simply `Google` — for example, `createGoogleGenerativeAI` → `createGoogle` and `GoogleGenerativeAIProvider` → `GoogleProvider`.

The old names still work as deprecated aliases, but you should migrate to the new names, if you currently reference them.

The main entry point the `google` constant, remains unchanged, so if that's all you use from the provider, no changes are required.

[xAI Provider](#xai-provider)
-----------------------------

### [Default Model Now Uses the Responses API](#default-model-now-uses-the-responses-api)

In AI SDK 7, `xai(modelId)` (and `xai.languageModel(modelId)`) uses the xAI Responses API by default instead of the Chat Completions API. Both APIs were already available in AI SDK 6 via `xai.chat(modelId)` and `xai.responses(modelId)`; AI SDK 7 only changes which one `xai(modelId)` uses by default. To keep using the Chat Completions API, use `xai.chat(modelId)`.

AI SDK 6

```
1

// used the Chat Completions API



2

const model = xai('grok-4.3');
```

AI SDK 7

```
1

// now uses the Responses API



2

const model = xai('grok-4.3');



3



4

// use the Chat Completions API explicitly



5

const chatModel = xai.chat('grok-4.3');
```

[Migration Skill](#migration-skill)
-----------------------------------

Use the command below to add the migration skill and guide your agent

```
1

npx skills add vercel/ai --skill migrate-ai-sdk-v6-to-v7
```

[Previous

Versioning](/docs/migration-guides/versioning)[Next

Migrate AI SDK 5.x to 6.0](/docs/migration-guides/migration-guide-6-0)
