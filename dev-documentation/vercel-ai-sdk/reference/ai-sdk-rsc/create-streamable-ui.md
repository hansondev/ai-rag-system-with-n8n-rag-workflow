---
title: "createStreamableUI"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/create-streamable-ui
section: reference
crawled: 2026-09-20
---

# createStreamableUI

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/create-streamable-ui

[AI SDK RSC](/docs/ai-sdk-rsc)createStreamableUI


[`createStreamableUI`](#createstreamableui)
===========================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Create a stream that sends UI from the server to the client. On the client side, it can be rendered as a normal React node.

[Import](#import)
-----------------

```
import { createStreamableUI } from "@ai-sdk/rsc"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### initialValue?:

ReactNode

### [Returns](#returns)

### value:

ReactNode

### [Methods](#methods)

### update:

(ReactNode) => void

### append:

(ReactNode) => void

### done:

(ReactNode | null) => void

### error:

(Error) => void

[Examples](#examples)
---------------------

[Render a React component during a tool call](/examples/next-app/tools/render-interface-during-tool-call)

[Previous

createAI](/docs/reference/ai-sdk-rsc/create-ai)[Next

createStreamableValue](/docs/reference/ai-sdk-rsc/create-streamable-value)
