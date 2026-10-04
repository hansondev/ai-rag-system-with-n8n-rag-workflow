---
title: "AI_JSONParseError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-json-parse-error
section: reference
crawled: 2026-09-20
---

# AI_JSONParseError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-json-parse-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_JSONParseError


[AI\_JSONParseError](#ai_jsonparseerror)
========================================

This error occurs when JSON fails to parse.

[Properties](#properties)
-------------------------

* `text`: The text value that could not be parsed
* `cause`: The underlying parsing error (required in constructor)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_JSONParseError` using:

```
1

import { JSONParseError } from 'ai';



2



3

if (JSONParseError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidToolInputError](/docs/reference/ai-sdk-errors/ai-invalid-tool-input-error)[Next

AI\_LoadAPIKeyError](/docs/reference/ai-sdk-errors/ai-load-api-key-error)
