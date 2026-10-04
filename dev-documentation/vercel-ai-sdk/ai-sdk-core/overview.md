---
title: "AI SDK Core"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/overview
section: ai-sdk-core
crawled: 2026-09-20
---

# AI SDK Core

> Source: https://ai-sdk.dev/docs/ai-sdk-core/overview

[AI SDK Core](/docs/ai-sdk-core)Overview


[AI SDK Core](#ai-sdk-core)
===========================

Large Language Models (LLMs) are advanced programs that can understand, create, and engage with human language on a large scale.
They are trained on vast amounts of written material to recognize patterns in language and predict what might come next in a given piece of text.

AI SDK Core **simplifies working with LLMs by offering a standardized way of integrating them into your app** - so you can focus on building great AI applications for your users, not waste time on technical details.

For example, here’s how you can generate text with various models using the AI SDK:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from "ai";



2



3

const { text } = await generateText({



4

model: "xai/grok-4.6",



5

prompt: "What is love?",



6

});
```

Love is a complex and multifaceted emotion that can be felt and expressed in many different ways. It involves deep affection, care, compassion, and connection towards another person or thing.

[AI SDK Core Functions](#ai-sdk-core-functions)
-----------------------------------------------

AI SDK Core has various functions designed for [text generation](./generating-text), [structured data generation](./generating-structured-data), and [tool usage](./tools-and-tool-calling).
These functions take a standardized approach to setting up [prompts](/docs/foundations/prompts) and [settings](./settings), making it easier to work with different models.

* [`generateText`](/docs/ai-sdk-core/generating-text): Generates text and [tool calls](./tools-and-tool-calling).
  This function is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.
* [`streamText`](/docs/ai-sdk-core/generating-text): Stream text and tool calls.
  You can use the `streamText` function for interactive use cases such as [chat bots](/docs/ai-sdk-ui/chatbot) and [content streaming](/docs/ai-sdk-ui/completion).

Both `generateText` and `streamText` support [structured output](/docs/ai-sdk-core/generating-structured-data) via the `output` property (e.g. `Output.object()`, `Output.array()`), allowing you to generate typed, schema-validated data for information extraction, synthetic data generation, classification tasks, and [streaming generated UIs](/docs/ai-sdk-ui/object-generation).

[API Reference](#api-reference)
-------------------------------

Please check out the [AI SDK Core API Reference](/docs/reference/ai-sdk-core) for more details on each function.

[Previous

AI SDK Core](/docs/ai-sdk-core)[Next

Generating Text](/docs/ai-sdk-core/generating-text)
