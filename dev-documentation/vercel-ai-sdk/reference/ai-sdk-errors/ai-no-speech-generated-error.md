---
title: "AI_NoSpeechGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-speech-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoSpeechGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-speech-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoSpeechGeneratedError


[AI\_NoSpeechGeneratedError](#ai_nospeechgeneratederror)
========================================================

This error occurs when no audio could be generated from the input.

[Properties](#properties)
-------------------------

* `responses`: Array of speech model response metadata (required in constructor)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoSpeechGeneratedError` using:

```
1

import { NoSpeechGeneratedError } from 'ai';



2



3

if (NoSpeechGeneratedError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoOutputGeneratedError](/docs/reference/ai-sdk-errors/ai-no-output-generated-error)[Next

AI\_NoSuchModelError](/docs/reference/ai-sdk-errors/ai-no-such-model-error)
