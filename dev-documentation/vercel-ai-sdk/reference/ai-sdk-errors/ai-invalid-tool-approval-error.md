---
title: "AI_InvalidToolApprovalError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidToolApprovalError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidToolApprovalError


[AI\_InvalidToolApprovalError](#ai_invalidtoolapprovalerror)
============================================================

This error occurs when a tool approval response references an unknown `approvalId`. No matching `tool-approval-request` was found in the message history.

[Properties](#properties)
-------------------------

* `approvalId`: The approval ID that was not found

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidToolApprovalError` using:

```
1

import { InvalidToolApprovalError } from 'ai';



2



3

if (InvalidToolApprovalError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidResponseDataError](/docs/reference/ai-sdk-errors/ai-invalid-response-data-error)[Next

AI\_InvalidToolApprovalSignatureError](/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-signature-error)
