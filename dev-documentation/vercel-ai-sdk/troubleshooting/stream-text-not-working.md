---
title: "streamText is not working"
source_url: https://ai-sdk.dev/docs/troubleshooting/stream-text-not-working
section: troubleshooting
crawled: 2026-09-20
---

# streamText is not working

> Source: https://ai-sdk.dev/docs/troubleshooting/stream-text-not-working

[Troubleshooting](/docs/troubleshooting)streamText fails silently


[`streamText` is not working](#streamtext-is-not-working)
=========================================================

[Issue](#issue)
---------------

I am using [`streamText`](/docs/reference/ai-sdk-core/stream-text) function, and it does not work.
It does not throw any errors and the stream is only containing error parts.

[Background](#background)
-------------------------

`streamText` immediately starts streaming to enable sending data without waiting for the model.
Errors become part of the stream and are not thrown to prevent e.g. servers from crashing.

[Solution](#solution)
---------------------

To log errors, you can provide an `onError` callback that is triggered when an error occurs.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

onError({ error }) {



7

console.error(error); // your error logging logic here



8

},



9

});
```

[Previous

Abort and resumable streams](/docs/troubleshooting/abort-breaks-resumable-streams)[Next

Streaming Status Shows But No Text Appears](/docs/troubleshooting/streaming-status-delay)
