---
title: "getMutableAIState"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/get-mutable-ai-state
section: reference
crawled: 2026-09-20
---

# getMutableAIState

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/get-mutable-ai-state

[AI SDK RSC](/docs/ai-sdk-rsc)getMutableAIState


[`getMutableAIState`](#getmutableaistate)
=========================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Get a mutable copy of the AI state. You can use this to update the state in the server.

[Import](#import)
-----------------

```
import { getMutableAIState } from "@ai-sdk/rsc"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### key?:

string

### [Returns](#returns)

The mutable AI state.

### [Methods](#methods)

### update:

(newState: any) => void

### done:

(newState: any) => void

[Examples](#examples)
---------------------

[Learn to persist and restore states AI and UI states in Next.js](/examples/next-app/state-management/save-and-restore-states)

[Previous

getAIState](/docs/reference/ai-sdk-rsc/get-ai-state)[Next

useAIState](/docs/reference/ai-sdk-rsc/use-ai-state)
