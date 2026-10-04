---
title: "AI_NoOutputGeneratedError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-output-generated-error
section: reference
crawled: 2026-09-20
---

# AI_NoOutputGeneratedError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-output-generated-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoOutputGeneratedError


[AI\_NoOutputGeneratedError](#ai_nooutputgeneratederror)
========================================================

This error is thrown when no LLM output was generated, e.g. because of errors.

For `generateText`, accessing `result.output` throws this error when the result
does not contain an output. This can happen when the final step does not finish
with a `stop` reason, for example when it finishes with `tool-calls`. The
`output` property is a getter, so destructuring it also triggers this access.

[Properties](#properties)
-------------------------

* `message`: The error message (optional, defaults to `'No output generated.'`)
* `cause`: The underlying error that caused no output to be generated (optional)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoOutputGeneratedError` using:

```
1

import { NoOutputGeneratedError } from 'ai';



2



3

if (NoOutputGeneratedError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoObjectGeneratedError](/docs/reference/ai-sdk-errors/ai-no-object-generated-error)[Next

AI\_NoSpeechGeneratedError](/docs/reference/ai-sdk-errors/ai-no-speech-generated-error)
