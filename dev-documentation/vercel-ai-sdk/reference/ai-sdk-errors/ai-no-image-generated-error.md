---
title: "AI_NoImageGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-image-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoImageGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-image-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoImageGeneratedError


[AI\_NoImageGeneratedError](#ai_noimagegeneratederror)
======================================================

This error occurs when the AI provider fails to generate an image.
It can arise due to the following reasons:

* The model failed to generate a response.
* The model generated an invalid response.

[Properties](#properties)
-------------------------

* `message`: The error message (optional, defaults to `'No image generated.'`).
* `calls`: Results from the underlying image model calls, including generated images, provider metadata, response metadata, warnings, and usage (optional).
* `responses`: Metadata about the image model responses, including timestamp, model, and headers (optional).
* `cause`: The cause of the error. You can use this for more detailed error handling (optional).

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoImageGeneratedError` using:

```
1

import { generateImage, NoImageGeneratedError } from 'ai';



2



3

try {



4

await generateImage({ model, prompt });



5

} catch (error) {



6

if (NoImageGeneratedError.isInstance(error)) {



7

console.log('NoImageGeneratedError');



8

console.log('Cause:', error.cause);



9

console.log('Responses:', error.responses);



10



11

for (const call of error.calls ?? []) {



12

console.log('Provider metadata:', call.providerMetadata);



13

console.log('Warnings:', call.warnings);



14

console.log('Usage:', call.usage);



15

}



16

}



17

}
```

[Previous

AI\_NoContentGeneratedError](/docs/reference/ai-sdk-errors/ai-no-content-generated-error)[Next

AI\_NoObjectGeneratedError](/docs/reference/ai-sdk-errors/ai-no-object-generated-error)
