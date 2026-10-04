---
title: "AI_NoVideoGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-video-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoVideoGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-video-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoVideoGeneratedError


[AI\_NoVideoGeneratedError](#ai_novideogeneratederror)
======================================================

This error occurs when the AI provider fails to generate a video.
It can arise due to the following reasons:

* The model failed to generate a response.
* The model generated an invalid response.

[Properties](#properties)
-------------------------

* `message`: The error message (optional, defaults to `'No video generated.'`).
* `responses`: Metadata about the video model responses, including timestamp, model, and headers (optional).
* `cause`: The cause of the error. You can use this for more detailed error handling (optional).

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoVideoGeneratedError` using:

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

[Previous

AI\_NoTranslationGeneratedError](/docs/reference/ai-sdk-errors/ai-no-translation-generated-error)[Next

AI\_RetryError](/docs/reference/ai-sdk-errors/ai-retry-error)
