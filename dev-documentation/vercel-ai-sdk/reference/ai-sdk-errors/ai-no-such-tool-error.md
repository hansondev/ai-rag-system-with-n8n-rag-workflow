---
title: "AI_NoSuchToolError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-tool-error
section: reference
crawled: 2026-09-20
---

# AI_NoSuchToolError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-tool-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoSuchToolError


[AI\_NoSuchToolError](#ai_nosuchtoolerror)
==========================================

This error occurs when a model tries to call an unavailable tool.

[Properties](#properties)
-------------------------

* `toolName`: The name of the tool that was not found
* `availableTools`: Array of available tool names (optional)
* `message`: The error message (optional, auto-generated from `toolName` and `availableTools`)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoSuchToolError` using:

```
1

import { NoSuchToolError } from 'ai';



2



3

if (NoSuchToolError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoSuchProviderReferenceError](/docs/reference/ai-sdk-errors/ai-no-such-provider-reference-error)[Next

AI\_NoTranscriptGeneratedError](/docs/reference/ai-sdk-errors/ai-no-transcript-generated-error)
