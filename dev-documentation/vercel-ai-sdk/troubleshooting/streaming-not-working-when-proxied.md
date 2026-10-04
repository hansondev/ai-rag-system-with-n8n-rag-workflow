---
title: "Streaming Not Working When Proxied"
source_url: https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-proxied
section: troubleshooting
crawled: 2026-09-20
---

# Streaming Not Working When Proxied

> Source: https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-proxied

[Troubleshooting](/docs/troubleshooting)Streaming Not Working When Proxied


[Streaming Not Working When Proxied](#streaming-not-working-when-proxied)
=========================================================================

[Issue](#issue)
---------------

Streaming with the AI SDK doesn't work in local development environment, or deployed in some proxy environments.
Instead of streaming, only the full response is returned after a while.

[Cause](#cause)
---------------

The causes of this issue are caused by the proxy middleware.

If the middleware is configured to compress the response, it will cause the streaming to fail.

[Solution](#solution)
---------------------

You can try the following, the solution only affects the streaming API:

* add `'Content-Encoding': 'none'` headers

  ```
  1

  return createUIMessageStreamResponse({



  2

  stream: toUIMessageStream({ stream: result.stream }),



  3

  headers: {



  4

  'Content-Encoding': 'none',



  5

  },



  6

  });
  ```

[Previous

Streaming Not Working When Deployed](/docs/troubleshooting/streaming-not-working-when-deployed)[Next

Getting Timeouts When Deploying on Vercel](/docs/troubleshooting/timeout-on-vercel)
