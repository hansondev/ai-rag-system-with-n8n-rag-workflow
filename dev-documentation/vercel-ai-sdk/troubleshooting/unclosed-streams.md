---
title: "Unclosed Streams"
source_url: https://ai-sdk.dev/docs/troubleshooting/unclosed-streams
section: troubleshooting
crawled: 2026-09-20
---

# Unclosed Streams

> Source: https://ai-sdk.dev/docs/troubleshooting/unclosed-streams

[Troubleshooting](/docs/troubleshooting)Unclosed Streams


[Unclosed Streams](#unclosed-streams)
=====================================

Sometimes streams are not closed properly, which can lead to unexpected behavior. The following are some common issues that can occur when streams are not closed properly.

[Issue](#issue)
---------------

The streamable UI has been slow to update.

[Solution](#solution)
---------------------

This happens when you create a streamable UI using [`createStreamableUI`](/docs/reference/ai-sdk-rsc/create-streamable-ui) and fail to close the stream.
In order to fix this, you must ensure you close the stream by calling the [`.done()`](/docs/reference/ai-sdk-rsc/create-streamable-ui#done) method.
This will ensure the stream is closed.

```
1

import { createStreamableUI } from '@ai-sdk/rsc';



2



3

const submitMessage = async () => {



4

'use server';



5



6

const stream = createStreamableUI('1');



7



8

stream.update('2');



9

stream.append('3');



10

stream.done('4'); // [!code ++]



11



12

return stream.value;



13

};
```

[Previous

Getting Timeouts When Deploying on Vercel](/docs/troubleshooting/timeout-on-vercel)[Next

useChat Failed to Parse Stream](/docs/troubleshooting/use-chat-failed-to-parse-stream)
