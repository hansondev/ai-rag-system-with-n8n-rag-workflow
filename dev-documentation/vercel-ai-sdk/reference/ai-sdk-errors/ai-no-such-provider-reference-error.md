---
title: "AI_NoSuchProviderReferenceError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-provider-reference-error
section: reference
crawled: 2026-09-20
---

# AI_NoSuchProviderReferenceError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-no-such-provider-reference-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_NoSuchProviderReferenceError


[AI\_NoSuchProviderReferenceError](#ai_nosuchproviderreferenceerror)
====================================================================

This error occurs when a provider reference cannot be resolved because the
specified provider is not found in the provider reference mapping.

[Properties](#properties)
-------------------------

* `provider`: The provider that was not found
* `reference`: The full provider reference mapping that was searched
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_NoSuchProviderReferenceError` using:

```
1

import { NoSuchProviderReferenceError } from 'ai';



2



3

if (NoSuchProviderReferenceError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_NoSuchProviderError](/docs/reference/ai-sdk-errors/ai-no-such-provider-error)[Next

AI\_NoSuchToolError](/docs/reference/ai-sdk-errors/ai-no-such-tool-error)
