---
title: "Video Generation"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/video-generation
section: ai-sdk-core
crawled: 2026-09-20
---

# Video Generation

> Source: https://ai-sdk.dev/docs/ai-sdk-core/video-generation

[AI SDK Core](/docs/ai-sdk-core)Video Generation


[Video Generation](#video-generation)
=====================================

Video generation is an experimental feature. The API may change in future
versions.

The AI SDK provides the [`experimental_generateVideo`](/docs/reference/ai-sdk-core/generate-video)
function to generate videos based on a given prompt using a video model.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A cat walking on a treadmill',



6

});
```

You can access the video data using the `base64` or `uint8Array` properties:

```
1

const base64 = video.base64; // base64 video data



2

const uint8Array = video.uint8Array; // Uint8Array video data
```

[Settings](#settings)
---------------------

### [Aspect Ratio](#aspect-ratio)

The aspect ratio is specified as a string in the format `{width}:{height}`.
Models only support a few aspect ratios, and the supported aspect ratios are different for each model and provider.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A cat walking on a treadmill',



6

aspectRatio: '16:9',



7

});
```

Some models also accept `'adaptive'`, which lets the provider derive the output
ratio from the input media instead of a fixed value. This is typically required
for image-to-video, video editing, and video extension, where the output
inherits the ratio of the input and an explicit ratio is rejected.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: { image: firstFrame, text: 'A cat walking on a treadmill' },



6

aspectRatio: 'adaptive',



7

});
```

### [Resolution](#resolution)

The resolution is specified as a string in the format `{width}x{height}`.
Models only support specific resolutions, and the supported resolutions are different for each model and provider.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A serene mountain landscape at sunset',



6

resolution: '1280x720',



7

});
```

### [Duration](#duration)

Some video models support specifying the duration of the generated video in seconds.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A timelapse of clouds moving across the sky',



6

duration: 5,



7

});
```

### [Frames Per Second (FPS)](#frames-per-second-fps)

Some video models allow you to specify the frames per second for the generated video.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A hummingbird in slow motion',



6

fps: 24,



7

});
```

### [Audio Generation](#audio-generation)

Some video models can generate audio alongside the video. Use the `generateAudio` option to control this:

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A jazz band playing in a cozy club',



6

generateAudio: true,



7

});
```

### [Generating Multiple Videos](#generating-multiple-videos)

`experimental_generateVideo` supports generating multiple videos at once:

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

prompt: 'A rocket launching into space',



6

n: 3, // number of videos to generate



7

});
```

`experimental_generateVideo` will automatically call the model as often as
needed (in parallel) to generate the requested number of videos.

Each video model has an internal limit on how many videos it can generate in a single API call. The AI SDK manages this automatically by batching requests appropriately when you request multiple videos using the `n` parameter. Most video models only support generating 1 video per call due to computational cost.

If needed, you can override this behavior using the `maxVideosPerCall` setting:

GatewayProviderCustom

Veo 3.1

```
1

const { videos } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: 'A rocket launching into space',



4

maxVideosPerCall: 2, // Override the default batch size



5

n: 4, // Will make 2 calls of 2 videos each



6

});
```

### [Image-to-Video Generation](#image-to-video-generation)

Some video models support generating videos from an input image. You can provide an image using the prompt object:

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: {



6

image: 'https://example.com/my-image.png',



7

text: 'Animate this image with gentle motion',



8

},



9

});
```

You can also provide the image as a base64-encoded string or `Uint8Array`:

GatewayProviderCustom

Veo 3.1

```
1

const { video } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: {



4

image: imageBase64String, // or imageUint8Array



5

text: 'Animate this image',



6

},



7

});
```

### [First and Last Frame](#first-and-last-frame)

Some video models support first-last-frame generation, where you provide the
starting and/or ending frames of the video. Use the `frameImages` option to pass
role-tagged images in a provider-agnostic way:

GatewayProviderCustom

Veo 3.1

```
1

const { video } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: 'The cat walks across the scene and transforms into a dog by the end',



4

frameImages: [



5

{



6

image: 'https://example.com/first-frame.png',



7

frameType: 'first_frame',



8

},



9

{



10

image: 'https://example.com/last-frame.png',



11

frameType: 'last_frame',



12

},



13

],



14

});
```

### [Reference Inputs](#reference-inputs)

Some video models support reference-to-video generation, where you provide one or
more reference images or videos that the model incorporates into the generated video. Use the `inputReferences` option to pass
these inputs in a provider-agnostic way:

GatewayProviderCustom

Veo 3.1

```
1

