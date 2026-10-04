---
title: "ToolCallRepairError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-tool-call-repair-error
section: reference
crawled: 2026-09-20
---

# ToolCallRepairError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-tool-call-repair-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)ToolCallRepairError


[ToolCallRepairError](#toolcallrepairerror)
===========================================

This error occurs when there is a failure while attempting to repair an invalid tool call.
This typically happens when the AI attempts to fix either
a `NoSuchToolError` or `InvalidToolInputError`.

[Properties](#properties)
-------------------------

* `originalError`: The original error that triggered the repair attempt (either `NoSuchToolError` or `InvalidToolInputError`)
* `message`: The error message
* `cause`: The underlying error that caused the repair to fail

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `ToolCallRepairError` using:

```
1

import { ToolCallRepairError } from 'ai';



2



3

if (ToolCallRepairError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_ToolCallNotFoundForApprovalError](/docs/reference/ai-sdk-errors/ai-tool-call-not-found-for-approval-error)[Next

ToolChoiceViolationError](/docs/reference/ai-sdk-errors/ai-tool-choice-violation-error)
