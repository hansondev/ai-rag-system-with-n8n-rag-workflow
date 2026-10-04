---
title: "AI_NoContentGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-content-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoContentGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-content-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoContentGeneratedError


[AI\_NoContentGeneratedError](#ai_nocontentgeneratederror)
==========================================================

This error occurs when the AI provider fails to generate content.

[Properties](#properties)
-------------------------

* `message`: The error message (optional, defaults to `'No content generated.'`)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoContentGeneratedError` using:

```
1

import { NoContentGeneratedError } from 'ai';



2



3

if (NoContentGeneratedError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_MessageConversionError](/docs/reference/ai-sdk-errors/ai-message-conversion-error)[Next

AI\_NoImageGeneratedError](/docs/reference/ai-sdk-errors/ai-no-image-generated-error)
