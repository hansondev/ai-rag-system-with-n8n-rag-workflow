---
title: "AI_MessageConversionError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-message-conversion-error
section: reference
crawled: 2026-09-20
---

# AI_MessageConversionError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-message-conversion-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_MessageConversionError


[AI\_MessageConversionError](#ai_messageconversionerror)
========================================================

This error occurs when message conversion fails.

[Properties](#properties)
-------------------------

* `originalMessage`: The original message that failed conversion
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_MessageConversionError` using:

```
1

import { MessageConversionError } from 'ai';



2



3

if (MessageConversionError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_LoadSettingError](/docs/reference/ai-sdk-errors/ai-load-setting-error)[Next

AI\_NoContentGeneratedError](/docs/reference/ai-sdk-errors/ai-no-content-generated-error)
