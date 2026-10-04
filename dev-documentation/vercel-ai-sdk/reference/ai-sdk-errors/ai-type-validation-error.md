---
title: "AI_TypeValidationError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-type-validation-error
section: reference
crawled: 2026-09-20
---

# AI_TypeValidationError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-type-validation-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_TypeValidationError


[AI\_TypeValidationError](#ai_typevalidationerror)
==================================================

This error occurs when type validation fails.

[Properties](#properties)
-------------------------

* `value`: The value that failed validation
* `cause`: The underlying validation error (required in constructor)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_TypeValidationError` using:

```
1

import { TypeValidationError } from 'ai';



2



3

if (TypeValidationError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

ToolChoiceViolationError](/docs/reference/ai-sdk-errors/ai-tool-choice-violation-error)[Next

AI\_UIMessageStreamError](/docs/reference/ai-sdk-errors/ai-ui-message-stream-error)
