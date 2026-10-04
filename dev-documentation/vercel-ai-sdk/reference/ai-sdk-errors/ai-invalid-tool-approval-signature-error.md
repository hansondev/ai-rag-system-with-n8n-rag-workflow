---
title: "AI_InvalidToolApprovalSignatureError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-signature-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidToolApprovalSignatureError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-signature-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidToolApprovalSignatureError


[AI\_InvalidToolApprovalSignatureError](#ai_invalidtoolapprovalsignatureerror)
==============================================================================

This error occurs when `experimental_toolApprovalSecret` is configured and a tool approval replayed from the message history has a missing or invalid HMAC signature. The server rejects the approval before the tool executes.

Common causes:

* The approval was fabricated by the client (no signature present)
* The tool arguments were modified after the approval was signed
* The server secret changed between issuance and verification (e.g. after key rotation without overlap)

[Properties](#properties)
-------------------------

* `approvalId`: The approval ID that failed verification
* `toolCallId`: The tool call ID the approval was for

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidToolApprovalSignatureError` using:

```
1

import { InvalidToolApprovalSignatureError } from 'ai';



2



3

if (InvalidToolApprovalSignatureError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidToolApprovalError](/docs/reference/ai-sdk-errors/ai-invalid-tool-approval-error)[Next

AI\_InvalidToolInputError](/docs/reference/ai-sdk-errors/ai-invalid-tool-input-error)
