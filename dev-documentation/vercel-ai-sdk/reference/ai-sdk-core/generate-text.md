---
title: "generateText()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text
section: reference
crawled: 2026-09-20
---

# generateText()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text

[AI SDK Core](/docs/ai-sdk-core)generateText


[`generateText()`](#generatetext)
=================================

Generates text and calls tools for a given prompt using a language model.

It is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const { text } = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

});



7



8

console.log(text);
```

For guidance on `runtimeContext`, `toolsContext`, tool `context`, and sensitive
context filtering, see [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context).

To see `generateText` in action, check out [these examples](#examples).

[Import](#import)
-----------------

```
import { generateText } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

LanguageModel

### instructions:

Instructions

### prompt:

string | Array<SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage>

### messages:

Array<SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage>

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

string | Array<TextPart | FilePart | ReasoningPart | ReasoningFilePart | ToolCallPart>

TextPart

### type:

'text'

### text:

string

ReasoningPart

### type:

'reasoning'

### text:

string

ReasoningFilePart

### type:

'reasoning-file'

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

### mediaType:

string

FilePart

### type:

'file'

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

### mediaType:

string

### filename?:

string

ToolCallPart

### type:

'tool-call'

### toolCallId:

string

### toolName:

string

### input:

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

### output:

unknown

### isError?:

boolean

### allowSystemInMessages?:

boolean

### tools:

ToolSet

Tool

### description?:

string | ((options: { context: CONTEXT; experimental\_sandbox?: Experimental\_SandboxSession }) => string)

### inputSchema:

Zod Schema | JSON Schema

### execute?:

async (parameters: T, options: ToolExecutionOptions) => RESULT

ToolExecutionOptions

### toolCallId:

string

### messages:

ModelMessage[]

### abortSignal:

AbortSignal

### toolChoice?:

"auto" | "none" | "required" | { "type": "tool", "toolName": string }

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

### reasoning?:

'provider-default' | 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'

### maxRetries?:

number

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number; stepMs?: number; toolMs?: number; tools?: { [toolName]Ms?: number } }

### headers?:

Record<string, string | undefined>

### telemetry?:

TelemetryOptions

TelemetryOptions

### isEnabled?:

boolean

### recordInputs?:

boolean

### recordOutputs?:

boolean

### functionId?:

string

### includeRuntimeContext?:

{ [KEY in keyof CONTEXT]?: boolean }

### includeToolsContext?:

{ [TOOL\_NAME in keyof InferToolSetContext<TOOLS>]?: { [KEY in keyof InferToolSetContext<TOOLS>[TOOL\_NAME]]?: boolean } }

### integrations?:

Telemetry | Telemetry[]

### providerOptions?:

Record<string,JSONObject> | undefined

### activeTools?:

ActiveTools<TOOLS>

### toolOrder?:

ToolOrder<TOOLS>

### toolApproval?:

ToolApprovalConfiguration<TOOLS, RUNTIME\_CONTEXT>

### experimental\_toolCallers?:

Experimental\_ToolCallers<TOOLS>

### experimental\_refineToolInput?:

ToolInputRefinement<TOOLS>

### stopWhen?:

StopCondition<TOOLS> | Array<StopCondition<TOOLS>>

### prepareStep?:

(options: PrepareStepOptions) => PrepareStepResult<TOOLS> | Promise<PrepareStepResult<TOOLS>>

PrepareStepFunction<TOOLS>

### options:

object

PrepareStepOptions

### steps:

Array<StepResult<TOOLS>>

### stepNumber:

number

### model:

LanguageModel

### instructions:

Instructions | undefined

### initialInstructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### runtimeContext?:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### experimental\_sandbox?:

Experimental\_SandboxSession | undefined

PrepareStepResult<TOOLS>

### model?:

LanguageModel

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

### reasoning?:

LanguageModelV4CallOptions["reasoning"]

### toolChoice?:

ToolChoice<TOOLS>

### activeTools?:

ActiveTools<TOOLS>

### toolOrder?:

ToolOrder<TOOLS>

### instructions?:

Instructions

### messages?:

Array<ModelMessage>

### runtimeContext?:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### experimental\_sandbox?:

Experimental\_SandboxSession

### providerOptions?:

ProviderOptions

### runtimeContext?:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### experimental\_sandbox?:

Experimental\_SandboxSession

### experimental\_download?:

(requestedDownloads: Array<{ url: URL; isUrlSupportedByModel: boolean }>) => Promise<Array<null | { data: Uint8Array; mediaType?: string }>>

### include?:

{ requestBody?: boolean; requestMessages?: boolean; responseBody?: boolean }

Object

### requestBody?:

boolean

### requestMessages?:

boolean

