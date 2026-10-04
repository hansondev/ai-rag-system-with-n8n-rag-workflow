---
title: "AI SDK"
source_url: https://ai-sdk.dev/docs/introduction
section: introduction
crawled: 2026-09-20
---

# AI SDK

> Source: https://ai-sdk.dev/docs/introduction

AI SDK by Vercel


[AI SDK](#ai-sdk)
=================

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications and agents with React, Next.js, Vue, Svelte, Node.js, and more.

[Why use the AI SDK?](#why-use-the-ai-sdk)
------------------------------------------

Integrating large language models (LLMs) into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK standardizes integrating artificial intelligence (AI) models across [supported providers](/docs/foundations/providers-and-models). This enables developers to focus on building great AI applications, not waste time on technical details.

The AI SDK also includes a [harness abstraction](/docs/ai-sdk-harnesses) for using
established agent harnesses such as Claude Code, Codex, and Pi through
`HarnessAgent`. Harnesses are decoupled from model providers, but use compatible
stream and response primitives so AI SDK UI and agent surfaces can consume them
in the same way.

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

The AI SDK has these primary surfaces:

* **[AI SDK Core](/docs/ai-sdk-core):** A unified API for generating text, structured objects, tool calls, and building agents with LLMs.
* **[AI SDK UI](/docs/ai-sdk-ui):** A set of framework-agnostic hooks for quickly building chat and generative user interface.
* **[AI SDK Harnesses](/docs/ai-sdk-harnesses):** A uniform API for running established agent harnesses with `HarnessAgent`.

[Model Providers](#model-providers)
-----------------------------------

The AI SDK supports [multiple model providers](/providers).

[Vercel AI Gateway

Image InputImage GenerationObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/ai-gateway)[OpenAI

Image InputImage GenerationObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/openai)[Anthropic

Image InputObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/anthropic)[Google Generative AI

![Google Generative AI logo](/_next/image?url=%2Ficons%2Fgoogle.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Image InputObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/google)[xAI Grok

Image InputImage GenerationObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/xai)[Azure

![Azure logo](/_next/image?url=%2Ficons%2Fazure.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Image InputObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/azure)[Amazon Bedrock

Image InputImage GenerationObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/amazon-bedrock)[Groq

Image InputObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/groq)[Fal AI

Image Generation](/providers/ai-sdk-providers/fal)[DeepInfra

Image InputObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/deepinfra)[Google Vertex AI

![Google Vertex AI logo](/_next/image?url=%2Ficons%2Fgoogle.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Image InputImage GenerationObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/google-vertex)[Mistral

![Mistral logo](/_next/image?url=%2Ficons%2Fmistral.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Image InputObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/mistral)[Together.ai

Object GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/togetherai)[Cohere

![Cohere logo](/_next/image?url=%2Ficons%2Fcohere.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Tool UsageTool Streaming](/providers/ai-sdk-providers/cohere)[Fireworks

![Fireworks logo](/_next/image?url=%2Ficons%2Ffireworks.png&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Image GenerationObject GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/fireworks)[DeepSeek

![DeepSeek logo](/_next/image?url=%2Ficons%2Fdeepseek.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Object GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/deepseek)[Cerebras

Object GenerationTool UsageTool Streaming](/providers/ai-sdk-providers/cerebras)[Perplexity

![Perplexity logo](/_next/image?url=%2Ficons%2Fperplexity.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)](/providers/ai-sdk-providers/perplexity)[Luma AI

![Luma AI logo](/_next/image?url=%2Ficons%2Fluma.png&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Image Generation](/providers/ai-sdk-providers/luma)[Baseten

![Baseten logo](/_next/image?url=%2Ficons%2Fbaseten.svg&w=256&q=75&dpl=dpl_4FjzsWmnYfX3CLWCTxTYma1Ti8wD)

Object GenerationTool Usage](/providers/ai-sdk-providers/baseten)

[Templates](#templates)
-----------------------

We've built some [templates](https://vercel.com/templates?type=ai) that include AI SDK integrations for different use cases, providers, and frameworks. You can use these templates to get started with your AI-powered application.

### [Starter Kits](#starter-kits)

[Chatbot Starter Template

Uses the AI SDK and Next.js. Features persistence, multi-modal chat, and more.](https://vercel.com/templates/next.js/nextjs-ai-chatbot)[Internal Knowledge Base (RAG)

Uses AI SDK Language Model Middleware for RAG and enforcing guardrails.](https://vercel.com/templates/next.js/ai-sdk-internal-knowledge-base)[Multi-Modal Chat

Uses Next.js and AI SDK useChat hook for multi-modal message chat interface.](https://vercel.com/templates/next.js/multi-modal-chatbot)[Semantic Image Search

An AI semantic image search app template built with Next.js, AI SDK, and Postgres.](https://vercel.com/templates/next.js/semantic-image-search)[Natural Language PostgreSQL

Query PostgreSQL using natural language with AI SDK and GPT-4o.](https://vercel.com/templates/next.js/natural-language-postgres)

### [Feature Exploration](#feature-exploration)

[Feature Flags Example

AI SDK with Next.js, Feature Flags, and Edge Config for dynamic model switching.](https://vercel.com/templates/next.js/ai-sdk-feature-flags-edge-config)[Chatbot with Telemetry

AI SDK chatbot with OpenTelemetry support.](https://vercel.com/templates/next.js/ai-chatbot-telemetry)[Structured Object Streaming

Uses AI SDK useObject hook to stream structured object generation.](https://vercel.com/templates/next.js/use-object)[Multi-Step Tools

Uses AI SDK streamText function to handle multiple tool steps automatically.](https://vercel.com/templates/next.js/ai-sdk-roundtrips)

### [Frameworks](#frameworks)

[Next.js OpenAI Starter

Uses OpenAI GPT-4, AI SDK, and Next.js.](https://github.com/vercel/ai/tree/main/examples/next-openai)[Nuxt OpenAI Starter

Uses OpenAI GPT-4, AI SDK, and Nuxt.js.](https://github.com/vercel/ai/tree/main/examples/nuxt-openai)[SvelteKit OpenAI Starter

Uses OpenAI GPT-4, AI SDK, and SvelteKit.](https://github.com/vercel/ai/tree/main/examples/sveltekit-openai)[Solid OpenAI Starter

Uses OpenAI GPT-4, AI SDK, and Solid.](https://github.com/vercel/ai/tree/main/examples/solidstart-openai)

### [Generative UI](#generative-ui)

[Gemini Chatbot

Uses Google Gemini, AI SDK, and Next.js.](https://vercel.com/templates/next.js/gemini-ai-chatbot)[Generative UI with RSC (experimental)

Uses Next.js, AI SDK, and streamUI to create generative UIs with React Server Components.](https://vercel.com/templates/next.js/rsc-genui)

### [Security](#security)

[Bot Protection

Uses Kasada, OpenAI GPT-4, AI SDK, and Next.js.](https://vercel.com/templates/next.js/advanced-ai-bot-protection)[Rate Limiting

Uses Vercel KV, OpenAI GPT-4, AI SDK, and Next.js.](https://github.com/vercel/ai/tree/main/examples/next-openai-upstash-rate-limits)

[Join our Community](#join-our-community)
-----------------------------------------

If you have questions about anything related to the AI SDK, you're always welcome to ask our community on [the Vercel Community](https://community.vercel.com/c/ai-sdk/62).

[`llms.txt` (for Cursor, Windsurf, Copilot, Claude etc.)](#llmstxt-for-cursor-windsurf-copilot-claude-etc)
----------------------------------------------------------------------------------------------------------

You can access the entire AI SDK documentation in Markdown format at [ai-sdk.dev/llms.txt](/llms.txt). This can be used to ask any LLM (assuming it has a big enough context window) questions about the AI SDK based on the most up-to-date documentation.

### [Example Usage](#example-usage)

For instance, to prompt an LLM with questions about the AI SDK:

1. Copy the documentation contents from [ai-sdk.dev/llms.txt](/llms.txt)
2. Use the following prompt format:

```
1

Documentation:



2

{paste documentation here}



3

---



4

Based on the above documentation, answer the following:



5

{your question}
```

[Next

Foundations](/docs/foundations)
