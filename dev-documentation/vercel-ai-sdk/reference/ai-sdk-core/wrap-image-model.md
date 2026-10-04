---
title: "wrapImageModel()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/wrap-image-model
section: reference
crawled: 2026-09-20
---

# wrapImageModel()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/wrap-image-model

[AI SDK Core](/docs/ai-sdk-core)wrapImageModel


[`wrapImageModel()`](#wrapimagemodel)
=====================================

The `wrapImageModel` function provides a way to enhance the behavior of image models
by wrapping them with middleware.

```
1

import { generateImage, wrapImageModel } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const model = wrapImageModel({



5

model: openai.image('gpt-image-2'),



6

middleware: yourImageModelMiddleware,



7

});



8



9

const { image } = await generateImage({



10

model,



11

prompt: 'Santa Claus driving a Cadillac',



12

});
```

[Import](#import)
-----------------

```
import { wrapImageModel } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

ImageModelV4

### middleware:

ImageModelV4Middleware | ImageModelV4Middleware[]

### modelId:

string

### providerId:

string

### [Returns](#returns)

A new `ImageModelV4` instance with middleware applied.

[Previous

wrapLanguageModel](/docs/reference/ai-sdk-core/wrap-language-model)[Next

LanguageModelV4Middleware](/docs/reference/ai-sdk-core/language-model-v2-middleware)
