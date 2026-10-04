---
title: "React error \"Maximum update depth exceeded\""
source_url: https://ai-sdk.dev/docs/troubleshooting/react-maximum-update-depth-exceeded
section: troubleshooting
crawled: 2026-09-20
---

# React error "Maximum update depth exceeded"

> Source: https://ai-sdk.dev/docs/troubleshooting/react-maximum-update-depth-exceeded

[Troubleshooting](/docs/troubleshooting)React error "Maximum update depth exceeded"


[React error "Maximum update depth exceeded"](#react-error-maximum-update-depth-exceeded)
=========================================================================================

[Issue](#issue)
---------------

I am using the AI SDK in a React project with the `useChat` or `useCompletion` hooks
and I get the following error when AI responses stream in: `Maximum update depth exceeded`.

[Background](#background)
-------------------------

By default, the UI is re-rendered on every chunk that arrives.
This can overload the rendering, especially on slower devices or when complex components
need updating (e.g. Markdown). Throttling can mitigate this.

[Solution](#solution)
---------------------

Use the `throttle` option to throttle the UI updates:

### [`useChat`](#usechat)

page.tsx

```
1

const { messages, ... } = useChat({



2

// Throttle the messages and data updates to 50ms:



3

throttle: 50



4

})
```

### [`useCompletion`](#usecompletion)

page.tsx

```
1

const { completion, ... } = useCompletion({



2

// Throttle the completion and data updates to 50ms:



3

throttle: 50



4

})
```

[Previous

TypeScript error "Cannot find namespace 'JSX'"](/docs/troubleshooting/typescript-cannot-find-namespace-jsx)[Next

Jest: cannot find module '@ai-sdk/rsc'](/docs/troubleshooting/jest-cannot-find-module-ai-rsc)
