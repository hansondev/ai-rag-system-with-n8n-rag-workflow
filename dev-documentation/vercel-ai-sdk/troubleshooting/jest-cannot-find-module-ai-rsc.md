---
title: "Jest: cannot find module '@ai-sdk/rsc'"
source_url: https://ai-sdk.dev/docs/troubleshooting/jest-cannot-find-module-ai-rsc
section: troubleshooting
crawled: 2026-09-20
---

# Jest: cannot find module '@ai-sdk/rsc'

> Source: https://ai-sdk.dev/docs/troubleshooting/jest-cannot-find-module-ai-rsc

[Troubleshooting](/docs/troubleshooting)Jest: cannot find module '@ai-sdk/rsc'


[Jest: cannot find module '@ai-sdk/rsc'](#jest-cannot-find-module-ai-sdkrsc)
============================================================================

[Issue](#issue)
---------------

I am using AI SDK RSC and am writing tests for my RSC components with Jest.

I am getting the following error: `Cannot find module '@ai-sdk/rsc'`.

[Solution](#solution)
---------------------

Configure the module resolution via `jest config update` in `moduleNameMapper`:

jest.config.js

```
1

"moduleNameMapper": {



2

"^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"



3

}
```

[Previous

React error "Maximum update depth exceeded"](/docs/troubleshooting/react-maximum-update-depth-exceeded)[Next

High memory usage when processing many images](/docs/troubleshooting/high-memory-usage-with-images)
