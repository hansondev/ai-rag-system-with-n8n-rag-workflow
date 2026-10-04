---
title: "AI_NoTranslationGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-translation-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoTranslationGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-translation-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoTranslationGeneratedError


[AI\_NoTranslationGeneratedError](#ai_notranslationgeneratederror)
==================================================================

This error occurs when no translation could be generated from the input audio:
no `audio` part was emitted and the final output text is empty, or the stream
ended without a finish event.

[Properties](#properties)
-------------------------

* `response`: Speech translation model response metadata (required in constructor)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoTranslationGeneratedError` using:

```
1

import { NoTranslationGeneratedError } from 'ai';



2



3

if (NoTranslationGeneratedError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoTranscriptGeneratedError](/docs/reference/ai-sdk-errors/ai-no-transcript-generated-error)[Next

AI\_NoVideoGeneratedError](/docs/reference/ai-sdk-errors/ai-no-video-generated-error)
