---
title: "useChat()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat
section: reference
crawled: 2026-09-20
---

# useChat()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat

[AI SDK UI](/docs/ai-sdk-ui)useChat


[`useChat()`](#usechat)
=======================

Allows you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages are received.

The `useChat` API has been significantly updated in AI SDK 5.0. It now uses a
transport-based architecture and no longer manages input state internally. See
the [migration
guide](/docs/migration-guides/migration-guide-5-0#usechat-changes) for
details.

[Import](#import)
-----------------

ReactSvelteVueAngular

```
import { useChat } from '@ai-sdk/react'
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### chat?:

Chat<UIMessage>

### transport?:

ChatTransport

DefaultChatTransport

### api?:

string = '/api/chat'

### credentials?:

RequestCredentials

### headers?:

Record<string, string> | Headers

### body?:

object

### fetch?:

FetchFunction

### prepareSendMessagesRequest?:

PrepareSendMessagesRequest

PrepareSendMessagesRequest

### options:

PrepareSendMessageRequestOptions

PrepareSendMessageRequestOptions

### id:

string

### messages:

UIMessage[]

### requestMetadata:

unknown

### body:

Record<string, any> | undefined

### credentials:

RequestCredentials | undefined

### headers:

HeadersInit | undefined

### api:

string

### trigger:

'submit-message' | 'regenerate-message'

### messageId:

string | undefined

### prepareReconnectToStreamRequest?:

PrepareReconnectToStreamRequest

PrepareReconnectToStreamRequest

### options:

PrepareReconnectToStreamRequestOptions

PrepareReconnectToStreamRequestOptions

### id:

string

### requestMetadata:

unknown

### body:

Record<string, any> | undefined

### credentials:

RequestCredentials | undefined

### headers:

HeadersInit | undefined

### api:

string

### id?:

string

### messages?:

UIMessage[]

### messageMetadataSchema?:

FlexibleSchema

### dataPartSchemas?:

UIDataTypesToSchemas

### generateId?:

IdGenerator

### onToolCall?:

({toolCall: ToolCall}) => void | Promise<void>

### sendAutomaticallyWhen?:

(options: { messages: UIMessage[] }) => boolean | PromiseLike<boolean>

### onFinish?:

(options: OnFinishOptions) => void

OnFinishOptions

### message:

UIMessage

### messages:

UIMessage[]

### isAbort:

boolean

### isDisconnect:

boolean

### isError:

boolean

### finishReason?:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other'

### onError?:

(error: Error) => void

### onData?:

(dataPart: DataUIPart) => void

### throttle?:

number

### resume?:

boolean

### [Returns](#returns)

### id:

string

### messages:

UIMessage[]

UIMessage

### id:

string

### role:

'system' | 'user' | 'assistant'

### parts:

UIMessagePart[]

### metadata?:

unknown

### status:

'submitted' | 'streaming' | 'ready' | 'error'

### error:

Error | undefined

### sendMessage:

(message?: { text: string; files?: FileList | FileUIPart[]; metadata?; messageId?: string } | CreateUIMessage, options?: ChatRequestOptions) => Promise<void>

ChatRequestOptions

### headers?:

Record<string, string> | Headers

### body?:

object

### metadata?:

unknown

### regenerate:

(options?: { messageId?: string } & ChatRequestOptions) => Promise<void>

### stop:

() => void

### clearError:

() => void

### resumeStream:

() => void

### addToolOutput:

(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error", errorText: string }) => void

### addToolApprovalResponse:

(options: { id: string; approved: boolean; reason?: string }) => void | PromiseLike<void>

### addToolResult:

(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error", errorText: string }) => void

### setMessages:

(messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void

[Learn more](#learn-more)
-------------------------

* [Chatbot](/docs/ai-sdk-ui/chatbot)
* [Chatbot with Tools](/docs/ai-sdk-ui/chatbot-tool-usage)
* [UIMessage](/docs/reference/ai-sdk-core/ui-message)

[Previous

AI SDK UI](/docs/reference/ai-sdk-ui)[Next

useCompletion](/docs/reference/ai-sdk-ui/use-completion)
