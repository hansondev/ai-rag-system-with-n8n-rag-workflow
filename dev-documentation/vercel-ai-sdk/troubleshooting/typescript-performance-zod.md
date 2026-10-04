---
title: "TypeScript performance issues with Zod and AI SDK 5"
source_url: https://ai-sdk.dev/docs/troubleshooting/typescript-performance-zod
section: troubleshooting
crawled: 2026-09-20
---

# TypeScript performance issues with Zod and AI SDK 5

> Source: https://ai-sdk.dev/docs/troubleshooting/typescript-performance-zod

[Troubleshooting](/docs/troubleshooting)TypeScript performance issues with Zod and AI SDK 5


[TypeScript performance issues with Zod and AI SDK 5](#typescript-performance-issues-with-zod-and-ai-sdk-5)
===========================================================================================================

[Issue](#issue)
---------------

When using the AI SDK 5 with Zod, you may experience:

* TypeScript server crashes or hangs
* Extremely slow type checking in files that import AI SDK functions
* Error messages like "Type instantiation is excessively deep and possibly infinite"
* IDE becoming unresponsive when working with AI SDK code

[Background](#background)
-------------------------

The AI SDK 5 has specific compatibility requirements with Zod versions. When importing Zod using the standard import path (`import { z } from 'zod'`), TypeScript's type inference can become excessively complex, leading to performance degradation or crashes.

[Solution](#solution)
---------------------

### [Upgrade Zod to 4.1.8 or Later](#upgrade-zod-to-418-or-later)

The primary solution is to upgrade to Zod version 4.1.8 or later, which includes a fix for this module resolution issue:

```
1

pnpm add zod@^4.1.8
```

This version resolves the underlying problem where different module resolution settings were causing TypeScript to load the same Zod declarations twice, leading to expensive structural comparisons.

### [Alternative: Update TypeScript Configuration](#alternative-update-typescript-configuration)

If upgrading Zod isn't possible, you can update your `tsconfig.json` to use `moduleResolution: "nodenext"`:

```
1

{



2

"compilerOptions": {



3

"moduleResolution": "nodenext"



4

// ... other options



5

}



6

}
```

This resolves the TypeScript performance issues while allowing you to continue using the standard Zod import.

[Previous

Custom headers, body, and credentials not working with useChat](/docs/troubleshooting/use-chat-custom-request-options)[Next

useChat "An error occurred"](/docs/troubleshooting/use-chat-an-error-occurred)