### responseBody?:

boolean

### repairToolCall?:

(options: ToolCallRepairOptions) => Promise<LanguageModelV4ToolCall | null>

ToolCallRepairOptions

### instructions:

Instructions | undefined

### system?:

Instructions | undefined

### messages:

ModelMessage[]

### toolCall:

LanguageModelV4ToolCall

### tools:

TOOLS

### inputSchema:

(options: { toolName: string }) => JSONSchema7

### error:

NoSuchToolError | InvalidToolInputError

### output?:

Output

Output

### Output.text():

Output

### Output.object():

Output

Options

### schema:

Schema<OBJECT>

### name?:

string

### description?:

string

### Output.array():

Output

Options

### element:

Schema<ELEMENT>

### minItems?:

number

### maxItems?:

number

### name?:

string

### description?:

string

### Output.choice():

Output

Options

### options:

Array<string>

### name?:

string

### description?:

string

### Output.json():

Output

Options

### name?:

string

### description?:

string

### onStart?:

(event: GenerateTextStartEvent) => PromiseLike<void> | void

GenerateTextStartEvent

### provider:

string

### modelId:

string

### instructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### tools:

TOOLS | undefined

### toolChoice:

ToolChoice<TOOLS> | undefined

### activeTools:

ActiveTools<TOOLS>

### toolOrder:

ToolOrder<TOOLS>

### maxOutputTokens:

number | undefined

### temperature:

number | undefined

### topP:

number | undefined

### topK:

number | undefined

### presencePenalty:

number | undefined

### frequencyPenalty:

number | undefined

### stopSequences:

string[] | undefined

### seed:

number | undefined

### maxRetries:

number

### timeout:

number | { totalMs?: number; stepMs?: number; chunkMs?: number } | undefined

### headers:

Record<string, string | undefined> | undefined

### providerOptions:

ProviderOptions | undefined

### output:

OUTPUT | undefined

### abortSignal:

AbortSignal | undefined

### include:

{ requestBody?: boolean; requestMessages?: boolean; responseBody?: boolean } | undefined

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### onStepStart?:

(event: GenerateTextStepStartEvent) => PromiseLike<void> | void

GenerateTextStepStartEvent

### stepNumber:

number

### provider:

string

### modelId:

string

### instructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### tools:

TOOLS | undefined

### toolChoice:

LanguageModelV4ToolChoice | undefined

### activeTools:

ActiveTools<TOOLS>

### toolOrder:

ToolOrder<TOOLS>

### steps:

ReadonlyArray<StepResult<TOOLS>>

### providerOptions:

ProviderOptions | undefined

### timeout:

number | { totalMs?: number; stepMs?: number; chunkMs?: number } | undefined

### headers:

Record<string, string | undefined> | undefined

### stopWhen:

StopCondition<TOOLS> | Array<StopCondition<TOOLS>> | undefined

### output:

OUTPUT | undefined

### abortSignal:

AbortSignal | undefined

### include:

{ requestBody?: boolean; requestMessages?: boolean; responseBody?: boolean } | undefined

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### onLanguageModelCallStart?:

(event: LanguageModelCallStartEvent) => PromiseLike<void> | void

LanguageModelCallStartEvent

### callId:

string

### provider:

string

### modelId:

string

### instructions:

Instructions | undefined

### messages:

Array<ModelMessage>

### tools:

ReadonlyArray<Record<string, unknown>> | undefined

### onLanguageModelCallEnd?:

(event: LanguageModelCallEndEvent) => PromiseLike<void> | void

LanguageModelCallEndEvent

### callId:

string

### provider:

string

### modelId:

string

### finishReason:

FinishReason

### usage:

LanguageModelUsage

### content:

ReadonlyArray<ContentPart<TOOLS>>

### responseId:

string

### providerMetadata:

ProviderMetadata | undefined

### performance:

{ responseTimeMs: number; effectiveOutputTokensPerSecond: number; outputTokensPerSecond: number | undefined; inputTokensPerSecond: number | undefined; effectiveTotalTokensPerSecond: number; timeToFirstOutputMs: number | undefined; timeBetweenOutputChunksMs?: OutputChunkTimingStats }

LanguageModelCallPerformance

### responseTimeMs:

number

### effectiveOutputTokensPerSecond:

number

### outputTokensPerSecond:

number | undefined

### inputTokensPerSecond:

number | undefined

### effectiveTotalTokensPerSecond:

number

### timeToFirstOutputMs:

number | undefined

### timeBetweenOutputChunksMs:

OutputChunkTimingStats | undefined

### onToolExecutionStart?:

(event: ToolExecutionStartEvent) => PromiseLike<void> | void

ToolExecutionStartEvent

### callId:

