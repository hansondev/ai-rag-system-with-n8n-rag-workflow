---
title: "AI_UnsupportedFunctionalityError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-unsupported-functionality-error
section: reference
crawled: 2026-09-20
---

# AI_UnsupportedFunctionalityError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-unsupported-functionality-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_UnsupportedFunctionalityError


[AI\_UnsupportedFunctionalityError](#ai_unsupportedfunctionalityerror)
======================================================================

This error occurs when functionality is not supported.

[Properties](#properties)
-------------------------

* `functionality`: The name of the unsupported functionality
* `message`: The error message (optional, auto-generated from `functionality`)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_UnsupportedFunctionalityError` using:

```
1

import { UnsupportedFunctionalityError } from 'ai';



2



3

if (UnsupportedFunctionalityError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_UIMessageStreamError](/docs/reference/ai-sdk-errors/ai-ui-message-stream-error)[Next

AI SDK TUI](/docs/reference/ai-sdk-tui)
