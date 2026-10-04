---
title: "AI_InvalidToolInputError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-tool-input-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidToolInputError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-tool-input-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidToolInputError


[AI\_InvalidToolInputError](#ai_invalidtoolinputerror)
======================================================

This error occurs when invalid tool input was provided.

[Properties](#properties)
-------------------------

* `toolName`: The name of the tool with invalid inputs
* `toolInput`: The invalid tool inputs
* `message`: The error message
* `cause`: The cause of the error

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidToolInputError` using:

```
1

import { InvalidToolInputError } from 'ai';



2



3

if (InvalidToolInputError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidToolApprovalSignatureError](/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-signature-error)[Next

AI\_JSONParseError](/docs/reference/ai-sdk-errors/ai-json-parse-error)