string

### toolCall:

TypedToolCall<TOOLS>

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[toolName]>

### onToolExecutionEnd?:

(event: ToolExecutionEndEvent) => PromiseLike<void> | void

ToolExecutionEndEvent

### callId:

string

### toolCall:

TypedToolCall<TOOLS>

### toolExecutionMs:

number

### messages:

Array<ModelMessage>

### toolContext:

InferToolContext<TOOLS[toolName]>

### toolOutput:

ToolOutput<TOOLS>

### experimental\_onToolCallStart?:

(event: ToolExecutionStartEvent) => PromiseLike<void> | void

### experimental\_onToolCallFinish?:

(event: ToolExecutionEndEvent) => PromiseLike<void> | void

### onStepEnd?:

(stepResult: StepResult<TOOLS>) => Promise<void> | void

StepResult

### stepNumber:

number

### model:

{ provider: string; modelId: string }

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### content:

Array<ContentPart<TOOLS>>

### text:

string

### reasoning:

Array<ReasoningPart | ReasoningFilePart>

### reasoningText:

string | undefined

### files:

Array<GeneratedFile>

### sources:

Array<Source>

### toolCalls:

Array<TypedToolCall<TOOLS>>

### staticToolCalls:

Array<StaticToolCall<TOOLS>>

### dynamicToolCalls:

Array<DynamicToolCall>

### toolResults:

Array<TypedToolResult<TOOLS>>

### staticToolResults:

Array<StaticToolResult<TOOLS>>

### dynamicToolResults:

Array<DynamicToolResult>

### finishReason:

"stop" | "length" | "content-filter" | "tool-calls" | "error" | "other"

### rawFinishReason:

string | undefined

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

### performance:

StepResultPerformance

StepResultPerformance

### effectiveOutputTokensPerSecond:

number

### outputTokensPerSecond:

number | undefined

### inputTokensPerSecond:

number | undefined

### effectiveTotalTokensPerSecond:

number

### stepTimeMs:

number

### responseTimeMs:

number

### toolExecutionMs:

Readonly<Record<string, number>>

### timeToFirstOutputMs:

number | undefined

### timeBetweenOutputChunksMs:

OutputChunkTimingStats | undefined

### warnings:

CallWarning[] | undefined

### request:

LanguageModelRequestMetadata

LanguageModelRequestMetadata

### messages?:

Array<ModelMessage>

### body?:

unknown

### response:

LanguageModelResponseMetadata

Response

### id:

string

### modelId:

string

### timestamp:

Date

### headers?:

Record<string, string>

### messages:

Array<ResponseMessage>

### body?:

unknown

### providerMetadata?:

ProviderMetadata | undefined

### responseMessages:

Array<ResponseMessage>

### onStepFinish?:

GenerateTextOnStepFinishCallback<TOOLS>

### onEnd?:

(event: GenerateTextEndEvent<TOOLS>) => PromiseLike<void> | void

GenerateTextEndEvent

### stepNumber:

number

### model:

{ provider: string; modelId: string }

### finishReason:

"stop" | "length" | "content-filter" | "tool-calls" | "error" | "other"

### rawFinishReason:

string | undefined

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

### totalUsage:

LanguageModelUsage

LanguageModelUsage

### inputTokens:

number | undefined

### outputTokens:

number | undefined

### totalTokens:

number | undefined

### content:

Array<ContentPart<TOOLS>>

### providerMetadata:

ProviderMetadata | undefined

### text:

string

### reasoningText:

string | undefined

### reasoning:

Array<ReasoningDetail>

ReasoningDetail

### type:

'text'

### text:

string

### signature?:

string

ReasoningDetail

### type:

'redacted'

### data:

string

### sources:

Array<Source>

Source

### sourceType:

'url'

### id:

string

### url:

string

### title?:

string

### providerMetadata?:

SharedV2ProviderMetadata

### files:

Array<GeneratedFile>

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### toolCalls:

Array<TypedToolCall<TOOLS>>

### staticToolCalls:

Array<StaticToolCall<TOOLS>>

### dynamicToolCalls:

Array<DynamicToolCall>

### toolResults:

Array<TypedToolResult<TOOLS>>

### staticToolResults:

Array<StaticToolResult<TOOLS>>

### dynamicToolResults:

Array<DynamicToolResult>

### warnings:

CallWarning[] | undefined

### request:

LanguageModelRequestMetadata

LanguageModelRequestMetadata

### messages?:

Array<ModelMessage>

### body?:

unknown

### response:

LanguageModelResponseMetadata

Response

### id:

string

### modelId:

string

### timestamp:

Date

### headers?:

Record<string, string>

### body?:

unknown

### messages:

Array<ResponseMessage>

