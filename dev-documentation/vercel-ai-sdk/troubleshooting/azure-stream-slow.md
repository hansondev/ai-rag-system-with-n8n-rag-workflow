---
title: "Azure OpenAI Slow To Stream"
source_url: https://ai-sdk.dev/docs/troubleshooting/azure-stream-slow
section: troubleshooting
crawled: 2026-09-20
---

# Azure OpenAI Slow To Stream

> Source: https://ai-sdk.dev/docs/troubleshooting/azure-stream-slow

[Troubleshooting](/docs/troubleshooting)Azure OpenAI Slow to Stream


[Azure OpenAI Slow To Stream](#azure-openai-slow-to-stream)
===========================================================

[Issue](#issue)
---------------

When using OpenAI hosted on Azure, streaming is slow and in big chunks.

[Cause](#cause)
---------------

This is a Microsoft Azure issue. Some users have reported the following solutions:

* **Update Content Filtering Settings**:
  Inside [Azure AI Studio](https://ai.azure.com/), within "Shared resources" > "Content filters", create a new
  content filter and set the "Streaming mode (Preview)" under "Output filter" from "Default"
  to "Asynchronous Filter".

[Solution](#solution)
---------------------

You can use the [`smoothStream` transformation](/docs/ai-sdk-core/generating-text#smoothing-streams) to stream each word individually.

```
1

import { smoothStream, streamText } from 'ai';



2



3

const result = streamText({



4

model,



5

prompt,



6

experimental_transform: smoothStream(),



7

});
```

[Previous

Troubleshooting](/docs/troubleshooting)[Next

Server Actions in Client Components](/docs/troubleshooting/server-actions-in-client-components)
