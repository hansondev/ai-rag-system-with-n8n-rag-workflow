---
title: "generateImage()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-image
section: reference
crawled: 2026-09-20
---

# generateImage()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-image

[AI SDK Core](/docs/ai-sdk-core)generateImage


[`generateImage()`](#generateimage)
===================================

Generates images based on a given prompt using an image model.

It is ideal for use cases where you need to generate images programmatically,
such as creating visual content or generating images for data augmentation.

GatewayProviderCustom

GPT Image 1

```
1

import { generateImage } from 'ai';



2



3

const { images } = await generateImage({



4

model: "openai/gpt-image-1",



5

prompt: 'A futuristic cityscape at sunset',



6

n: 3,



7

size: '1024x1024',



8

});



9



10

console.log(images);
```

[Import](#import)
-----------------

```
import { generateImage } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

ImageModelV4

### prompt:

string | GenerateImagePrompt

object

### images:

Array<DataContent>

### text:

string

### mask:

DataContent

### n?:

number

### size?:

string

### aspectRatio?:

string

### seed?:

number

### providerOptions?:

ProviderOptions

### maxImagesPerCall?:

number

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### [Returns](#returns)

### image:

GeneratedFile

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### images:

Array<GeneratedFile>

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### warnings:

Warning[]

### usage:

ImageModelUsage

ImageModelUsage

### imagesGenerated:

number

### providerMetadata?:

ImageModelProviderMetadata

### responses:

Array<ImageModelResponseMetadata>

ImageModelResponseMetadata

### timestamp:

Date

### modelId:

string

### headers?:

Record<string, string>

[Previous

rerank](/docs/reference/ai-sdk-core/rerank)[Next

experimental\_streamTranscribe](/docs/reference/ai-sdk-core/stream-transcribe)
