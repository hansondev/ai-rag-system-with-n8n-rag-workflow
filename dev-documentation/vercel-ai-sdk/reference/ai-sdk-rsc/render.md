---
title: "render (Removed)"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/render
section: reference
crawled: 2026-09-20
---

# render (Removed)

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/render

[AI SDK RSC](/docs/ai-sdk-rsc)render (Removed)


[`render` (Removed)](#render-removed)
=====================================

"render" has been removed in AI SDK 4.0.

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

A helper function to create a streamable UI from LLM providers. This function is similar to AI SDK Core APIs and supports the same model interfaces.

> **Note**: `render` has been deprecated in favor of [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui). During migration, please ensure that the `messages` parameter follows the updated [specification](/docs/reference/ai-sdk-rsc/stream-ui#messages).

[Import (No longer available)](#import-no-longer-available)
-----------------------------------------------------------

The following import will no longer work since `render` has been removed:

```
import { render } from "@ai-sdk/rsc"
```

Use [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui) instead.

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

string

### provider:

provider client

### initial?:

ReactNode

### messages:

Array<SystemMessage | UserMessage | AssistantMessage | ToolMessage>

SystemMessage

### role:

'system'

### content:

string

UserMessage

### role:

'user'

### content:

string

AssistantMessage

### role:

'assistant'

### content:

string

### tool\_calls:

ToolCall[]

ToolCall

### id:

string

### type:

'function'

### function:

Function

Function

### name:

string

### arguments:

string

ToolMessage

### role:

'tool'

### content:

string

### toolCallId:

string

### functions?:

ToolSet

Tool

### description?:

string

### parameters:

zod schema

### render?:

async (parameters) => any

### tools?:

ToolSet

Tool

### description?:

string

### parameters:

zod schema

### render?:

async (parameters) => any

### text?:

(Text) => ReactNode

Text

### content:

string

### delta:

string

### done:

boolean

### temperature?:

number

### [Returns](#returns)

It can return any valid ReactNode.

[Previous

useStreamableValue](/docs/reference/ai-sdk-rsc/use-streamable-value)[Next

AI SDK Workflow](/docs/reference/ai-sdk-workflow)