### steps:

Array<StepResult>

### finalStep:

StepResult

### responseMessages:

Array<ResponseMessage>

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### onFinish?:

(event: GenerateTextEndEvent<TOOLS>) => PromiseLike<void> | void

### [Returns](#returns)

### content:

Array<ContentPart<TOOLS>>

### text:

string

### reasoning:

Array<ReasoningOutput | ReasoningFileOutput>

ReasoningOutput

### type:

'reasoning'

### text:

string

### providerMetadata?:

SharedV2ProviderMetadata

ReasoningFileOutput

### type:

'reasoning-file'

### file:

GeneratedFile

### providerMetadata?:

SharedV2ProviderMetadata

### reasoningText:

string | undefined

### sources:

Array<Source>

Source

### sourceType:

'url'

### id:

string

### url:

string

### title?:

string

### providerMetadata?:

SharedV2ProviderMetadata

### files:

Array<GeneratedFile>

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### toolCalls:

ToolCallArray<TOOLS>

### toolResults:

ToolResultArray<TOOLS>

### staticToolCalls:

Array<StaticToolCall<TOOLS>>

### dynamicToolCalls:

Array<DynamicToolCall>

### staticToolResults:

Array<StaticToolResult<TOOLS>>

### dynamicToolResults:

Array<DynamicToolResult>

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'

### rawFinishReason:

string | undefined

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

### totalUsage:

LanguageModelUsage

LanguageModelUsage

### inputTokens:

number | undefined

### outputTokens:

number | undefined

### totalTokens:

number | undefined

### request?:

LanguageModelRequestMetadata

LanguageModelRequestMetadata

### messages?:

Array<ModelMessage>

### body?:

unknown

### response?:

LanguageModelResponseMetadata

LanguageModelResponseMetadata

### id:

string

### modelId:

string

### timestamp:

Date

### headers?:

Record<string, string>

### body?:

unknown

### messages:

Array<ResponseMessage>

### warnings:

Warning[] | undefined

### responseMessages:

Array<ResponseMessage>

### providerMetadata:

ProviderMetadata | undefined

### output:

InferCompleteOutput<OUTPUT>

### steps:

Array<StepResult<TOOLS>>

StepResult

### stepNumber:

number

### model:

{ provider: string; modelId: string }

### runtimeContext:

CONTEXT

### toolsContext:

InferToolSetContext<TOOLS>

### content:

Array<ContentPart<TOOLS>>

### text:

string

### reasoning:

Array<ReasoningPart | ReasoningFilePart>

ReasoningPart

### type:

'reasoning'

### text:

string

ReasoningFilePart

### type:

'reasoning-file'

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

### mediaType:

string

### reasoningText:

string | undefined

### files:

Array<GeneratedFile>

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### sources:

Array<Source>

Source

### sourceType:

'url'

### id:

string

### url:

string

### title?:

string

### providerMetadata?:

SharedV2ProviderMetadata

### toolCalls:

ToolCallArray<TOOLS>

### toolResults:

ToolResultArray<TOOLS>

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'

### rawFinishReason:

string | undefined

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

### warnings:

Warning[] | undefined

### request:

LanguageModelRequestMetadata

LanguageModelRequestMetadata

### messages?:

Array<ModelMessage>

### body?:

unknown

### response:

LanguageModelResponseMetadata

LanguageModelResponseMetadata

### id:

string

### modelId:

string

### timestamp:

Date

### headers?:

Record<string, string>

### body?:

unknown

### messages:

Array<ResponseMessage>

### providerMetadata:

ProviderMetadata | undefined

### finalStep:

StepResult<TOOLS>

[Types](#types)
---------------

### [`ActiveTools`](#activetools)

```
1

type ActiveTools<TOOLS extends ToolSet> =



2

| ReadonlyArray<keyof TOOLS & string>



3

| undefined;
```

Limits a generation step to the listed tool names. `undefined` means no tool restriction is applied.

[Examples](#examples)
---------------------

[Learn to generate text using a language model in Next.js](/examples/next-app/basics/generating-text)[Learn to generate a chat completion using a language model in Next.js](/examples/next-app/basics/generating-text)[Learn to call tools using a language model in Next.js](/examples/next-app/tools/call-tool)[Learn to render a React component as a tool call using a language model in Next.js](/examples/next-app/tools/render-interface-during-tool-call)[Learn to generate text using a language model in Node.js](/examples/node/generating-text/generate-text)[Learn to generate chat completions using a language model in Node.js](/examples/node/generating-text/generate-text-with-chat-prompt)

[Previous

AI SDK Core](/docs/reference/ai-sdk-core)[Next

streamText](/docs/reference/ai-sdk-core/stream-text)
