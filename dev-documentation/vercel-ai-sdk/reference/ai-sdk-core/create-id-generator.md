---
title: "createIdGenerator()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-id-generator
section: reference
crawled: 2026-09-20
---

# createIdGenerator()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-id-generator

[AI SDK Core](/docs/ai-sdk-core)createIdGenerator


[`createIdGenerator()`](#createidgenerator)
===========================================

Creates a customizable ID generator function. You can configure the alphabet, prefix, separator, and default size of the generated IDs.

```
1

import { createIdGenerator } from 'ai';



2



3

const generateCustomId = createIdGenerator({



4

prefix: 'user',



5

separator: '_',



6

});



7



8

const id = generateCustomId(); // Example: "user_1a2b3c4d5e6f7g8h"
```

[Import](#import)
-----------------

```
import { createIdGenerator } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### options:

object

### options.alphabet:

string

### options.prefix:

string

### options.separator:

string

### options.size:

number

### [Returns](#returns)

Returns a function that generates IDs based on the configured options.

### [Notes](#notes)

* The generator uses non-secure random generation and should not be used for security-critical purposes.
* The separator character must not be part of the alphabet to ensure reliable prefix checking.

[Example](#example)
-------------------

```
1

// Create a custom ID generator for user IDs



2

const generateUserId = createIdGenerator({



3

prefix: 'user',



4

separator: '_',



5

size: 8,



6

});



7



8

// Generate IDs



9

const id1 = generateUserId(); // e.g., "user_1a2b3c4d"
```

[See also](#see-also)
---------------------

* [`generateId()`](/docs/reference/ai-sdk-core/generate-id)

[Previous

generateId](/docs/reference/ai-sdk-core/generate-id)[Next

DefaultGeneratedFile](/docs/reference/ai-sdk-core/default-generated-file)
