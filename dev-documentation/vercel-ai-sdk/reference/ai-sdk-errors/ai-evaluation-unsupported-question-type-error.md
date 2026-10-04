---
title: "AI_EvaluationUnsupportedQuestionTypeError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-evaluation-unsupported-question-type-error
section: reference
crawled: 2026-09-20
---

# AI_EvaluationUnsupportedQuestionTypeError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-evaluation-unsupported-question-type-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_EvaluationUnsupportedQuestionTypeError


[AI\_EvaluationUnsupportedQuestionTypeError](#ai_evaluationunsupportedquestiontypeerror)
========================================================================================

This experimental error identifies a question whose type is unsupported by an
evaluation model. It is exported from `ai` and `@ai-sdk/provider` as
`Experimental_EvaluationUnsupportedQuestionTypeError`.

[Properties](#properties)
-------------------------

* `questionId`: The ID of the unsupported question.
* `questionType`: The requested question type.
* `provider`: The provider of the evaluation model.
* `modelId`: The evaluation model ID.
* `message`: A description of the unsupported question and model. Providers can
  supply a custom message.

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

Use the marker-based `isInstance` check, which works across package copies:

```
1

import { Experimental_EvaluationUnsupportedQuestionTypeError as EvaluationUnsupportedQuestionTypeError } from 'ai';



2



3

if (EvaluationUnsupportedQuestionTypeError.isInstance(error)) {



4

console.log(error.questionId, error.questionType, error.modelId);



5

}
```

[Previous

AI\_EmptyResponseBodyError](/docs/reference/ai-sdk-errors/ai-empty-response-body-error)[Next

AI\_InvalidArgumentError](/docs/reference/ai-sdk-errors/ai-invalid-argument-error)
