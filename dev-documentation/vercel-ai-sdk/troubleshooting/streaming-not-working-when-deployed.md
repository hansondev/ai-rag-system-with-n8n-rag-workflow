---
title: "Streaming Not Working When Deployed"
source_url: https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-deployed
section: troubleshooting
crawled: 2026-09-20
---

# Streaming Not Working When Deployed

> Source: https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-deployed

[Troubleshooting](/docs/troubleshooting)Streaming Not Working When Deployed


[Streaming Not Working When Deployed](#streaming-not-working-when-deployed)
===========================================================================

[Issue](#issue)
---------------

Streaming with the AI SDK works in my local development environment.
However, when deploying, streaming does not work in the deployed app.
Instead of streaming, only the full response is returned after a while.

[Cause](#cause)
---------------

The causes of this issue are varied and depend on the deployment environment.

[Solution](#solution)
---------------------

You can try the following:

* add `'Transfer-Encoding': 'chunked'` and/or `Connection: 'keep-alive'` headers

  ```
  1

  return createUIMessageStreamResponse({



  2

  stream: toUIMessageStream({ stream: result.stream }),



  3

  headers: {



  4

  'Transfer-Encoding': 'chunked',



  5

  Connection: 'keep-alive',



  6

  },



  7

  });
  ```

[Previous

Tool Invocation Missing Result Error](/docs/troubleshooting/tool-invocation-missing-result)[Next

Streaming Not Working When Proxied](/docs/troubleshooting/streaming-not-working-when-proxied)
