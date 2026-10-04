---
title: "useUIState"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/use-ui-state
section: reference
crawled: 2026-09-20
---

# useUIState

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/use-ui-state

[AI SDK RSC](/docs/ai-sdk-rsc)useUIState


[`useUIState`](#useuistate)
===========================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

It is a hook that enables you to read and update the UI State. The state is client-side and can contain functions, React nodes, and other data. UIState is the visual representation of the AI state.

[Import](#import)
-----------------

```
import { useUIState } from "@ai-sdk/rsc"
```

[API Signature](#api-signature)
-------------------------------

### [Returns](#returns)

Similar to useState, it is an array, where the first element is the current UI state and the second element is the function that updates the state.

[Examples](#examples)
---------------------

[Learn to manage AI and UI states in Next.js](/examples/next-app/state-management/ai-ui-states)

[Previous

useActions](/docs/reference/ai-sdk-rsc/use-actions)[Next

useStreamableValue](/docs/reference/ai-sdk-rsc/use-streamable-value)
