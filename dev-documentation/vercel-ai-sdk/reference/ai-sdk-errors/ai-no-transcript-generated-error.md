---
title: "AI_NoTranscriptGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-transcript-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoTranscriptGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-transcript-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoTranscriptGeneratedError


[AI\_NoTranscriptGeneratedError](#ai_notranscriptgeneratederror)
================================================================

This error occurs when no transcript could be generated from the input.

[Properties](#properties)
-------------------------

* `responses`: Array of transcription model response metadata (required in constructor)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoTranscriptGeneratedError` using:

```
1

import { NoTranscriptGeneratedError } from 'ai';



2



3

if (NoTranscriptGeneratedError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoSuchToolError](/docs/reference/ai-sdk-errors/ai-no-such-tool-error)[Next

AI\_NoTranslationGeneratedError](/docs/reference/ai-sdk-errors/ai-no-translation-generated-error)