const { video } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: 'The two characters meet in a bustling market',



4

inputReferences: [



5

'https://example.com/character-1.png',



6

'https://example.com/character-2.png',



7

],



8

});
```

For URL-based video references, use the object form with an explicit `mediaType`:

GatewayProviderCustom

Veo 3.1

```
1

const { video } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: 'Match the motion in the reference clip',



4

inputReferences: [



5

{



6

data: 'https://example.com/reference.mp4',



7

mediaType: 'video/mp4',



8

},



9

],



10

});
```

Providers route each reference by its media type (image vs. video) and emit a
warning when a reference kind is unsupported (for example, providers that accept
only image references warn and ignore a video reference).

### [Providing a Seed](#providing-a-seed)

You can provide a seed to the `experimental_generateVideo` function to control the output of the video generation process.
If supported by the model, the same seed will always produce the same video.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A cat walking on a treadmill',



6

seed: 1234567890,



7

});
```

### [Provider-specific Settings](#provider-specific-settings)

Video models often have provider- or even model-specific settings.
You can pass such settings to the `experimental_generateVideo` function
using the `providerOptions` parameter. The options for the provider
become request body properties.

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2

import { fal } from '@ai-sdk/fal';



3



4

const { video } = await generateVideo({



5

model: fal.video('luma-dream-machine/ray-2'),



6

prompt: 'A cat walking on a treadmill',



7

aspectRatio: '16:9',



8

providerOptions: {



9

fal: { loop: true, motionStrength: 0.8 },



10

},



11

});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

`experimental_generateVideo` accepts an optional `abortSignal` parameter of
type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
that you can use to abort the video generation process or set a timeout.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A cat walking on a treadmill',



6

abortSignal: AbortSignal.timeout(60000), // Abort after 60 seconds



7

});
```

Video generation typically takes longer than image generation. Consider using
longer timeouts (60 seconds or more) depending on the model and video length.

### [Polling](#polling)

Video generation is an asynchronous process that can take several minutes to complete. The SDK automatically polls the provider to check if the video is ready. You can configure the polling behavior:

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2

import { fal } from '@ai-sdk/fal';



3



4

const { video } = await generateVideo({



5

model: fal.video('luma-dream-machine/ray-2'),



6

prompt: 'A cinematic timelapse of a city from dawn to dusk',



7

duration: 10,



8

poll: {



9

intervalMs: 5000, // Check every 5 seconds (default)



10

timeoutMs: 600000, // Timeout after 10 minutes (default)



11

},



12

});
```

For durable workflows that provide their own sleep primitive, pass it as
`poll.delay`. The custom delay is used for both polling intervals and webhook
timeouts.

### [Webhooks](#webhooks)

For models with native webhook support, pass a `webhook` factory that returns a
public URL and a promise that resolves when your application receives the
webhook request:

```
1

import { fal } from '@ai-sdk/fal';



2

import { experimental_generateVideo as generateVideo } from 'ai';



3

import { createWebhook } from './create-webhook';



4



5

const { video } = await generateVideo({



6

model: fal.video('luma-dream-machine/ray-2'),



7

prompt: 'A cinematic timelapse of a city from dawn to dusk',



8

poll: {



9

timeoutMs: 600000, // Wait up to 10 minutes for the webhook



10

},



11

webhook: async () => {



12

const { url, received } = await createWebhook();



13

return { url, received };



14

},



15

});
```

`createWebhook` is an application-specific helper that registers a webhook
listener before returning. Its `received` promise must resolve with the request
`headers` and `body`. The SDK sends `url` to the provider, waits for `received`,
and then retrieves the completed video.

You can provide `poll` together with `webhook`. For models with native webhook
support, `poll.timeoutMs` limits how long the SDK waits for the notification.
If the model does not support webhooks, the SDK falls back to polling with the
provided interval and timeout.

### [Custom Headers](#custom-headers)

`experimental_generateVideo` accepts an optional `headers` parameter of type `Record<string, string>`
that you can use to add custom headers to the video generation request.

GatewayProviderCustom

Veo 3.1

```
1

import { experimental_generateVideo as generateVideo } from 'ai';



2



3

const { video } = await generateVideo({



4

model: "google/veo-3.1-generate-001",



5

prompt: 'A cat walking on a treadmill',



6

headers: { 'X-Custom-Header': 'custom-value' },



7

});
```

### [Warnings](#warnings)

If the model returns warnings, e.g. for unsupported parameters, they will be available in the `warnings` property of the response.

GatewayProviderCustom

Veo 3.1

```
1

const { video, warnings } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: 'A cat walking on a treadmill',



4

});
```

