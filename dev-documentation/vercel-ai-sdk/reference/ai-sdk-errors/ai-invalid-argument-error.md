---
title: "AI_InvalidArgumentError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-argument-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidArgumentError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-argument-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidArgumentError


[AI\_InvalidArgumentError](#ai_invalidargumenterror)
====================================================

This error occurs when an invalid argument was provided.

For example, `getTextFromDataUrl` throws this error when its `dataUrl` argument
is malformed or cannot be decoded. Utility validation that is used by higher
level APIs also uses this error, so you can handle invalid arguments with one
stable error guard.

[Properties](#properties)
-------------------------

* `parameter`: The name of the parameter that is invalid
* `value`: The invalid value
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidArgumentError` using:

```
1

import { InvalidArgumentError } from 'ai';



2



3

if (InvalidArgumentError.isInstance(error)) {



4

console.error(`Invalid ${error.parameter}:`, error.message);



5

}
```

[Previous

AI\_EvaluationUnsupportedQuestionTypeError](/docs/reference/ai-sdk-errors/ai-evaluation-unsupported-question-type-error)[Next

AI\_InvalidDataContentError](/docs/reference/ai-sdk-errors/ai-invalid-data-content-error)
