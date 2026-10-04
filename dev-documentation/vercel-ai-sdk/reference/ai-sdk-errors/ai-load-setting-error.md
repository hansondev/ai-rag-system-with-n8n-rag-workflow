---
title: "AI_LoadSettingError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-load-setting-error
section: reference
crawled: 2026-09-20
---

# AI_LoadSettingError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-load-setting-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_LoadSettingError


[AI\_LoadSettingError](#ai_loadsettingerror)
============================================

This error occurs when a setting is not loaded successfully.

[Properties](#properties)
-------------------------

* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_LoadSettingError` using:

```
1

import { LoadSettingError } from 'ai';



2



3

if (LoadSettingError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_LoadAPIKeyError](/docs/reference/ai-sdk-errors/ai-load-api-key-error)[Next

AI\_MessageConversionError](/docs/reference/ai-sdk-errors/ai-message-conversion-error)
