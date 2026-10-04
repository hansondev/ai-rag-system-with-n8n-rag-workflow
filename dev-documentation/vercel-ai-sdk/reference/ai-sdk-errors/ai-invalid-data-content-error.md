---
title: "AI_InvalidDataContentError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-data-content-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidDataContentError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-data-content-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidDataContentError


[AI\_InvalidDataContentError](#ai_invaliddatacontenterror)
==========================================================

This error occurs when the data content provided in a multi-modal message part is invalid. Check out the  [prompt examples for multi-modal messages](/docs/foundations/prompts#message-prompts) .

[Properties](#properties)
-------------------------

* `content`: The invalid content value
* `cause`: The underlying error that caused this error (optional)
* `message`: The error message describing the expected and received content types (optional, auto-generated)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidDataContentError` using:

```
1

import { InvalidDataContentError } from 'ai';



2



3

if (InvalidDataContentError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidArgumentError](/docs/reference/ai-sdk-errors/ai-invalid-argument-error)[Next

AI\_InvalidMessageRoleError](/docs/reference/ai-sdk-errors/ai-invalid-message-role-error)
