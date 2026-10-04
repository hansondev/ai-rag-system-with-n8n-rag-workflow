---
title: "useChat/useCompletion stream output contains 0:... instead of text"
source_url: https://ai-sdk.dev/docs/troubleshooting/strange-stream-output
section: troubleshooting
crawled: 2026-09-20
---

# useChat/useCompletion stream output contains 0:... instead of text

> Source: https://ai-sdk.dev/docs/troubleshooting/strange-stream-output

[Troubleshooting](/docs/troubleshooting)useChat/useCompletion stream output contains 0:... instead of text


[useChat/useCompletion stream output contains 0:... instead of text](#usechatusecompletion-stream-output-contains-0-instead-of-text)
====================================================================================================================================

[Issue](#issue)
---------------

I am using custom client code to process a server response that is sent using `StreamingTextResponse`. I am using version `3.0.20` or newer of the AI SDK. When I send a query, the UI streams text such as `0: "Je"`, `0: " suis"`, `0: "des"...` instead of the text that I’m looking for.

[Background](#background)
-------------------------

The AI SDK has switched to the stream data protocol in version `3.0.20`. It sends different stream parts to support data, tool calls, etc. What you see is the raw stream data protocol response.

[Solution](#solution)
---------------------

You have several options:

1. Use the AI Core [`streamText`](/docs/reference/ai-sdk-core/stream-text) function to send a raw text stream:

   ```
   1

   export async function POST(req: Request) {



   2

   const { prompt } = await req.json();



   3



   4

   const result = streamText({



   5

   model: openai.completion('gpt-3.5-turbo-instruct'),



   6

   maxOutputTokens: 2000,



   7

   prompt,



   8

   });



   9



   10

   return createTextStreamResponse({



   11

   stream: toTextStream({ stream: result.stream }),



   12

   });



   13

   }
   ```
2. Pin the AI SDK version to `3.0.19` . This will keep the raw text stream.

[Previous

Server Actions in Client Components](/docs/troubleshooting/server-actions-in-client-components)[Next

Streamable UI Errors](/docs/troubleshooting/streamable-ui-errors)
