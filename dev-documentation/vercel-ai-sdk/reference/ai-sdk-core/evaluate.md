---
title: "experimental_evaluate()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/evaluate
section: reference
crawled: 2026-09-20
---

# experimental_evaluate()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/evaluate

[AI SDK Core](/docs/ai-sdk-core)experimental\_evaluate


[`experimental_evaluate()`](#experimental_evaluate)
===================================================

```
1

import { experimental_evaluate } from 'ai';
```

Evaluates a nonempty map of `choice`, `score`, and `boolean` questions against one
state. See [Evaluation](/docs/ai-sdk-core/evaluation) for examples and semantics.

[Parameters](#parameters)
-------------------------

| Parameter | Type | Description |
| --- | --- | --- |
| `model` | `Experimental_EvaluationModel` | Required experimental v4 model instance or a string ID resolved by Gateway or an explicitly configured evaluation-capable default provider. |
| `state` | `string | object | array` | Required JSON-compatible shared state. |
| `questions` | `Record<string, Experimental_EvaluationQuestion>` | Required nonempty question map. |
| `maxRetries` | `number` | Nonnegative integer; defaults to 2. |
| `abortSignal` | `AbortSignal` | Cancels evaluation. |
| `headers` | `Record<string, string>` | Additional HTTP headers. |
| `providerOptions` | `ProviderOptions` | Provider-specific options. |

[Result](#result)
-----------------

Returns `Promise<Experimental_EvaluationResult<QUESTIONS>>`:

* `answers`: One typed answer per question ID, with literal Choice option inference.
* `usage`: `inputTokens`, `outputTokens`, and `totalTokens`, each possibly undefined.
* `warnings`: Provider warnings, also passed to the SDK warning logger.
* `rounding`: Optional provider-declared decimal precision for probabilities and scores.
* `providerMetadata`: Optional provider-specific metadata.
* `response`: Timestamp, model ID, and optional response ID, headers, and body.

[Provider specification](#provider-specification)
-------------------------------------------------

`Experimental_EvaluationModelV4` is exported from `@ai-sdk/provider` and declares
`specificationVersion: 'v4'`, `provider`, `modelId`, `supportedQuestionTypes`, and
`doEvaluate(options)`. Evaluation is isolated from stable `ProviderV4`.

The public core types are `Experimental_EvaluationModel`,
`Experimental_EvaluationQuestion`, `Experimental_EvaluationAnswer`, and
`Experimental_EvaluationResult`. All evaluation-specific classes use the
`Evaluation` prefix, with `Experimental_` aliases at package boundaries.

[Errors](#errors)
-----------------

Unsupported types throw `Experimental_EvaluationUnsupportedQuestionTypeError`
before provider I/O. Invalid inputs throw `InvalidArgumentError`; malformed
answers throw `InvalidResponseDataError`. Invalid answers are not retried.
Neither partial results nor missing probability synthesis are supported.

[Model resolution](#model-resolution)
-------------------------------------

Use `registry.evaluationModel('provider:model')` or
`customProvider({ evaluationModels: { alias: model } }).evaluationModel('alias')`
to resolve models. Strings passed directly to `experimental_evaluate` use
`globalThis.AI_SDK_DEFAULT_PROVIDER.evaluationModel(id)`, when available. Evaluation
never implicitly falls back to Gateway.

Resolution errors use the existing `NoSuchModelError` and `NoSuchProviderError`
classes with `modelType: 'evaluationModel'`. Model instances and resolved models
must implement v4; other versions throw `UnsupportedModelVersionError`.
See [model resolution examples](/docs/ai-sdk-core/evaluation#model-aliases-and-registries).

[Previous

experimental\_generateVideo](/docs/reference/ai-sdk-core/generate-video)[Next

uploadFile](/docs/reference/ai-sdk-core/upload-file)
