---
title: "wrapLanguageModel()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/wrap-language-model
section: reference
crawled: 2026-09-20
---

# wrapLanguageModel()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/wrap-language-model

[AI SDK Core](/docs/ai-sdk-core)wrapLanguageModel


[`wrapLanguageModel()`](#wraplanguagemodel)
===========================================

The `wrapLanguageModel` function provides a way to enhance the behavior of language models
by wrapping them with middleware.
See [Language Model Middleware](/docs/ai-sdk-core/middleware) for more information on middleware.

```
1

import { wrapLanguageModel, gateway } from 'ai';



2



3

const wrappedLanguageModel = wrapLanguageModel({



4

model: gateway('openai/gpt-4.1'),



5

middleware: yourLanguageModelMiddleware,



6

});
```

[Import](#import)
-----------------

```
import { wrapLanguageModel } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

LanguageModelV4

### middleware:

LanguageModelV4Middleware | LanguageModelV4Middleware[]

### modelId:

string

### providerId:

string

### [Returns](#returns)

A new `LanguageModelV4` instance with middleware applied.

[Previous

cosineSimilarity](/docs/reference/ai-sdk-core/cosine-similarity)[Next

wrapImageModel](/docs/reference/ai-sdk-core/wrap-image-model)
