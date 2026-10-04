---
title: "streamText()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
section: reference
crawled: 2026-09-20
---

# streamText()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text

[AI SDK Core](/docs/ai-sdk-core)streamText


[`streamText()`](#streamtext)
=============================

Streams text generations from a language model.

You can use the streamText function for interactive use cases such as chat bots and other real-time applications. You can also generate UI components with tools.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const { textStream } = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

});



7



8

for await (const textPart of textStream) {



9

process.stdout.write(textPart);



10

}
```

For guidance on `runtimeContext`, `toolsContext`, tool `context`, and sensitive
context filtering, see [Runtime and Tool
Context](/docs/ai-sdk-core/runtime-and-tool-context).

To see `streamText` in action, check out [these examples](#examples).

[Import](#import)
-----------------

```
import { streamText } from "ai"
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

### result:

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

### streamRetries?:

number

### abortSignal?:

AbortSignal

### timeout?:

number | { totalMs?: number; stepMs?: number; firstChunkMs?: number; chunkMs?: number; toolMs?: number; tools?: { [toolName]Ms?: number } }

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

### experimental\_transform?:

StreamTextTransform | Array<StreamTextTransform>

StreamTextTransform

### transform:

(options: TransformOptions) => TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>

TransformOptions

### stopStream:

() => void

### tools:

TOOLS

### includeRawChunks?:

boolean

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

{ requestBody?: boolean; requestMessages?: boolean; rawChunks?: boolean }

Object

### requestBody?:

boolean

### requestMessages?:

boolean

### rawChunks?:

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

### onChunk?:

(event: OnChunkResult) => Promise<void> |void

OnChunkResult

### chunk:

TextStreamPart<TOOLS>

TextStreamPart

### type:

'text-delta'

### text:

string

TextStreamPart

### type:

'reasoning-delta'

### text:

string

TextStreamPart

### type:

'source'

### source:

Source

TextStreamPart

### type:

'custom'

### kind:

string

### providerMetadata?:

ProviderMetadata

TextStreamPart

### type:

'tool-call'

### toolCallId:

string

### toolName:

string

### input:

object based on zod schema

TextStreamPart

### type:

'tool-input-start'

### id:

string

### toolName:

string

TextStreamPart

### type:

'tool-input-delta'

### id:

string

### toolName:

string

### delta:

string

TextStreamPart

### type:

'tool-result'

### toolCallId:

string

### toolName:

string

### input:

object based on zod schema

### output:

any

### onError?:

StreamTextOnErrorCallback | StreamTextOnErrorRetryCallback

OnErrorResult

### error:

unknown

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

### onStepEnd?:

(result: StepResult<TOOLS>) => Promise<void> | void

StepResult

### stepType:

"initial" | "continue" | "tool-result"

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

### text:

string

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

ToolCall[]

### toolResults:

ToolResult[]

### warnings:

Warning[] | undefined

### response?:

Response

Response

### id:

string

### modelId:

string

### timestamp:

Date

### headers?:

Record<string, string>

### isContinued:

boolean

### providerMetadata?:

Record<string,JSONObject> | undefined

### onStepFinish?:

GenerateTextOnStepFinishCallback<TOOLS>

### onEnd?:

(result: OnEndResult) => Promise<void> | void

OnEndResult

### finishReason:

"stop" | "length" | "content-filter" | "tool-calls" | "error" | "other"

### rawFinishReason:

string | undefined

### output?:

COMPLETE\_OUTPUT | undefined

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

### providerMetadata:

Record<string,JSONObject> | undefined

### text:

string

### reasoning:

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

ToolCall[]

### toolResults:

ToolResult[]

### warnings:

Warning[] | undefined

### response?:

Response

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

### steps:

Array<StepResult>

### finalStep:

StepResult

### runtimeContext:

CONTEXT

### onFinish?:

(result: OnEndResult) => Promise<void> | void

### onAbort?:

(event: OnAbortResult) => Promise<void> | void

OnAbortResult

### callId:

string

### steps:

Array<StepResult>

### reason?:

unknown

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

{ requestBody?: boolean; requestMessages?: boolean } | undefined

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

{ requestBody?: boolean; requestMessages?: boolean } | undefined

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

### [Returns](#returns)

### content:

Promise<Array<ContentPart<TOOLS>>>

### finishReason:

PromiseLike<'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'>

### rawFinishReason:

PromiseLike<string | undefined>

### usage:

Promise<LanguageModelUsage>

LanguageModelUsage

### inputTokens:

number | undefined

### outputTokens:

number | undefined

### totalTokens:

number | undefined

### totalUsage:

Promise<LanguageModelUsage>

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

### providerMetadata:

Promise<ProviderMetadata | undefined>

### text:

Promise<string>

### reasoning:

Promise<Array<ReasoningOutput | ReasoningFileOutput>>

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

Promise<string | undefined>

### sources:

Promise<Array<Source>>

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

Promise<Array<GeneratedFile>>

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### toolCalls:

Promise<TypedToolCall<TOOLS>[]>

### toolResults:

Promise<TypedToolResult<TOOLS>[]>

### staticToolCalls:

PromiseLike<Array<StaticToolCall<TOOLS>>>

### dynamicToolCalls:

PromiseLike<Array<DynamicToolCall>>

### staticToolResults:

PromiseLike<Array<StaticToolResult<TOOLS>>>

### dynamicToolResults:

PromiseLike<Array<DynamicToolResult>>

### request:

Promise<LanguageModelRequestMetadata>

LanguageModelRequestMetadata

### messages?:

Array<ModelMessage>

### body?:

unknown

### response:

Promise<LanguageModelResponseMetadata>

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

Promise<Warning[] | undefined>

### responseMessages:

Promise<Array<ResponseMessage>>

