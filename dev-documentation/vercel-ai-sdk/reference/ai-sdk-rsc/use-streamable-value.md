---
title: "useStreamableValue"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/use-streamable-value
section: reference
crawled: 2026-09-20
---

# useStreamableValue

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-rsc/use-streamable-value

[AI SDK RSC](/docs/ai-sdk-rsc)useStreamableValue


[`useStreamableValue`](#usestreamablevalue)
===========================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

It is a React hook that takes a streamable value created using [`createStreamableValue`](/docs/reference/ai-sdk-rsc/create-streamable-value) and returns the current value, error, and pending state.

[Import](#import)
-----------------

```
import { useStreamableValue } from "@ai-sdk/rsc"
```

[Example](#example)
-------------------

This is useful for consuming streamable values received from a component's props.

```
1

function MyComponent({ streamableValue }) {



2

const [data, error, pending] = useStreamableValue(streamableValue);



3



4

if (pending) return <div>Loading...</div>;



5

if (error) return <div>Error: {error.message}</div>;



6



7

return <div>Data: {data}</div>;



8

}
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

It accepts a streamable value created using `createStreamableValue`.

### [Returns](#returns)

It is an array, where the first element contains the data, the second element contains an error if it is thrown anytime during the stream, and the third is a boolean indicating if the value is pending.

[Previous

useUIState](/docs/reference/ai-sdk-rsc/use-ui-state)[Next

render (Removed)](/docs/reference/ai-sdk-rsc/render)
