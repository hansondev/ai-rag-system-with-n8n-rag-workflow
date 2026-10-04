---
title: "createAI"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/create-ai
section: reference
crawled: 2026-09-20
---

# createAI

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/create-ai

[AI SDK RSC](/docs/ai-sdk-rsc)createAI


[`createAI`](#createai)
=======================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Creates a client-server context provider that can be used to wrap parts of your application tree to easily manage both UI and AI states of your application.

[Import](#import)
-----------------

```
import { createAI } from "@ai-sdk/rsc"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### actions:

Record<string, Action>

### initialAIState:

any

### initialUIState:

any

### onGetUIState:

() => UIState

### onSetAIState:

(Event) => void

Event

### state:

AIState

### done:

boolean

### [Returns](#returns)

It returns an `<AI/>` context provider.

[Examples](#examples)
---------------------

[Learn to manage AI and UI states in Next.js](/examples/next-app/state-management/ai-ui-states)[Learn to persist and restore states UI/AI states in Next.js](/examples/next-app/state-management/save-and-restore-states)

[Previous

streamUI](/docs/reference/ai-sdk-rsc/stream-ui)[Next

createStreamableUI](/docs/reference/ai-sdk-rsc/create-streamable-ui)
