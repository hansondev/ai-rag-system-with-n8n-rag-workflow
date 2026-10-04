---
title: "experimental_generateVideo()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-video
section: reference
crawled: 2026-09-20
---

# experimental_generateVideo()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-video

[AI SDK Core](/docs/ai-sdk-core)experimental\_generateVideo


[`experimental_generateVideo()`](#experimental_generatevideo)
=============================================================

Video generation is an experimental feature. The API may change in future
versions.

Generates videos based on a given prompt using a video model.

It is ideal for use cases where you need to generate videos programmatically,
such as creating visual content, animations, or generating videos from images.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { videos } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A cat walking on a treadmill',



6

aspectRatio: '16:9',



7

});



8



9

console.log(videos);
```

[Import](#import)
-----------------

```
import { experimental_generateVideo } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

VideoModelV4

### prompt:

string | GenerateVideoPrompt

object

### image:

DataContent

### text:

string

### n?:

number

### aspectRatio?:

string

### resolution?:

string

### duration?:

number

### fps?:

number

### seed?:

number

### frameImages?:

Array<{ image: DataContent; frameType: "first\_frame" | "last\_frame" }>

### inputReferences?:

Array<DataContent | { data: DataContent; mediaType?: string }>

### generateAudio?:

boolean

### providerOptions?:

ProviderOptions

### maxVideosPerCall?:

number

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### download?:

(options: { url: URL; abortSignal?: AbortSignal }) => Promise<{ data: Uint8Array; mediaType: string | undefined }>

### poll?:

object

object

### intervalMs?:

number

### timeoutMs?:

number

### delay?:

(delayInMs: number, options?: { abortSignal?: AbortSignal }) => PromiseLike<void>

### webhook?:

() => PromiseLike<{ url: string; received: PromiseLike<VideoModelV4OperationWebhook> }>

### [Returns](#returns)

### video:

GeneratedFile

GeneratedFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### videos:

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

### providerMetadata?:

VideoModelProviderMetadata

### responses:

Array<VideoModelResponseMetadata>

VideoModelResponseMetadata

### timestamp:

Date

### modelId:

string

### headers?:

Record<string, string>

### providerMetadata?:

VideoModelProviderMetadata

[Previous

generateSpeech](/docs/reference/ai-sdk-core/generate-speech)[Next

experimental\_evaluate](/docs/reference/ai-sdk-core/evaluate)
