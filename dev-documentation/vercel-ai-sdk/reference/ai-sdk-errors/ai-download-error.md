---
title: "AI_DownloadError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-download-error
section: reference
crawled: 2026-09-20
---

# AI_DownloadError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-download-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_DownloadError


[AI\_DownloadError](#ai_downloaderror)
======================================

This error occurs when a download fails.

[Properties](#properties)
-------------------------

* `url`: The URL that failed to download
* `statusCode`: The HTTP status code returned by the server (optional)
* `statusText`: The HTTP status text returned by the server (optional)
* `cause`: The underlying error that caused the download to fail (optional)
* `message`: The error message containing details about the download failure (optional, auto-generated)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_DownloadError` using:

```
1

import { DownloadError } from 'ai';



2



3

if (DownloadError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_APICallError](/docs/reference/ai-sdk-errors/ai-api-call-error)[Next

AI\_EmptyResponseBodyError](/docs/reference/ai-sdk-errors/ai-empty-response-body-error)
