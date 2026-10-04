---
title: "TypeScript error \"Cannot find namespace 'JSX'\""
source_url: https://ai-sdk.dev/docs/troubleshooting/typescript-cannot-find-namespace-jsx
section: troubleshooting
crawled: 2026-09-20
---

# TypeScript error "Cannot find namespace 'JSX'"

> Source: https://ai-sdk.dev/docs/troubleshooting/typescript-cannot-find-namespace-jsx

[Troubleshooting](/docs/troubleshooting)TypeScript error "Cannot find namespace 'JSX'"


[TypeScript error "Cannot find namespace 'JSX'"](#typescript-error-cannot-find-namespace-jsx)
=============================================================================================

[Issue](#issue)
---------------

I am using the AI SDK in a project without React, e.g. an Hono server, and I get the following error:
`error TS2503: Cannot find namespace 'JSX'.`

[Background](#background)
-------------------------

The AI SDK has a dependency on `@types/react` which defines the `JSX` namespace.
It will be removed in the next major version of the AI SDK.

[Solution](#solution)
---------------------

You can install the `@types/react` package as a dependency to fix the error.

```
1

npm install @types/react
```

[Previous

Model is not assignable to type "LanguageModelV1"](/docs/troubleshooting/model-is-not-assignable-to-type)[Next

React error "Maximum update depth exceeded"](/docs/troubleshooting/react-maximum-update-depth-exceeded)
