---
title: "AI_InvalidResponseDataError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-response-data-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidResponseDataError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-response-data-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidResponseDataError


[AI\_InvalidResponseDataError](#ai_invalidresponsedataerror)
============================================================

This error occurs when the server returns a response with invalid data content.

[Properties](#properties)
-------------------------

* `data`: The invalid response data value
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidResponseDataError` using:

```
1

import { InvalidResponseDataError } from 'ai';



2



3

if (InvalidResponseDataError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidPromptError](/docs/reference/ai-sdk-errors/ai-invalid-prompt-error)[Next

AI\_InvalidToolApprovalError](/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-error)
