---
title: "streamUI"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/stream-ui
section: reference
crawled: 2026-09-20
---

# streamUI

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/stream-ui

[AI SDK RSC](/docs/ai-sdk-rsc)streamUI


[`streamUI`](#streamui)
=======================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

A helper function to create a streamable UI from LLM providers. This function is similar to AI SDK Core APIs and supports the same model interfaces.

To see `streamUI` in action, check out [these examples](#examples).

[Import](#import)
-----------------

```
import { streamUI } from "@ai-sdk/rsc"
```

[Parameters](#parameters)
-------------------------

### model:

LanguageModel

### initial?:

ReactNode

### instructions:

Instructions

### prompt:

string

### messages:

Array<SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage> | Array<UIMessage>

SystemModelMessage

### role:

'system'

### content:

string

UserModelMessage

### role:

'user'

### content:

string | Array<TextPart | ImagePart | FilePart>

TextPart

### type:

'text'

### text:

string

ImagePart

### type:

'image'

### image:

string | Uint8Array | Buffer | ArrayBuffer | URL

### mediaType?:

string

FilePart

### type:

'file'

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

### mediaType:

string

AssistantModelMessage

### role:

'assistant'

### content:

string | Array<TextPart | ToolCallPart>

TextPart

### type:

'text'

### text:

string

ToolCallPart

### type:

'tool-call'

### toolCallId:

string

### toolName:

string

### args:

object based on zod schema

ToolModelMessage

### role:

'tool'

### content:

Array<ToolResultPart>

ToolResultPart

### type:

'tool-result'

### toolCallId:

string

### toolName:

string

### result:

unknown

### isError?:

boolean

### allowSystemInMessages?:

boolean

### maxOutputTokens?:

number

### temperature?:

number

### topP?:

number

### topK?:

number

### presencePenalty?:

number

### frequencyPenalty?:

number

### stopSequences?:

string[]

### seed?:

number

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### tools:

ToolSet

Tool

### description?:

string

### inputSchema:

zod schema

### generate?:

(async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void>

### toolChoice?:

"auto" | "none" | "required" | { "type": "tool", "toolName": string }

### text?:

(Text) => ReactNode

Text

### content:

string

### delta:

string

### done:

boolean

### providerOptions?:

Record<string,JSONObject> | undefined

### onFinish?:

(result: OnFinishResult) => void

OnFinishResult

### usage:

LanguageModelUsage

LanguageModelUsage

### inputTokens:

number | undefined

### inputTokenDetails:

LanguageModelInputTokenDetails

LanguageModelInputTokenDetails

### noCacheTokens:

number | undefined

### cacheReadTokens:

number | undefined

### cacheWriteTokens:

number | undefined

### outputTokens:

number | undefined

### outputTokenDetails:

LanguageModelOutputTokenDetails

LanguageModelOutputTokenDetails

### textTokens:

number | undefined

### reasoningTokens:

number | undefined

### totalTokens:

number | undefined

### raw?:

object | undefined

### value:

ReactNode

### warnings:

Warning[] | undefined

### response:

Response

Response

### headers?:

Record<string, string>

[Returns](#returns)
-------------------

### value:

ReactNode

### response?:

Response

Response

### headers?:

Record<string, string>

### warnings:

Warning[] | undefined

### stream:

AsyncIterable<StreamPart> & ReadableStream<StreamPart>

StreamPart

### type:

'text-delta'

### textDelta:

string

StreamPart

### type:

'tool-call'

### toolCallId:

string

### toolName:

string

### args:

object based on zod schema

StreamPart

### type:

'error'

### error:

Error

StreamPart

### type:

'finish'

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'

### usage:

LanguageModelUsage

LanguageModelUsage

### inputTokens:

number | undefined

### inputTokenDetails:

LanguageModelInputTokenDetails

LanguageModelInputTokenDetails

### noCacheTokens:

number | undefined

### cacheReadTokens:

number | undefined

### cacheWriteTokens:

number | undefined

### outputTokens:

number | undefined

### outputTokenDetails:

LanguageModelOutputTokenDetails

LanguageModelOutputTokenDetails

### textTokens:

number | undefined

### reasoningTokens:

number | undefined

### totalTokens:

number | undefined

### raw?:

object | undefined

[Examples](#examples)
---------------------

[Learn to render a React component as a function call using a language model in Next.js](/examples/next-app/state-management/ai-ui-states)[Learn to persist and restore states UI/AI states in Next.js](/examples/next-app/state-management/save-and-restore-states)[Learn to route React components using a language model in Next.js](/examples/next-app/interface/route-components)[Learn to stream component updates to the client in Next.js](/examples/next-app/interface/stream-component-updates)

[Previous

AI SDK RSC](/docs/reference/ai-sdk-rsc)[Next

createAI](/docs/reference/ai-sdk-rsc/create-ai)
