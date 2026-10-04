---
title: "Migrate AI SDK 3.4 to 4.0"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-4-0
section: migration-guides
crawled: 2026-09-20
---

# Migrate AI SDK 3.4 to 4.0

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-4-0

[Migration Guides](/docs/migration-guides)Migrate AI SDK 3.4 to 4.0


[Migrate AI SDK 3.4 to 4.0](#migrate-ai-sdk-34-to-40)
=====================================================

Check out the [AI SDK 4.0 release blog
post](https://vercel.com/blog/ai-sdk-4-0) for more information about the
release.

[Recommended Migration Process](#recommended-migration-process)
---------------------------------------------------------------

1. Backup your project. If you use a versioning control system, make sure all previous versions are committed.
2. [Migrate to AI SDK 3.4](/docs/migration-guides/migration-guide-3-4).
3. Upgrade to AI SDK 4.0.
4. Automatically migrate your code using [codemods](#codemods).
   > If you don't want to use codemods, we recommend resolving all deprecation warnings before upgrading to AI SDK 4.0.
5. Follow the breaking changes guide below.
6. Verify your project is working as expected.
7. Commit your changes.

[AI SDK 4.0 package versions](#ai-sdk-40-package-versions)
----------------------------------------------------------

You need to update the following packages to the following versions in your `package.json` file(s):

* `ai` package: `4.0.*`
* `ai-sdk@provider-utils` package: `2.0.*`
* `ai-sdk/*` packages: `1.0.*` (other `@ai-sdk` packages)

[Codemods](#codemods)
---------------------

The AI SDK provides Codemod transformations to help upgrade your codebase when a
feature is deprecated, removed, or otherwise changed.

Codemods are transformations that run on your codebase programmatically. They
allow you to easily apply many changes without having to manually go through
every file.

Codemods are intended as a tool to help you with the upgrade process. They may
not cover all of the changes you need to make. You may need to make additional
changes manually.

You can run all codemods provided as part of the 4.0 upgrade process by running
the following command from the root of your project:

```
1

npx @ai-sdk/codemod upgrade
```

To run only the v4 codemods:

```
1

npx @ai-sdk/codemod v4
```

Individual codemods can be run by specifying the name of the codemod:

```
1

npx @ai-sdk/codemod <codemod-name> <path>
```

For example, to run a specific v4 codemod:

```
1

npx @ai-sdk/codemod v4/replace-baseurl src/
```

See also the [table of codemods](#codemod-table). In addition, the latest set of
codemods can be found in the
[`@ai-sdk/codemod`](https://github.com/vercel/ai/tree/main/packages/codemod/src/codemods)
repository.

[Provider Changes](#provider-changes)
-------------------------------------

### [Removed `baseUrl` option](#removed-baseurl-option)

The `baseUrl` option has been removed from all providers. Please use the `baseURL` option instead.

AI SDK 3.4

```
1

const perplexity = createOpenAI({



2

// ...



3

baseUrl: 'https://api.perplexity.ai/',



4

});
```

AI SDK 4.0

```
1

const perplexity = createOpenAI({



2

// ...



3

baseURL: 'https://api.perplexity.ai/',



4

});
```

### [Anthropic Provider](#anthropic-provider)

#### [Removed `Anthropic` facade](#removed-anthropic-facade)

The `Anthropic` facade has been removed from the Anthropic provider.
Please use the `anthropic` object or the `createAnthropic` function instead.

AI SDK 3.4

```
1

const anthropic = new Anthropic({



2

// ...



3

});
```

AI SDK 4.0

```
1

const anthropic = createAnthropic({



2

// ...



3

});
```

#### [Removed `topK` setting](#removed-topk-setting)

There is no codemod available for this change. Please review and update your
code manually.

The model specific `topK` setting has been removed from the Anthropic provider.
You can use the standard `topK` setting instead.

AI SDK 3.4

```
1

const result = await generateText({



2

model: anthropic('claude-3-5-sonnet-latest', {



3

topK: 0.5,



4

}),



5

});
```

AI SDK 4.0

```
1

const result = await generateText({



2

model: anthropic('claude-3-5-sonnet-latest'),



3

topK: 0.5,



4

});
```

### [Google Generative AI Provider](#google-generative-ai-provider)

#### [Removed `Google` facade](#removed-google-facade)

The `Google` facade has been removed from the Google Generative AI provider.
Please use the `google` object or the `createGoogleGenerativeAI` function instead.

AI SDK 3.4

```
1

const google = new Google({



2

// ...



3

});
```

AI SDK 4.0

```
1

const google = createGoogleGenerativeAI({



2

// ...



3

});
```

#### [Removed `topK` setting](#removed-topk-setting-1)

There is no codemod available for this change. Please review and update your
code manually.

The model-specific `topK` setting has been removed from the Google Generative AI provider.
You can use the standard `topK` setting instead.

AI SDK 3.4

```
1

const result = await generateText({



2

model: google('gemini-1.5-flash', {



3

topK: 0.5,



4

}),



5

});
```

AI SDK 4.0

```
1

const result = await generateText({



2

model: google('gemini-1.5-flash'),



3

topK: 0.5,



4

});
```

### [Google Vertex Provider](#google-vertex-provider)

#### [Removed `topK` setting](#removed-topk-setting-2)

There is no codemod available for this change. Please review and update your
code manually.

The model-specific `topK` setting has been removed from the Google Vertex provider.
You can use the standard `topK` setting instead.

AI SDK 3.4

```
1

const result = await generateText({



2

model: vertex('gemini-1.5-flash', {



3

topK: 0.5,



4

}),



5

});
```

AI SDK 4.0

```
1

const result = await generateText({



2

model: vertex('gemini-1.5-flash'),



3

topK: 0.5,



4

});
```

### [Mistral Provider](#mistral-provider)

#### [Removed `Mistral` facade](#removed-mistral-facade)

The `Mistral` facade has been removed from the Mistral provider.
Please use the `mistral` object or the `createMistral` function instead.

AI SDK 3.4

```
1

const mistral = new Mistral({



2

// ...



3

});
```

AI SDK 4.0

```
1

const mistral = createMistral({



2

// ...



3

});
```

### [OpenAI Provider](#openai-provider)

#### [Removed `OpenAI` facade](#removed-openai-facade)

The `OpenAI` facade has been removed from the OpenAI provider.
Please use the `openai` object or the `createOpenAI` function instead.

AI SDK 3.4

```
1

const openai = new OpenAI({



2

// ...



3

});
```

AI SDK 4.0

```
1

const openai = createOpenAI({



2

// ...



3

});
```

### [LangChain Adapter](#langchain-adapter)

#### [Removed `toAIStream`](#removed-toaistream)

The `toAIStream` function has been removed from the LangChain adapter.
Please use the `toDataStream` function instead.

AI SDK 3.4

```
1

LangChainAdapter.toAIStream(stream);
```

AI SDK 4.0

```
1

LangChainAdapter.toDataStream(stream);
```

[AI SDK Core Changes](#ai-sdk-core-changes)
-------------------------------------------

### [`streamText` returns immediately](#streamtext-returns-immediately)

Instead of returning a Promise, the `streamText` function now returns immediately.
It is not necessary to await the result of `streamText`.

AI SDK 3.4

```
1

const result = await streamText({



2

// ...



3

});
```

AI SDK 4.0

```
1

const result = streamText({



2

// ...



3

});
```

### [`streamObject` returns immediately](#streamobject-returns-immediately)

Instead of returning a Promise, the `streamObject` function now returns immediately.
It is not necessary to await the result of `streamObject`.

AI SDK 3.4

```
1

const result = await streamObject({



2

// ...



3

});
```

AI SDK 4.0

```
1

const result = streamObject({



2

// ...



3

});
```

### [Remove roundtrips](#remove-roundtrips)

The `maxToolRoundtrips` and `maxAutomaticRoundtrips` options have been removed from the `generateText` and `streamText` functions.
Please use the `maxSteps` option instead.

The `roundtrips` property has been removed from the `GenerateTextResult` type.
Please use the `steps` property instead.

AI SDK 3.4

```
1

const { text, roundtrips } = await generateText({



2

maxToolRoundtrips: 1, // or maxAutomaticRoundtrips



3

// ...



4

});
```

AI SDK 4.0

```
1

const { text, steps } = await generateText({



2

maxSteps: 2,



3

// ...



4

});
```

### [Removed `nanoid` export](#removed-nanoid-export)

The `nanoid` export has been removed. Please use [`generateId`](/docs/reference/ai-sdk-core/generate-id) instead.

AI SDK 3.4

```
1

import { nanoid } from 'ai';
```

AI SDK 4.0

```
1

import { generateId } from 'ai';
```

### [Increased default size of generated IDs](#increased-default-size-of-generated-ids)

There is no codemod available for this change. Please review and update your
code manually.

The [`generateId`](/docs/reference/ai-sdk-core/generate-id) function now
generates 16-character IDs. The previous default was 7 characters.

This might e.g. require updating your database schema if you limit the length of
IDs.

AI SDK 4.0

```
1

import { generateId } from 'ai';



2



3

const id = generateId(); // now 16 characters
```

### [Removed `ExperimentalMessage` types](#removed-experimentalmessage-types)

The following types have been removed:

* `ExperimentalMessage` (use `ModelMessage` instead)
* `ExperimentalUserMessage` (use `CoreUserMessage` instead)
* `ExperimentalAssistantMessage` (use `CoreAssistantMessage` instead)
* `ExperimentalToolMessage` (use `CoreToolMessage` instead)

AI SDK 3.4

```
1

import {



2

ExperimentalMessage,



3

ExperimentalUserMessage,



4

ExperimentalAssistantMessage,



5

ExperimentalToolMessage,



6

} from 'ai';
```

AI SDK 4.0

```
1

import {



2

ModelMessage,



3

CoreUserMessage,



4

CoreAssistantMessage,



5

CoreToolMessage,



6

} from 'ai';
```

### [Removed `ExperimentalTool` type](#removed-experimentaltool-type)

The `ExperimentalTool` type has been removed. Please use the `CoreTool` type instead.

AI SDK 3.4

```
1

import { ExperimentalTool } from 'ai';
```

AI SDK 4.0

```
1

import { CoreTool } from 'ai';
```

### [Removed experimental AI function exports](#removed-experimental-ai-function-exports)

The following exports have been removed:

* `experimental_generateText` (use `generateText` instead)
* `experimental_streamText` (use `streamText` instead)
* `experimental_generateObject` (use `generateObject` instead)
* `experimental_streamObject` (use `streamObject` instead)

AI SDK 3.4

```
1

import {



2

experimental_generateText,



3

experimental_streamText,



4

experimental_generateObject,



5

experimental_streamObject,



6

} from 'ai';
```

AI SDK 4.0

```
1

import { generateText, streamText, generateObject, streamObject } from 'ai';
```

### [Removed AI-stream related methods from `streamText`](#removed-ai-stream-related-methods-from-streamtext)

The following methods have been removed from the `streamText` result:

* `toAIStream`
* `pipeAIStreamToResponse`
* `toAIStreamResponse`

Use the `toDataStream`, `pipeDataStreamToResponse`, and `toDataStreamResponse` functions instead.

AI SDK 3.4

```
1

const result = await streamText({



2

// ...



3

});



4



5

result.toAIStream();



6

result.pipeAIStreamToResponse(response);



7

result.toAIStreamResponse();
```

AI SDK 4.0

```
1

const result = streamText({



2

// ...



3

});



4



5

result.toDataStream();



6

result.pipeDataStreamToResponse(response);



7

result.toUIMessageStreamResponse();
```

### [Renamed "formatStreamPart" to "formatDataStreamPart"](#renamed-formatstreampart-to-formatdatastreampart)

The `formatStreamPart` function has been renamed to `formatDataStreamPart`.

AI SDK 3.4

```
1

formatStreamPart('text', 'Hello, world!');
```

AI SDK 4.0

```
1

formatDataStreamPart('text', 'Hello, world!');
```

### [Renamed "parseStreamPart" to "parseDataStreamPart"](#renamed-parsestreampart-to-parsedatastreampart)

The `parseStreamPart` function has been renamed to `parseDataStreamPart`.

AI SDK 3.4

```
1

const part = parseStreamPart(line);
```

AI SDK 4.0

```
1

const part = parseDataStreamPart(line);
```

### [Renamed `TokenUsage`, `CompletionTokenUsage` and `EmbeddingTokenUsage` types](#renamed-tokenusage-completiontokenusage-and-embeddingtokenusage-types)

The `TokenUsage`, `CompletionTokenUsage` and `EmbeddingTokenUsage` types have
been renamed to `LanguageModelUsage` (for the first two) and
`EmbeddingModelUsage` (for the last).

AI SDK 3.4

```
1

import { TokenUsage, CompletionTokenUsage, EmbeddingTokenUsage } from 'ai';
```

AI SDK 4.0

```
1

import { LanguageModelUsage, EmbeddingModelUsage } from 'ai';
```

### [Removed deprecated telemetry data](#removed-deprecated-telemetry-data)

There is no codemod available for this change. Please review and update your
code manually.

The following telemetry data values have been removed:

* `ai.finishReason` (now in `ai.response.finishReason`)
* `ai.result.object` (now in `ai.response.object`)
* `ai.result.text` (now in `ai.response.text`)
* `ai.result.toolCalls` (now in `ai.response.toolCalls`)
* `ai.stream.msToFirstChunk` (now in `ai.response.msToFirstChunk`)

This change will apply to observability providers and any scripts or automation that you use for processing telemetry data.

### [Provider Registry](#provider-registry)

#### [Removed experimental\_Provider, experimental\_ProviderRegistry, and experimental\_ModelRegistry](#removed-experimental_provider-experimental_providerregistry-and-experimental_modelregistry)

The `experimental_Provider` interface, `experimental_ProviderRegistry` interface, and `experimental_ModelRegistry` interface have been removed.
Please use the `Provider` interface instead.

AI SDK 3.4

```
1

import { experimental_Provider, experimental_ProviderRegistry } from 'ai';
```

AI SDK 4.0

```
1

import { Provider } from 'ai';
```

The model registry is not available any more. Please [register
providers](/docs/reference/ai-sdk-core/provider-registry#setup) instead.

#### [Removed `experimental_​createModelRegistry` function](#removed-experimental_createmodelregistry-function)

The `experimental_createModelRegistry` function has been removed.
Please use the `experimental_createProviderRegistry` function instead.

AI SDK 3.4

```
1

import { experimental_createModelRegistry } from 'ai';
```

AI SDK 4.0

```
1

import { experimental_createProviderRegistry } from 'ai';
```

The model registry is not available any more. Please [register
providers](/docs/reference/ai-sdk-core/provider-registry#setup) instead.

### [Removed `rawResponse` from results](#removed-rawresponse-from-results)

There is no codemod available for this change. Please review and update your
code manually.

The `rawResponse` property has been removed from the `generateText`, `streamText`, `generateObject`, and `streamObject` results.
You can use the `response` property instead.

AI SDK 3.4

```
1

const { text, rawResponse } = await generateText({



2

// ...



3

});
```

AI SDK 4.0

```
1

const { text, response } = await generateText({



2

// ...



3

});
```

### [Removed `init` option from `pipeDataStreamToResponse` and `toDataStreamResponse`](#removed-init-option-from-pipedatastreamtoresponse-and-todatastreamresponse)

There is no codemod available for this change. Please review and update your
code manually.

The `init` option has been removed from the `pipeDataStreamToResponse` and `toDataStreamResponse` functions.
You can set the values from `init` directly into the `options` object.

AI SDK 3.4

```
1

const result = await streamText({



2

// ...



3

});



4



5

result.toUIMessageStreamResponse(response, {



6

init: {



7

headers: {



8

'X-Custom-Header': 'value',



9

},



10

},



11

// ...



12

});
```

AI SDK 4.0

```
1

const result = streamText({



2

// ...



3

});



4



5

result.toUIMessageStreamResponse(response, {



6

headers: {



7

'X-Custom-Header': 'value',



8

},



9

// ...



10

});
```

### [Removed `responseMessages` from `generateText` and `streamText`](#removed-responsemessages-from-generatetext-and-streamtext)

There is no codemod available for this change. Please review and update your
code manually.

The `responseMessages` property has been removed from the `generateText` and `streamText` results.
This includes the `onFinish` callback.
Please use the `response.messages` property instead.

AI SDK 3.4

```
1

const { text, responseMessages } = await generateText({



2

// ...



3

});
```

AI SDK 4.0

```
1

const { text, response } = await generateText({



2

// ...



3

});



4



5

const responseMessages = response.messages;
```

### [Removed `experimental_​continuationSteps` option](#removed-experimental_continuationsteps-option)

The `experimental_continuationSteps` option has been removed from the `generateText` function.
Please use the `experimental_continueSteps` option instead.

AI SDK 3.4

```
1

const result = await generateText({



2

experimental_continuationSteps: true,



3

// ...



4

});
```

AI SDK 4.0

```
1

const result = await generateText({



2

experimental_continueSteps: true,



3

// ...



4

});
```

### [Removed `LanguageModelResponseMetadataWithHeaders` type](#removed-languagemodelresponsemetadatawithheaders-type)

The `LanguageModelResponseMetadataWithHeaders` type has been removed.
Please use the `LanguageModelResponseMetadata` type instead.

AI SDK 3.4

```
1

import { LanguageModelResponseMetadataWithHeaders } from 'ai';
```

AI SDK 4.0

```
1

import { LanguageModelResponseMetadata } from 'ai';
```

#### [Changed `streamText` warnings result to Promise](#changed-streamtext-warnings-result-to-promise)

There is no codemod available for this change. Please review and update your
code manually.

The `warnings` property of the `StreamTextResult` type is now a Promise.

AI SDK 3.4

```
1

const result = await streamText({



2

// ...



3

});



4



5

const warnings = result.warnings;
```

AI SDK 4.0

```
1

const result = streamText({



2

// ...



3

});



4



5

const warnings = await result.warnings;
```

#### [Changed `streamObject` warnings result to Promise](#changed-streamobject-warnings-result-to-promise)

There is no codemod available for this change. Please review and update your
code manually.

The `warnings` property of the `StreamObjectResult` type is now a Promise.

AI SDK 3.4

```
1

const result = await streamObject({



2

// ...



3

});



4



5

const warnings = result.warnings;
```

AI SDK 4.0

```
1

const result = streamObject({



2

// ...



3

});



4



5

const warnings = await result.warnings;
```

#### [Renamed `simulateReadableStream` `values` to `chunks`](#renamed-simulatereadablestream-values-to-chunks)

There is no codemod available for this change. Please review and update your
code manually.

The `simulateReadableStream` function from `ai/test` has been renamed to `chunks`.

AI SDK 3.4

```
1

import { simulateReadableStream } from 'ai/test';



2



3

const stream = simulateReadableStream({



4

values: [1, 2, 3],



5

chunkDelayInMs: 100,



6

});
```

AI SDK 4.0

```
1

import { simulateReadableStream } from 'ai/test';



2



3

const stream = simulateReadableStream({



4

chunks: [1, 2, 3],



5

chunkDelayInMs: 100,



6

});
```

[AI SDK RSC Changes](#ai-sdk-rsc-changes)
-----------------------------------------

There are no codemods available for the changes in this section. Please review
and update your code manually.

### [Removed `render` function](#removed-render-function)

The AI SDK RSC 3.0 `render` function has been removed.
Please use the `streamUI` function instead or [switch to AI SDK UI](/docs/ai-sdk-rsc/migrating-to-ui).

AI SDK 3.0

```
1

import { render } from '@ai-sdk/rsc';
```

AI SDK 4.0

```
1

import { streamUI } from '@ai-sdk/rsc';
```

[AI SDK UI Changes](#ai-sdk-ui-changes)
---------------------------------------

### [Removed Svelte, Vue, and SolidJS exports](#removed-svelte-vue-and-solidjs-exports)

This codemod only operates on `.ts` and `.tsx` files. If you have code in
files with other suffixes, please review and update your code manually.

The `ai` package no longer exports Svelte, Vue, and SolidJS UI integrations.
You need to install the `@ai-sdk/svelte`, `@ai-sdk/vue`, and `@ai-sdk/solid` packages directly.

AI SDK 3.4

```
1

import { useChat } from 'ai/svelte';
```

AI SDK 4.0

```
1

import { useChat } from '@ai-sdk/svelte';
```

### [Removed `experimental_StreamData`](#removed-experimental_streamdata)

The `experimental_StreamData` export has been removed.
Please use the `StreamData` export instead.

AI SDK 3.4

```
1

import { experimental_StreamData } from 'ai';
```

AI SDK 4.0

```
1

import { StreamData } from 'ai';
```

### [`useChat` hook](#usechat-hook)

There are no codemods available for the changes in this section. Please review
and update your code manually.

#### [Removed `streamMode` setting](#removed-streammode-setting)

The `streamMode` options has been removed from the `useChat` hook.
Please use the `streamProtocol` parameter instead.

AI SDK 3.4

```
1

const { messages } = useChat({



2

streamMode: 'text',



3

// ...



4

});
```

AI SDK 4.0

```
1

const { messages } = useChat({



2

streamProtocol: 'text',



3

// ...



4

});
```

#### [Replaced roundtrip setting with `maxSteps`](#replaced-roundtrip-setting-with-maxsteps)

The following options have been removed from the `useChat` hook:

* `experimental_maxAutomaticRoundtrips`
* `maxAutomaticRoundtrips`
* `maxToolRoundtrips`

Please use the [`maxSteps`](/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls-using-stopwhen) option instead.
The value of `maxSteps` is equal to roundtrips + 1.

AI SDK 3.4

```
1

const { messages } = useChat({



2

experimental_maxAutomaticRoundtrips: 2,



3

// or maxAutomaticRoundtrips



4

// or maxToolRoundtrips



5

// ...



6

});
```

AI SDK 4.0

```
1

const { messages } = useChat({



2

maxSteps: 3, // 2 roundtrips + 1



3

// ...



4

});
```

#### [Removed `options` setting](#removed-options-setting)

The `options` parameter in the `useChat` hook has been removed.
Please use the `headers` and `body` parameters instead.

AI SDK 3.4

```
1

const { messages } = useChat({



2

options: {



3

headers: {



4

'X-Custom-Header': 'value',



5

},



6

},



7

// ...



8

});
```

AI SDK 4.0

```
1

const { messages } = useChat({



2

headers: {



3

'X-Custom-Header': 'value',



4

},



5

// ...



6

});
```

#### [Removed `experimental_addToolResult` method](#removed-experimental_addtoolresult-method)

The `experimental_addToolResult` method has been removed from the `useChat` hook.
Please use the `addToolResult` method instead.

AI SDK 3.4

```
1

const { messages, experimental_addToolResult } = useChat({



2

// ...



3

});
```

AI SDK 4.0

```
1

const { messages, addToolResult } = useChat({



2

// ...



3

});
```

#### [Changed default value of `keepLastMessageOnError` to true and deprecated the option](#changed-default-value-of-keeplastmessageonerror-to-true-and-deprecated-the-option)

The `keepLastMessageOnError` option has been changed to default to `true`.
The option will be removed in the next major release.

AI SDK 3.4

```
1

const { messages } = useChat({



2

keepLastMessageOnError: true,



3

// ...



4

});
```

AI SDK 4.0

```
1

const { messages } = useChat({



2

// ...



3

});
```

### [`useCompletion` hook](#usecompletion-hook)

There are no codemods available for the changes in this section. Please review
and update your code manually.

#### [Removed `streamMode` setting](#removed-streammode-setting-1)

The `streamMode` options has been removed from the `useCompletion` hook.
Please use the `streamProtocol` parameter instead.

AI SDK 3.4

```
1

const { text } = useCompletion({



2

streamMode: 'text',



3

// ...



4

});
```

AI SDK 4.0

```
1

const { text } = useCompletion({



2

streamProtocol: 'text',



3

// ...



4

});
```

### [`useAssistant` hook](#useassistant-hook)

#### [Removed `experimental_useAssistant` export](#removed-experimental_useassistant-export)

The `experimental_useAssistant` export has been removed from the `useAssistant` hook.
Please use the `useAssistant` hook directly instead.

AI SDK 3.4

```
1

import { experimental_useAssistant } from '@ai-sdk/react';
```

AI SDK 4.0

```
1

import { useAssistant } from '@ai-sdk/react';
```

#### [Removed `threadId` and `messageId` from `AssistantResponse`](#removed-threadid-and-messageid-from-assistantresponse)

There is no codemod available for this change. Please review and update your
code manually.

The `threadId` and `messageId` parameters have been removed from the `AssistantResponse` function.
Please use the `threadId` and `messageId` variables from the outer scope instead.

AI SDK 3.4

```
1

return AssistantResponse(



2

{ threadId: myThreadId, messageId: myMessageId },



3

async ({ forwardStream, sendDataMessage, threadId, messageId }) => {



4

// use threadId and messageId here



5

},



6

);
```

AI SDK 4.0

```
1

return AssistantResponse(



2

{ threadId: myThreadId, messageId: myMessageId },



3

async ({ forwardStream, sendDataMessage }) => {



4

// use myThreadId and myMessageId here



5

},



6

);
```

#### [Removed `experimental_​AssistantResponse` export](#removed-experimental_assistantresponse-export)

There is no codemod available for this change. Please review and update your
code manually.

The `experimental_AssistantResponse` export has been removed.
Please use the `AssistantResponse` function directly instead.

AI SDK 3.4

```
1

import { experimental_AssistantResponse } from 'ai';
```

AI SDK 4.0

```
1

import { AssistantResponse } from 'ai';
```

### [`experimental_useObject` hook](#experimental_useobject-hook)

There are no codemods available for the changes in this section. Please review
and update your code manually.

The `setInput` helper has been removed from the `experimental_useObject` hook.
Please use the `submit` helper instead.

AI SDK 3.4

```
1

const { object, setInput } = useObject({



2

// ...



3

});
```

AI SDK 4.0

```
1

const { object, submit } = useObject({



2

// ...



3

});
```

[AI SDK Errors](#ai-sdk-errors)
-------------------------------

### [Removed `isXXXError` static methods](#removed-isxxxerror-static-methods)

The `isXXXError` static methods have been removed from AI SDK errors.
Please use the `isInstance` method of the corresponding error class instead.

AI SDK 3.4

```
1

import { APICallError } from 'ai';



2



3

APICallError.isAPICallError(error);
```

AI SDK 4.0

```
1

import { APICallError } from 'ai';



2



3

APICallError.isInstance(error);
```

### [Removed `toJSON` method](#removed-tojson-method)

There is no codemod available for this change. Please review and update your
code manually.

The `toJSON` method has been removed from AI SDK errors.

[AI SDK 2.x Legacy Changes](#ai-sdk-2x-legacy-changes)
------------------------------------------------------

There are no codemods available for the changes in this section. Please review
and update your code manually.

### [Removed 2.x legacy providers](#removed-2x-legacy-providers)

Legacy providers from AI SDK 2.x have been removed. Please use the new [AI SDK provider architecture](/docs/foundations/providers-and-models) instead.

#### [Removed 2.x legacy function and tool calling](#removed-2x-legacy-function-and-tool-calling)

The legacy `function_call` and `tools` options have been removed from `useChat` and `Message`.
The `name` property from the `Message` type has been removed.
Please use the [AI SDK Core tool calling](/docs/ai-sdk-core/tools-and-tool-calling) instead.

### [Removed 2.x prompt helpers](#removed-2x-prompt-helpers)

Prompt helpers for constructing message prompts are no longer needed with the AI SDK provider architecture and have been removed.

### [Removed 2.x `AIStream`](#removed-2x-aistream)

The `AIStream` function and related exports have been removed.
Please use the [`streamText`](/docs/reference/ai-sdk-core/stream-text) function and its `toDataStream()` method instead.

### [Removed 2.x `StreamingTextResponse`](#removed-2x-streamingtextresponse)

The `StreamingTextResponse` function has been removed.
Please use the [`streamText`](/docs/reference/ai-sdk-core/stream-text) function and its `toDataStreamResponse()` method instead.

### [Removed 2.x `streamToResponse`](#removed-2x-streamtoresponse)

The `streamToResponse` function has been removed.
Please use the [`streamText`](/docs/reference/ai-sdk-core/stream-text) function and its `pipeDataStreamToResponse()` method instead.

### [Removed 2.x RSC `Tokens` streaming](#removed-2x-rsc-tokens-streaming)

The legacy `Tokens` RSC streaming from 2.x has been removed.
`Tokens` were implemented prior to AI SDK RSC and are no longer needed.

[Codemod Table](#codemod-table)
-------------------------------

The following table lists codemod availability for the AI SDK 4.0 upgrade
process. Note the codemod `upgrade` command will run all of them for you. This
list is provided to give visibility into which migrations have some automation.
It can also be helpful to find the codemod names if you'd like to run a subset
of codemods. For more, see the [Codemods](#codemods) section.

| Change | Codemod |
| --- | --- |
| **Provider Changes** |  |
| Removed baseUrl option | `v4/replace-baseurl` |
| **Anthropic Provider** |  |
| Removed Anthropic facade | `v4/remove-anthropic-facade` |
| Removed topK setting | *N/A* |
| **Google Generative AI Provider** |  |
| Removed Google facade | `v4/remove-google-facade` |
| Removed topK setting | *N/A* |
| **Google Vertex Provider** |  |
| Removed topK setting | *N/A* |
| **Mistral Provider** |  |
| Removed Mistral facade | `v4/remove-mistral-facade` |
| **OpenAI Provider** |  |
| Removed OpenAI facade | `v4/remove-openai-facade` |
| **LangChain Adapter** |  |
| Removed toAIStream | `v4/replace-langchain-toaistream` |
| **AI SDK Core Changes** |  |
| streamText returns immediately | `v4/remove-await-streamtext` |
| streamObject returns immediately | `v4/remove-await-streamobject` |
| Remove roundtrips | `v4/replace-roundtrips-with-maxsteps` |
| Removed nanoid export | `v4/replace-nanoid` |
| Increased default size of generated IDs | *N/A* |
| Removed ExperimentalMessage types | `v4/remove-experimental-message-types` |
| Removed ExperimentalTool type | `v4/remove-experimental-tool` |
| Removed experimental AI function exports | `v4/remove-experimental-ai-fn-exports` |
| Removed AI-stream related methods from streamText | `v4/remove-ai-stream-methods-from-stream-text-result` |
| Renamed "formatStreamPart" to "formatDataStreamPart" | `v4/rename-format-stream-part` |
| Renamed "parseStreamPart" to "parseDataStreamPart" | `v4/rename-parse-stream-part` |
| Renamed TokenUsage, CompletionTokenUsage and EmbeddingTokenUsage types | `v4/replace-token-usage-types` |
| Removed deprecated telemetry data | *N/A* |
| **Provider Registry** |  |
| → Removed experimental\_Provider, experimental\_ProviderRegistry, and experimental\_ModelRegistry | `v4/remove-deprecated-provider-registry-exports` |
| → Removed experimental\_createModelRegistry function | *N/A* |
| Removed rawResponse from results | *N/A* |
| Removed init option from pipeDataStreamToResponse and toDataStreamResponse | *N/A* |
| Removed responseMessages from generateText and streamText | *N/A* |
| Removed experimental\_continuationSteps option | `v4/replace-continuation-steps` |
| Removed LanguageModelResponseMetadataWithHeaders type | `v4/remove-metadata-with-headers` |
| Changed streamText warnings result to Promise | *N/A* |
| Changed streamObject warnings result to Promise | *N/A* |
| Renamed simulateReadableStream values to chunks | *N/A* |
| **AI SDK RSC Changes** |  |
| Removed render function | *N/A* |
| **AI SDK UI Changes** |  |
| Removed Svelte, Vue, and SolidJS exports | `v4/rewrite-framework-imports` |
| Removed experimental\_StreamData | `v4/remove-experimental-streamdata` |
| **useChat hook** |  |
| Removed streamMode setting | *N/A* |
| Replaced roundtrip setting with maxSteps | `v4/replace-roundtrips-with-maxsteps` |
| Removed options setting | *N/A* |
| Removed experimental\_addToolResult method | *N/A* |
| Changed default value of keepLastMessageOnError to true and deprecated the option | *N/A* |
| **useCompletion hook** |  |
| Removed streamMode setting | *N/A* |
| **useAssistant hook** |  |
| Removed experimental\_useAssistant export | `v4/remove-experimental-useassistant` |
| Removed threadId and messageId from AssistantResponse | *N/A* |
| Removed experimental\_AssistantResponse export | *N/A* |
| **experimental\_useObject hook** |  |
| Removed setInput helper | *N/A* |
| **AI SDK Errors** |  |
| Removed isXXXError static methods | `v4/remove-isxxxerror` |
| Removed toJSON method | *N/A* |
| **AI SDK 2.x Legacy Changes** |  |
| Removed 2.x legacy providers | *N/A* |
| Removed 2.x legacy function and tool calling | *N/A* |
| Removed 2.x prompt helpers | *N/A* |
| Removed 2.x AIStream | *N/A* |
| Removed 2.x StreamingTextResponse | *N/A* |
| Removed 2.x streamToResponse | *N/A* |
| Removed 2.x RSC Tokens streaming | *N/A* |

[Previous

Migrate AI SDK 4.0 to 4.1](/docs/migration-guides/migration-guide-4-1)[Next

Migrate AI SDK 3.3 to 3.4](/docs/migration-guides/migration-guide-3-4)