### steps:

Promise<Array<StepResult>>

StepResult

### stepType:

"initial" | "continue" | "tool-result"

### text:

string

### reasoning:

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

array

### toolResults:

array

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

### request?:

RequestMetadata

RequestMetadata

### messages?:

Array<ModelMessage>

### body?:

unknown

### response?:

ResponseMetadata

ResponseMetadata

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

### warnings:

Warning[] | undefined

### isContinued:

boolean

### providerMetadata?:

Record<string,JSONObject> | undefined

### textStream:

AsyncIterableStream<string>

### finalStep:

Promise<StepResult>

### stream:

AsyncIterable<TextStreamPart<TOOLS>> & ReadableStream<TextStreamPart<TOOLS>>

TextStreamPart

### type:

'text'

### text:

string

TextStreamPart

### type:

'reasoning'

### text:

string

### providerMetadata?:

ProviderMetadata

TextStreamPart

### type:

'source'

### sourceType:

'url'

### id:

string

### url:

string

### title?:

string

### providerMetadata?:

ProviderMetadata

TextStreamPart

### type:

'file'

### file:

GeneratedFile

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

TextStreamPart

### type:

'custom'

### kind:

string

### providerMetadata?:

ProviderMetadata

TextStreamPart

### type:

'tool-call'

### toolCallId:

string

### toolName:

string

### input:

object based on tool parameters

TextStreamPart

### type:

'tool-call-streaming-start'

### toolCallId:

string

### toolName:

string

TextStreamPart

### type:

'tool-call-delta'

### toolCallId:

string

### toolName:

string

### argsTextDelta:

string

TextStreamPart

### type:

'tool-result'

### toolCallId:

string

### toolName:

string

### input:

object based on tool parameters

### output:

tool execution return type

TextStreamPart

### type:

'start-step'

### request:

LanguageModelRequestMetadata

LanguageModelRequestMetadata

### messages:

Array<ModelMessage>

### body?:

unknown

### warnings:

Warning[]

TextStreamPart

### type:

'finish-step'

### response:

Omit<LanguageModelResponseMetadata, 'messages' | 'body'>

LanguageModelResponseMetadata

### id:

string

### modelId:

string

### timestamp:

Date

### headers:

Record<string, string>

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

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'

### rawFinishReason:

string | undefined

### providerMetadata?:

ProviderMetadata | undefined

TextStreamPart

### type:

'start'

TextStreamPart

### type:

'finish'

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'

### rawFinishReason:

string | undefined

### totalUsage:

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

TextStreamPart

### type:

'reasoning-part-finish'

TextStreamPart

### type:

'error'

### error:

unknown

TextStreamPart

### type:

'abort'

### reason?:

string

### fullStream:

AsyncIterable<TextStreamPart<TOOLS>> & ReadableStream<TextStreamPart<TOOLS>>

### partialOutputStream:

AsyncIterableStream<PARTIAL\_OUTPUT>

### elementStream:

AsyncIterableStream<ELEMENT\_OUTPUT>

### output:

Promise<COMPLETE\_OUTPUT>

### consumeStream:

(options?: ConsumeStreamOptions) => Promise<void>

ConsumeStreamOptions

### onError?:

(error: unknown) => void

### toUIMessageStream:

(options?: UIMessageStreamOptions) => AsyncIterableStream<UIMessageChunk>

UIMessageStreamOptions

### originalMessages?:

UIMessage[]

### onEnd?:

(options: { messages: UIMessage[]; isContinuation: boolean; responseMessage: UIMessage; isAborted: boolean; outcome: UIMessageStreamOutcome; finishReason?: FinishReason; }) => PromiseLike<void> | void

### onFinish?:

(options: { messages: UIMessage[]; isContinuation: boolean; responseMessage: UIMessage; isAborted: boolean; outcome: UIMessageStreamOutcome; finishReason?: FinishReason; }) => PromiseLike<void> | void

### messageMetadata?:

(options: { part: TextStreamPart<TOOLS> & { type: "start" | "finish" | "start-step" | "finish-step"; }; }) => unknown

### sendReasoning?:

boolean

### sendSources?:

boolean

### sendFinish?:

boolean

### sendStart?:

boolean

### onError?:

(error: unknown) => string

### consumeSseStream?:

(stream: ReadableStream) => Promise<void>

### pipeUIMessageStreamToResponse:

(response: ServerResponse, options?: ResponseInit & UIMessageStreamOptions) => Promise<void>

ResponseInit & UIMessageStreamOptions

### status?:

number

### statusText?:

string

### headers?:

HeadersInit

### pipeTextStreamToResponse:

(response: ServerResponse, init?: ResponseInit) => Promise<void>

ResponseInit

### status?:

number

### statusText?:

string

### headers?:

Record<string, string>

### toUIMessageStreamResponse:

(options?: ResponseInit & UIMessageStreamOptions) => Response

ResponseInit & UIMessageStreamOptions

### status?:

number

### statusText?:

string

### headers?:

HeadersInit

### toTextStreamResponse:

(init?: ResponseInit) => Response

ResponseInit

### status?:

number

### statusText?:

string

### headers?:

Record<string, string>

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

[Learn to stream text generated by a language model in Next.js](/examples/next-app/basics/streaming-text-generation)[Learn to stream chat completions generated by a language model in Next.js](/examples/next-app/chat/stream-chat-completion)[Learn to stream text generated by a language model in Node.js](/examples/node/generating-text/stream-text)[Learn to stream chat completions generated by a language model in Node.js](/examples/node/generating-text/stream-text-with-chat-prompt)

[Previous

generateText](/docs/reference/ai-sdk-core/generate-text)[Next

embed](/docs/reference/ai-sdk-core/embed)
