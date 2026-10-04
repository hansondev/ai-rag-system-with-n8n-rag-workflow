---
title: "AI_InvalidMessageRoleError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-message-role-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidMessageRoleError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-message-role-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidMessageRoleError


[AI\_InvalidMessageRoleError](#ai_invalidmessageroleerror)
==========================================================

This error occurs when an invalid message role is provided.

[Properties](#properties)
-------------------------

* `role`: The invalid role value
* `message`: The error message (optional, auto-generated from `role`)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidMessageRoleError` using:

```
1

import { InvalidMessageRoleError } from 'ai';



2



3

if (InvalidMessageRoleError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidDataContentError](/docs/reference/ai-sdk-errors/ai-invalid-data-content-error)[Next

AI\_InvalidPromptError](/docs/reference/ai-sdk-errors/ai-invalid-prompt-error)
