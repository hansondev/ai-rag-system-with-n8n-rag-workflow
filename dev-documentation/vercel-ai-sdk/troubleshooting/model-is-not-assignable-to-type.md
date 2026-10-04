---
title: "Model is not assignable to type \"LanguageModelV1\""
source_url: https://ai-sdk.dev/docs/troubleshooting/model-is-not-assignable-to-type
section: troubleshooting
crawled: 2026-09-20
---

# Model is not assignable to type "LanguageModelV1"

> Source: https://ai-sdk.dev/docs/troubleshooting/model-is-not-assignable-to-type

[Troubleshooting](/docs/troubleshooting)Model is not assignable to type "LanguageModelV1"


[Model is not assignable to type "LanguageModelV1"](#model-is-not-assignable-to-type-languagemodelv1)
=====================================================================================================

[Issue](#issue)
---------------

I have updated the AI SDK and now I get the following error: `Type 'SomeModel' is not assignable to type 'LanguageModelV1'.`

Similar errors can occur with `EmbeddingModelV4` as well.

[Background](#background)
-------------------------

Sometimes new features are being added to the model specification.
This can cause incompatibilities with older provider versions.

[Solution](#solution)
---------------------

Update your provider packages and the AI SDK to the latest version.

[Previous

Missing Tool Results Error](/docs/troubleshooting/missing-tool-results-error)[Next

TypeScript error "Cannot find namespace 'JSX'"](/docs/troubleshooting/typescript-cannot-find-namespace-jsx)
