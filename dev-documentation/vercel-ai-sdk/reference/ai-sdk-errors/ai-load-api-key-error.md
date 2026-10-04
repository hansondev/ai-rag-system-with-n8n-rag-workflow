---
title: "AI_LoadAPIKeyError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-load-api-key-error
section: reference
crawled: 2026-09-20
---

# AI_LoadAPIKeyError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-load-api-key-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_LoadAPIKeyError


[AI\_LoadAPIKeyError](#ai_loadapikeyerror)
==========================================

This error occurs when API key is not loaded successfully.

[Properties](#properties)
-------------------------

* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_LoadAPIKeyError` using:

```
1

import { LoadAPIKeyError } from 'ai';



2



3

if (LoadAPIKeyError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_JSONParseError](/docs/reference/ai-sdk-errors/ai-json-parse-error)[Next

AI\_LoadSettingError](/docs/reference/ai-sdk-errors/ai-load-setting-error)
