---
title: "createStreamableValue"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/create-streamable-value
section: reference
crawled: 2026-09-20
---

# createStreamableValue

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/create-streamable-value

[AI SDK RSC](/docs/ai-sdk-rsc)createStreamableValue


[`createStreamableValue`](#createstreamablevalue)
=================================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Create a stream that sends values from the server to the client. The value can be any serializable data.

[Import](#import)
-----------------

```
import { createStreamableValue } from "@ai-sdk/rsc"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### value:

any

### [Returns](#returns)

### value:

StreamableValue

### [Methods](#methods)

### update:

(value: T) => StreamableValueWrapper

### append:

(value: T) => StreamableValueWrapper

### done:

(value?: T) => StreamableValueWrapper

### error:

(error: any) => StreamableValueWrapper

[Previous

createStreamableUI](/docs/reference/ai-sdk-rsc/create-streamable-ui)[Next

readStreamableValue](/docs/reference/ai-sdk-rsc/read-streamable-value)
