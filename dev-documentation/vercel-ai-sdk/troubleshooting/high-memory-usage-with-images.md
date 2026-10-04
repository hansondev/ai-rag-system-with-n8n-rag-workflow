---
title: "High memory usage when processing many images"
source_url: https://ai-sdk.dev/docs/troubleshooting/high-memory-usage-with-images
section: troubleshooting
crawled: 2026-09-20
---

# High memory usage when processing many images

> Source: https://ai-sdk.dev/docs/troubleshooting/high-memory-usage-with-images

[Troubleshooting](/docs/troubleshooting)High memory usage when processing many images


[High memory usage when processing many images](#high-memory-usage-when-processing-many-images)
===============================================================================================

[Issue](#issue)
---------------

When using `generateText` or `streamText` with many images (e.g., in a loop or batch processing), you may notice:

* Memory usage grows continuously and doesn't decrease
* Application eventually runs out of memory
* Memory is not reclaimed even after garbage collection

This is especially noticeable when using `experimental_download` to process images from URLs, or when sending base64-encoded images in prompts.

[Background](#background)
-------------------------

By default, the AI SDK includes the full request messages plus request and response bodies in the step results. When processing images, the request messages and request body can contain base64-encoded image data, which can be very large (a single image can be 1MB+ when base64 encoded). If you process many images and keep references to the results, this data accumulates in memory.

For example, processing 100 images of 500KB each would include ~50MB+ of request body data in memory.

[Solution](#solution)
---------------------

Use the `include` option to disable inclusion of request messages and/or request and response bodies:

```
1

import { generateText } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const result = await generateText({



5

model: openai('gpt-4o'),



6

messages: [



7

{



8

role: 'user',



9

content: [



10

{ type: 'text', text: 'Describe this image' },



11

{ type: 'file', mediaType: 'image', data: imageUrl },



12

],



13

},



14

],



15

// Request and response bodies are excluded by default.



16

include: {



17

requestBody: false,



18

responseBody: false,



19

},



20

});
```

### [Options](#options)

The `include` option accepts:

* `requestBody`: Set to `true` to include the request body in step results. The request body is where base64-encoded images are often stored. Default: `false`. Available in both `generateText` and `streamText`.
* `requestMessages`: Set to `true` to include the request messages in step results. The request messages can contain large message content such as images and files. Default: `false`. Available in both `generateText` and `streamText`.
* `rawChunks`: Set to `true` to include raw provider chunks in the stream. Default: `false`. Only available in `streamText`.
* `responseBody`: Set to `true` to include the response body in step results. Default: `false`. Only available in `generateText`.

### [When to use](#when-to-use)

* **Batch processing images**: When processing many images in a loop
* **Long-running agents**: When an agent may process many images over its lifetime
* **Memory-constrained environments**: When running in environments with limited memory

### [Trade-offs](#trade-offs)

When you disable body inclusion:

* You won't have access to `result.request.body` or `result.response.body`
* You won't have access to `result.request.messages` unless `requestMessages` is enabled
* Debugging may be harder since you can't inspect the raw request/response
* If you need the bodies for logging or debugging, consider extracting the data you need before the next iteration

[Example: Processing multiple images](#example-processing-multiple-images)
--------------------------------------------------------------------------

```
1

import { generateText } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const imageUrls = [



5

/* array of image URLs */



6

];



7

const results = [];



8



9

for (const imageUrl of imageUrls) {



10

const result = await generateText({



11

model: openai('gpt-4o'),



12

messages: [



13

{



14

role: 'user',



15

content: [



16

{ type: 'text', text: 'Describe this image' },



17

{ type: 'file', mediaType: 'image', data: imageUrl },



18

],



19

},



20

],



21

include: {



22

requestBody: false,



23

},



24

});



25



26

// Only store the text result, not the full result object



27

results.push(result.text);



28

}
```

[Learn more](#learn-more)
-------------------------

* [`generateText` API Reference](/docs/reference/ai-sdk-core/generate-text)
* [`streamText` API Reference](/docs/reference/ai-sdk-core/stream-text)

[Previous

Jest: cannot find module '@ai-sdk/rsc'](/docs/troubleshooting/jest-cannot-find-module-ai-rsc)
