---
title: "useChat \"Failed to Parse Stream String\" Error"
source_url: https://ai-sdk.dev/docs/troubleshooting/use-chat-failed-to-parse-stream
section: troubleshooting
crawled: 2026-09-20
---

# useChat "Failed to Parse Stream String" Error

> Source: https://ai-sdk.dev/docs/troubleshooting/use-chat-failed-to-parse-stream

[Troubleshooting](/docs/troubleshooting)useChat Failed to Parse Stream


[`useChat` "Failed to Parse Stream String" Error](#usechat-failed-to-parse-stream-string-error)
===============================================================================================

[Issue](#issue)
---------------

I am using [`useChat`](/docs/reference/ai-sdk-ui/use-chat) or [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion), and I am getting a `"Failed to parse stream string. Invalid code"` error. I am using version `3.0.20` or newer of the AI SDK.

[Background](#background)
-------------------------

The AI SDK has switched to the stream data protocol in version `3.0.20`.
[`useChat`](/docs/reference/ai-sdk-ui/use-chat) and [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion) expect stream parts that support data, tool calls, etc.
What you see is a failure to parse the stream.
This can be caused by using an older version of the AI SDK in the backend, by providing a text stream using a custom provider, or by using a raw LangChain stream result.

[Solution](#solution)
---------------------

You can switch [`useChat`](/docs/reference/ai-sdk-ui/use-chat) and [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion) to raw text stream processing with the [`streamProtocol`](/docs/reference/ai-sdk-ui/use-completion#stream-protocol) parameter.
Set it to `text` as follows:

```
1

const { messages, append } = useChat({ streamProtocol: 'text' });
```

[Previous

Unclosed Streams](/docs/troubleshooting/unclosed-streams)[Next

Server Action Plain Objects Error](/docs/troubleshooting/client-stream-error)
