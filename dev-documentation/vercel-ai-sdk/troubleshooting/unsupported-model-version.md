---
title: "Unsupported model version error"
source_url: https://ai-sdk.dev/docs/troubleshooting/unsupported-model-version
section: troubleshooting
crawled: 2026-09-20
---

# Unsupported model version error

> Source: https://ai-sdk.dev/docs/troubleshooting/unsupported-model-version

[Troubleshooting](/docs/troubleshooting)Unsupported model version error


[Unsupported model version error](#unsupported-model-version-error)
===================================================================

[Issue](#issue)
---------------

When migrating to AI SDK 5, you might encounter an error stating that your model uses an unsupported version:

```
1

AI_UnsupportedModelVersionError: Unsupported model version v1 for provider "ollama.chat" and model "gamma3:4b".



2

AI SDK 5 only supports models that implement specification version "v2".
```

This error occurs because the version of the provider package you're using implements the older (v1) model specification.

[Background](#background)
-------------------------

AI SDK 5 requires all provider packages to implement specification version "v2". When you upgrade to AI SDK 5 but don't update your provider packages to compatible versions, they continue using the older "v1" specification, causing this error.

[Solution](#solution)
---------------------

### [Update provider packages to AI SDK 5 compatible versions](#update-provider-packages-to-ai-sdk-5-compatible-versions)

Update all your `@ai-sdk/*` provider packages to compatible version `2.0.0` or later. These versions implement the v2 specification required by AI SDK 5.

```
1

pnpm install ai@latest @ai-sdk/openai@latest @ai-sdk/anthropic@latest
```

For AI SDK 5 compatibility, you need:

* `ai` package: `5.0.0` or later
* `@ai-sdk/*` packages: `2.0.0` or later (for example, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`)
* `@ai-sdk/provider` package: `2.0.0` or later
* `zod` package: `4.1.8` or later

### [Check provider compatibility](#check-provider-compatibility)

If you're using a third-party or custom provider, verify that it has been updated to support AI SDK 5. Not all providers may have v2-compatible versions available yet.

To check if a provider supports AI SDK 5:

1. Check the provider's package.json for `@ai-sdk/provider` peer dependency version `2.0.0` or later
2. Review the provider's changelog or migration guide
3. Check the provider's repository for AI SDK 5 support

For more information on migrating to AI SDK 5, see the [AI SDK 5.0 migration guide](/docs/migration-guides/migration-guide-5-0).

[Previous

Type Error with onToolCall](/docs/troubleshooting/ontoolcall-type-narrowing)[Next

Object generation failed with OpenAI](/docs/troubleshooting/no-object-generated-content-filter)
