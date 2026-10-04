---
title: "AI_ToolCallNotFoundForApprovalError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-tool-call-not-found-for-approval-error
section: reference
crawled: 2026-09-20
---

# AI_ToolCallNotFoundForApprovalError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-tool-call-not-found-for-approval-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_ToolCallNotFoundForApprovalError


[AI\_ToolCallNotFoundForApprovalError](#ai_toolcallnotfoundforapprovalerror)
============================================================================

This error occurs when a tool approval request references a tool call that was not found. This can happen when processing provider-emitted approval requests (e.g., MCP flows) where the referenced tool call ID does not exist.

[Properties](#properties)
-------------------------

* `toolCallId`: The tool call ID that was not found
* `approvalId`: The approval request ID

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_ToolCallNotFoundForApprovalError` using:

```
1

import { ToolCallNotFoundForApprovalError } from 'ai';



2



3

if (ToolCallNotFoundForApprovalError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_TooManyEmbeddingValuesForCallError](/docs/reference/ai-sdk-errors/ai-too-many-embedding-values-for-call-error)[Next

ToolCallRepairError](/docs/reference/ai-sdk-errors/ai-tool-call-repair-error)
