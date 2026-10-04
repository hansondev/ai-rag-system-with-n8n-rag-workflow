---
title: "useActions"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/use-actions
section: reference
crawled: 2026-09-20
---

# useActions

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/use-actions

[AI SDK RSC](/docs/ai-sdk-rsc)useActions


[`useActions`](#useactions)
===========================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

It is a hook to help you access your Server Actions from the client. This is particularly useful for building interfaces that require user interactions with the server.

It is required to access these server actions via this hook because they are patched when passed through the context. Accessing them directly may result in a [Cannot find Client Component error](/docs/troubleshooting/server-actions-in-client-components).

[Import](#import)
-----------------

```
import { useActions } from "@ai-sdk/rsc"
```

[API Signature](#api-signature)
-------------------------------

### [Returns](#returns)

`Record<string, Action>`, a dictionary of server actions.

[Examples](#examples)
---------------------

[Learn to manage AI and UI states in Next.js](/examples/next-app/state-management/ai-ui-states)[Learn to route React components using a language model in Next.js](/examples/next-app/interface/route-components)

[Previous

useAIState](/docs/reference/ai-sdk-rsc/use-ai-state)[Next

useUIState](/docs/reference/ai-sdk-rsc/use-ui-state)