### [Additional Provider-specific Metadata](#additional-provider-specific-metadata)

Some providers expose additional metadata for the result overall or per video.

```
1

const prompt = 'A cat walking on a treadmill';



2



3

const { video, providerMetadata } = await generateVideo({



4

model: fal.video('luma-dream-machine/ray-2'),



5

prompt,



6

});



7



8

// Access provider-specific metadata



9

const videoMetadata = providerMetadata.fal?.videos[0];



10

console.log({



11

duration: videoMetadata?.duration,



12

fps: videoMetadata?.fps,



13

width: videoMetadata?.width,



14

height: videoMetadata?.height,



15

});
```

The outer key of the returned `providerMetadata` is the provider name. The inner values are the metadata. A `videos` key is typically present in the metadata and is an array with the same length as the top level `videos` key.

When generating multiple videos with `n > 1`, you can also access per-call metadata through the `responses` array:

GatewayProviderCustom

Veo 3.1

```
1

const { videos, responses } = await generateVideo({



2

model: "google/veo-3.1-generate-001",



3

prompt: 'A rocket launching into space',



4

n: 5, // May require multiple API calls



5

});



6



7

// Access metadata from each individual API call



8

for (const response of responses) {



9

console.log({



10

timestamp: response.timestamp,



11

modelId: response.modelId,



12

// Per-call provider metadata (lossless)



13

providerMetadata: response.providerMetadata,



14

});



15

}
```

### [Error Handling](#error-handling)

When `experimental_generateVideo` cannot generate a valid video, it throws a [`AI_NoVideoGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-video-generated-error).

This error occurs when the AI provider fails to generate a video. It can arise due to the following reasons:

* The model failed to generate a response
* The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

* `responses`: Metadata about the video model responses, including timestamp, model, and headers.
* `cause`: The cause of the error. You can use this for more detailed error handling

```
1

import {



2

experimental_generateVideo as generateVideo,



3

NoVideoGeneratedError,



4

} from 'ai';



5



6

try {



7

await generateVideo({ model, prompt });



8

} catch (error) {



9

if (NoVideoGeneratedError.isInstance(error)) {



10

console.log('NoVideoGeneratedError');



11

console.log('Cause:', error.cause);



12

console.log('Responses:', error.responses);



13

}



14

}
```

[Video Models](#video-models)
-----------------------------

| Provider | Model | Features |
| --- | --- | --- |
| [Black Forest Labs](/providers/ai-sdk-providers/black-forest-labs#video-models) | `flux-3-video` | Text-to-video, image-to-video, keyframes, video continuation, audio generation |
| [FAL](/providers/ai-sdk-providers/fal#video-models) | `luma-dream-machine/ray-2` | Text-to-video, image-to-video |
| [FAL](/providers/ai-sdk-providers/fal#video-models) | `minimax-video` | Text-to-video |
| [Google](/providers/ai-sdk-providers/google#video-models) | `veo-2.0-generate-001` | Text-to-video, up to 4 videos per call |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#video-models) | `veo-3.1-generate-001` | Text-to-video, audio generation |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#video-models) | `veo-3.1-fast-generate-001` | Text-to-video, audio generation |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#video-models) | `veo-3.0-generate-001` | Text-to-video, audio generation |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#video-models) | `veo-3.0-fast-generate-001` | Text-to-video, audio generation |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#video-models) | `veo-2.0-generate-001` | Text-to-video, up to 4 videos per call |
| [Kling AI](/providers/ai-sdk-providers/klingai#video-models) | `kling-v2.6-t2v` | Text-to-video |
| [Kling AI](/providers/ai-sdk-providers/klingai#video-models) | `kling-v2.6-i2v` | Image-to-video |
| [Kling AI](/providers/ai-sdk-providers/klingai#video-models) | `kling-v2.6-motion-control` | Motion control |
| [Replicate](/providers/ai-sdk-providers/replicate#video-models) | `minimax/video-01` | Text-to-video |
| [xAI](/providers/ai-sdk-providers/xai#video-models) | `grok-imagine-video` | Text-to-video, image-to-video, editing, extension, R2V |
| [xAI](/providers/ai-sdk-providers/xai#video-models) | `grok-imagine-video-1.5` | Text-to-video, image-to-video, editing, extension, R2V (with reference audio) |

Above are a small subset of the video models supported by the AI SDK providers. For more, see the respective provider documentation.

[Previous

Speech](/docs/ai-sdk-core/speech)[Next

File Uploads](/docs/ai-sdk-core/file-uploads)
