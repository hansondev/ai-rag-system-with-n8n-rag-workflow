---
title: "AI_EmptyResponseBodyError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-empty-response-body-error
section: reference
crawled: 2026-09-20
---

# AI_EmptyResponseBodyError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-empty-response-body-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_EmptyResponseBodyError


[AI\_EmptyResponseBodyError](#ai_emptyresponsebodyerror)
========================================================

This error occurs when the server returns an empty response body.

[Properties](#properties)
-------------------------

* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_EmptyResponseBodyError` using:

```
1

import { EmptyResponseBodyError } from 'ai';



2



3

if (EmptyResponseBodyError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_DownloadError](/docs/reference/ai-sdk-errors/ai-download-error)[Next

AI\_EvaluationUnsupportedQuestionTypeError](/docs/reference/ai-sdk-errors/ai-evaluation-unsupported-question-type-error)
