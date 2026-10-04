---
title: "ToolChoiceViolationError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-tool-choice-violation-error
section: reference
crawled: 2026-09-20
---

# ToolChoiceViolationError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-tool-choice-violation-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)ToolChoiceViolationError


[ToolChoiceViolationError](#toolchoiceviolationerror)
=====================================================

This error occurs when a `generateText` response does not satisfy an enforced
tool choice. It is thrown when `toolChoice` is set to `'required'` but the
response contains no structured tool call, or when a specifically selected tool
was not called.

The error does not automatically interpret text or reasoning as an executable
tool call. You can inspect `content` to implement opt-in recovery, including
schema validation before executing any recovered call.

[Properties](#properties)
-------------------------

* `toolChoice`: The effective tool choice that the response did not satisfy
* `finishReason`: The reason why the model finished generating the response
* `provider`: The provider that returned the response
* `modelId`: The model that returned the response
* `content`: The normalized content returned by the model
* `message`: The error message

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `ToolChoiceViolationError` using:

```
1

import { ToolChoiceViolationError } from 'ai';



2



3

if (ToolChoiceViolationError.isInstance(error)) {



4

const serializedCall = error.content.find(part => part.type === 'text')?.text;



5



6

// Parse and validate serializedCall before treating it as a tool call.



7

}
```

[Previous

ToolCallRepairError](/docs/reference/ai-sdk-errors/ai-tool-call-repair-error)[Next

AI\_TypeValidationError](/docs/reference/ai-sdk-errors/ai-type-validation-error)
