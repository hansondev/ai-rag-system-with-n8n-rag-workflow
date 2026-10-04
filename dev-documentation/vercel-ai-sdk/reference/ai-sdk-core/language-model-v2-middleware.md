---
title: "LanguageModelV4Middleware"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/language-model-v2-middleware
section: reference
crawled: 2026-09-20
---

# LanguageModelV4Middleware

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/language-model-v2-middleware

[AI SDK Core](/docs/ai-sdk-core)LanguageModelV4Middleware


[`LanguageModelV4Middleware`](#languagemodelv4middleware)
=========================================================

Language model middleware is an experimental feature.

Language model middleware provides a way to enhance the behavior of language models
by intercepting and modifying the calls to the language model. It can be used to add
features like guardrails, RAG, caching, and logging in a language model agnostic way.

See [Language Model Middleware](/docs/ai-sdk-core/middleware) for more information.

[Import](#import)
-----------------

```
import { LanguageModelV4Middleware } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### specificationVersion:

'v4'

### transformParams?:

({ type: "generate" | "stream", params: LanguageModelV4CallOptions, model: LanguageModelV4 }) => PromiseLike<LanguageModelV4CallOptions>

### wrapGenerate?:

({ doGenerate: () => PromiseLike<LanguageModelV4GenerateResult>, doStream: () => PromiseLike<LanguageModelV4StreamResult>, params: LanguageModelV4CallOptions, model: LanguageModelV4 }) => PromiseLike<LanguageModelV4GenerateResult>

### wrapStream?:

({ doGenerate: () => PromiseLike<LanguageModelV4GenerateResult>, doStream: () => PromiseLike<LanguageModelV4StreamResult>, params: LanguageModelV4CallOptions, model: LanguageModelV4 }) => PromiseLike<LanguageModelV4StreamResult>

### overrideProvider?:

(options: { model: LanguageModelV4 }) => string

### overrideModelId?:

(options: { model: LanguageModelV4 }) => string

### overrideSupportedUrls?:

(options: { model: LanguageModelV4 }) => PromiseLike<Record<string, RegExp[]>> | Record<string, RegExp[]>

[Previous

wrapImageModel](/docs/reference/ai-sdk-core/wrap-image-model)[Next

extractReasoningMiddleware](/docs/reference/ai-sdk-core/extract-reasoning-middleware)
