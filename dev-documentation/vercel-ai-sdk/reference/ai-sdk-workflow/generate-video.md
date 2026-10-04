---
title: "generateVideo()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-workflow/generate-video
section: reference
crawled: 2026-09-20
---

# generateVideo()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-workflow/generate-video

[AI SDK Workflow](/docs/reference/ai-sdk-workflow)experimental\_generateVideo


[`generateVideo()`](#generatevideo)
===================================

Generates videos durably inside a workflow. The helper starts an asynchronous
video generation job with a Workflow webhook URL, suspends the workflow until
the provider sends a terminal notification, and then retrieves the completed
result with one status request.

Unlike [`experimental_generateVideo`](/docs/reference/ai-sdk-core/generate-video)
from `ai`, this helper does not download provider-hosted videos. URL results
remain URLs so your workflow can decide whether to persist, copy, or process
them in another step without serializing the video bytes through workflow step
boundaries.

```
1

import { experimental_generateVideo as generateVideo } from '@ai-sdk/workflow/video';



2



3

export async function videoWorkflow(prompt: string) {



4

'use workflow';



5



6

// The workflow suspends while the video renders, consuming no compute.



7

const result = await generateVideo({



8

model: 'klingai/kling-v3.0-t2v',



9

prompt,



10

});



11



12

return result.videos;



13

}
```

The selected model must support asynchronous start and status operations and
provider webhooks. The helper must be called from a Workflow SDK workflow.

[Import](#import)
-----------------

```
import { experimental_generateVideo as generateVideo } from "@ai-sdk/workflow/video"
```

[Parameters](#parameters)
-------------------------

The helper accepts the same parameters as `experimental_startVideo` from `ai`,
except `webhookUrl` and `abortSignal`. It creates and manages the webhook URL.

### model:

VideoModel

### prompt:

string | GenerateVideoPrompt

### n?:

number

### aspectRatio?:

`${number}:${number}` | "adaptive"

### resolution?:

`${number}x${number}`

### duration?:

number

### maxVideosPerCall?:

number

### fps?:

number

### seed?:

number

### frameImages?:

Array<{ image: DataContent; frameType: VideoModelV4FrameType }>

### inputReferences?:

Array<DataContent | { data: DataContent; mediaType?: string }>

### generateAudio?:

boolean

### providerOptions?:

ProviderOptions

### headers?:

Record<string, string>

### maxRetries?:

number

[Returns](#returns)
-------------------

Returns the completed status result from the provider. `videos` contains raw
provider video data discriminated by `type`:

* `url`: A provider-hosted URL and media type
* `base64`: Base64-encoded video data and media type
* `binary`: A `Uint8Array` and media type

Hosted URLs can expire. Handle any video you need to retain in a separate
workflow step.

[Previous

WorkflowChatTransport](/docs/reference/ai-sdk-workflow/workflow-chat-transport)[Next

AI SDK Errors](/docs/reference/ai-sdk-errors)
